import {
  getChannel,
  getChannelByHandle,
  getCommentThreads,
  getPlaylistItems,
  getVideos,
} from "./client";

import { createServerClient } from "@/lib/supabase/server";


export interface PipelineResult {
  channelId: string;
  title: string;
  videosIngested: number;
  commentsIngested: number;
  success: boolean;
  error?: string;
}

/**
 * Full ingestion pipeline for a single channel.
 * 1. Fetch channel metadata → upsert channels
 * 2. Fetch uploads playlist → get last N video IDs
 * 3. Batch fetch video stats → upsert videos
 * 4. Fetch top comments for recent videos → insert comments
 *
 * Quota cost: ~13 units per channel (1 channel + 1 playlist + 1 videos batch + 10 comment calls)
 */
export async function ingestChannel(
  channelIdOrHandle: string,
  options: {
    maxVideos?: number;
    commentsPerVideo?: number;
    videosToComment?: number;
  } = {}
): Promise<PipelineResult> {
  const {
    maxVideos = 50,
    commentsPerVideo = 50,
    videosToComment = 10,
  } = options;

  const supabase = createServerClient();

  try {
    // Step 1: Fetch channel metadata
    const isHandle =
      channelIdOrHandle.startsWith("@") || !channelIdOrHandle.startsWith("UC");
    const channel = isHandle
      ? await getChannelByHandle(channelIdOrHandle)
      : await getChannel(channelIdOrHandle);

    if (!channel) {
      return {
        channelId: channelIdOrHandle,
        title: "",
        videosIngested: 0,
        commentsIngested: 0,
        success: false,
        error: `Channel not found: ${channelIdOrHandle}`,
      };
    }

    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

    // Upsert channel
    await supabase.from("channels").upsert(
      {
        channel_id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscriber_count: parseInt(channel.statistics.subscriberCount, 10),
        video_count: parseInt(channel.statistics.videoCount, 10),
        uploads_playlist_id: uploadsPlaylistId,
        thumbnail_url:
          channel.snippet.thumbnails.high?.url ??
          channel.snippet.thumbnails.default?.url ??
          null,
        custom_url: channel.snippet.customUrl ?? null,
        published_at: channel.snippet.publishedAt,
      },
      { onConflict: "channel_id" }
    );

    // Step 2: Fetch uploads playlist
    const playlistItems = await getPlaylistItems(uploadsPlaylistId, maxVideos);
    const videoIds = playlistItems.map((item) => item.contentDetails.videoId);

    if (videoIds.length === 0) {
      return {
        channelId: channel.id,
        title: channel.snippet.title,
        videosIngested: 0,
        commentsIngested: 0,
        success: true,
      };
    }

    // Step 3: Fetch video details + stats
    const videos = await getVideos(videoIds);

    const videoRows = videos.map((video) => ({
      video_id: video.id,
      channel_id: channel.id,
      published_at: video.snippet.publishedAt,
      title: video.snippet.title,
      description: video.snippet.description,
      tags: video.snippet.tags ?? [],
      category_id: video.snippet.categoryId,
      view_count: parseInt(video.statistics.viewCount, 10),
      like_count: parseInt(video.statistics.likeCount || "0", 10),
      comment_count: parseInt(video.statistics.commentCount || "0", 10),
      duration: video.contentDetails.duration,
    }));

    await supabase.from("videos").upsert(videoRows, {
      onConflict: "video_id",
    });

    // Step 4: Fetch comments for the most recent N videos
    const recentVideoIds = videoIds.slice(0, videosToComment);
    let totalComments = 0;

    for (const videoId of recentVideoIds) {
      const threads = await getCommentThreads(videoId, commentsPerVideo);

      if (threads.length === 0) continue;

      const commentRows = threads.map((thread) => ({
        video_id: videoId,
        channel_id: channel.id,
        comment_text:
          thread.snippet.topLevelComment.snippet.textOriginal ||
          thread.snippet.topLevelComment.snippet.textDisplay,
        author_name: thread.snippet.topLevelComment.snippet.authorDisplayName,
        author_channel_id:
          thread.snippet.topLevelComment.snippet.authorChannelId?.value ?? null,
        like_count: thread.snippet.topLevelComment.snippet.likeCount,
        published_at: thread.snippet.topLevelComment.snippet.publishedAt,
      }));

      await supabase.from("comments").upsert(commentRows, {
        onConflict: "id",
        ignoreDuplicates: true,
      });

      totalComments += commentRows.length;
    }

    return {
      channelId: channel.id,
      title: channel.snippet.title,
      videosIngested: videoRows.length,
      commentsIngested: totalComments,
      success: true,
    };
  } catch (error) {
    return {
      channelId: channelIdOrHandle,
      title: "",
      videosIngested: 0,
      commentsIngested: 0,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
