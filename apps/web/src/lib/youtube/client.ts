import {
  type YouTubeChannel,
  type YouTubeCommentThread,
  type YouTubeListResponse,
  type YouTubePlaylistItem,
  type YouTubeVideo,
} from "./types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("Missing YOUTUBE_API_KEY");
  return key;
}

async function fetchYouTube<T>(
  endpoint: string,
  params: Record<string, string>,
): Promise<YouTubeListResponse<T>> {
  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  url.searchParams.set("key", getApiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 86400 }, // 24h cache
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`YouTube API error (${response.status}): ${error}`);
  }

  return response.json() as Promise<YouTubeListResponse<T>>;
}

/**
 * Fetch channel metadata by channel ID.
 * Quota cost: 1 unit
 */
export async function getChannel(
  channelId: string,
): Promise<YouTubeChannel | null> {
  const data = await fetchYouTube<YouTubeChannel>("channels", {
    part: "snippet,statistics,contentDetails",
    id: channelId,
  });
  return data.items[0] ?? null;
}

/**
 * Fetch channel by handle (e.g., @username).
 * Quota cost: 1 unit
 */
export async function getChannelByHandle(
  handle: string,
): Promise<YouTubeChannel | null> {
  const normalizedHandle = handle.startsWith("@") ? handle : `@${handle}`;
  const data = await fetchYouTube<YouTubeChannel>("channels", {
    part: "snippet,statistics,contentDetails",
    forHandle: normalizedHandle,
  });
  return data.items[0] ?? null;
}

/**
 * Fetch recent video IDs from a channel's uploads playlist.
 * Quota cost: 1 unit per page
 */
export async function getPlaylistItems(
  playlistId: string,
  maxResults: number = 50,
): Promise<YouTubePlaylistItem[]> {
  const allItems: YouTubePlaylistItem[] = [];
  let pageToken: string | undefined;

  while (allItems.length < maxResults) {
    const remaining = maxResults - allItems.length;
    const pageSize = Math.min(remaining, 50);

    const params: Record<string, string> = {
      part: "snippet,contentDetails",
      playlistId,
      maxResults: pageSize.toString(),
    };
    if (pageToken) params.pageToken = pageToken;

    const data = await fetchYouTube<YouTubePlaylistItem>(
      "playlistItems",
      params,
    );
    allItems.push(...data.items);

    if (!data.nextPageToken || data.items.length < pageSize) break;
    pageToken = data.nextPageToken;
  }

  return allItems;
}

/**
 * Fetch video details + stats by video IDs (batched by 50).
 * Quota cost: 1 unit per batch
 */
export async function getVideos(videoIds: string[]): Promise<YouTubeVideo[]> {
  const allVideos: YouTubeVideo[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const data = await fetchYouTube<YouTubeVideo>("videos", {
      part: "snippet,statistics,contentDetails",
      id: batch.join(","),
    });
    allVideos.push(...data.items);
  }

  return allVideos;
}

/**
 * Fetch top-level comments for a video.
 * Quota cost: 1 unit per call
 */
export async function getCommentThreads(
  videoId: string,
  maxResults: number = 50,
): Promise<YouTubeCommentThread[]> {
  try {
    const data = await fetchYouTube<YouTubeCommentThread>("commentThreads", {
      part: "snippet",
      videoId,
      maxResults: Math.min(maxResults, 100).toString(),
      order: "relevance",
      textFormat: "plainText",
    });
    return data.items;
  } catch {
    // Comments may be disabled on some videos
    return [];
  }
}
