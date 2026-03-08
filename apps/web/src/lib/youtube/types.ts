// YouTube Data API v3 response types

export interface YouTubeListResponse<T> {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: T[];
}

// channels.list
export interface YouTubeChannel {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    thumbnails: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
  contentDetails: {
    relatedPlaylists: {
      likes?: string;
      uploads: string;
    };
  };
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

// playlistItems.list
export interface YouTubePlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, YouTubeThumbnail>;
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails: {
    videoId: string;
    videoPublishedAt?: string;
  };
}

// videos.list
export interface YouTubeVideo {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, YouTubeThumbnail>;
    channelTitle: string;
    tags?: string[];
    categoryId: string;
  };
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
}

// commentThreads.list
export interface YouTubeCommentThread {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    channelId: string;
    videoId: string;
    topLevelComment: {
      kind: string;
      etag: string;
      id: string;
      snippet: {
        videoId: string;
        textDisplay: string;
        textOriginal: string;
        authorDisplayName: string;
        authorProfileImageUrl: string;
        authorChannelId?: {
          value: string;
        };
        likeCount: number;
        publishedAt: string;
        updatedAt: string;
      };
    };
    canReply: boolean;
    totalReplyCount: number;
    isPublic: boolean;
  };
}
