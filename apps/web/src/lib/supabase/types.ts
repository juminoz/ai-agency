export interface Channel {
  channel_id: string;
  title: string;
  description: string | null;
  subscriber_count: number;
  video_count: number;
  uploads_playlist_id: string | null;
  thumbnail_url: string | null;
  custom_url: string | null;
  published_at: string | null;
  fetched_at: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  video_id: string;
  channel_id: string;
  published_at: string | null;
  title: string;
  description: string | null;
  tags: string[];
  category_id: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  duration: string | null;
  fetched_at: string;
}

export interface Comment {
  id: string;
  video_id: string;
  channel_id: string;
  comment_text: string;
  author_name: string | null;
  author_channel_id: string | null;
  like_count: number;
  published_at: string | null;
  fetched_at: string;
}

export interface ChannelScore {
  id: string;
  channel_id: string;
  topic_relevance: number;
  views_score: number;
  engagement_score: number;
  consistency_score: number;
  audience_match_score: number;
  authenticity_score: number;
  overall_score: number;
  scoring_context: ScoringContext;
  scored_at: string;
}

export interface ScoringContext {
  keywords?: string[];
  videos_analyzed?: number;
  comments_analyzed?: number;
  [key: string]: unknown;
}

export interface InterestProfile {
  id: string;
  channel_id: string;
  interests: Interest[];
  generated_at: string;
}

export interface Interest {
  category: string;
  confidence: number;
}

export type AnalysisType =
  | "comment_sentiment"
  | "authenticity"
  | "interest_graph";

export interface AiAnalysis {
  id: string;
  channel_id: string;
  analysis_type: AnalysisType;
  result: Record<string, unknown>;
  analyzed_at: string;
}

export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      channels: {
        Row: Channel;
        Insert: Omit<Channel, "created_at" | "updated_at" | "fetched_at">;
        Update: Partial<Omit<Channel, "channel_id">>;
      };
      videos: {
        Row: Video;
        Insert: Omit<Video, "fetched_at">;
        Update: Partial<Omit<Video, "video_id">>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, "id" | "fetched_at">;
        Update: Partial<Omit<Comment, "id">>;
      };
      channel_scores: {
        Row: ChannelScore;
        Insert: Omit<ChannelScore, "id" | "scored_at">;
        Update: Partial<Omit<ChannelScore, "id">>;
      };
      interest_profiles: {
        Row: InterestProfile;
        Insert: Omit<InterestProfile, "id" | "generated_at">;
        Update: Partial<Omit<InterestProfile, "id">>;
      };
      ai_analyses: {
        Row: AiAnalysis;
        Insert: Omit<AiAnalysis, "id" | "analyzed_at">;
        Update: Partial<Omit<AiAnalysis, "id">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
    };
  };
}
