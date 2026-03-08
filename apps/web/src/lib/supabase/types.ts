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

// ── BrandBuddy marketplace types ──────────────────────────────────────────

export type ProfileSubtype = "creator" | "brand" | null;

export interface CreatorProfile {
  id: string;
  user_id: string | null;
  channel_id: string | null;
  handle: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  platform: "youtube" | "twitch";
  subscriber_count: number;
  video_count: number;
  categories: string[];
  niche_tags: string[];
  availability_status: "open" | "limited" | "closed";
  minimum_deal_size: number;
  brand_preferences_open: string[];
  brand_preferences_blocked: string[];
  public_profile_url: string | null;
  channel_url: string | null;
  score_overall: number;
  score_topic_relevance: number;
  score_recent_views: number;
  score_engagement_health: number;
  score_authenticity: number;
  score_activity_consistency: number;
  score_comment_audience_match: number;
  niche_percentile: number;
  niche_category: string | null;
  niche_tier: string | null;
  views_trend: string | null;
  engagement_trend: string | null;
  trend_narrative: string | null;
  authenticity_score: number;
  fake_follower_risk: string;
  view_spike_detected: boolean;
  comment_quality: number;
  like_to_view_normality: number;
  audience_interests: { category: string; confidence: number }[];
  completed_campaigns: number;
  delivery_rate: number;
  avg_performance_vs_projection: string | null;
  avg_rating: number;
  deal_history: { brand: string; rate: number; format: string; date: string; outcome: string }[];
  created_at: string;
  updated_at: string;
}

export interface CreatorVideo {
  id: string;
  creator_id: string;
  video_id: string | null;
  title: string;
  published_at: string | null;
  views: number;
  likes: number;
  comments: number;
  engagement_rate: number;
  created_at: string;
}

export interface Brand {
  id: string;
  user_id: string | null;
  name: string;
  logo: string | null;
  category: string | null;
  description: string | null;
  target_age_range: string | null;
  target_gender: string;
  target_interests: string[];
  target_locations: string[];
  completed_deals: number;
  reliability_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Brief {
  id: string;
  brand_id: string;
  title: string;
  description: string | null;
  budget_min: number;
  budget_max: number;
  platform: string;
  goal: "awareness" | "consideration" | "conversion" | "engagement" | null;
  content_formats: string[];
  timeline: string | null;
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  brand_id: string;
  creator_id: string;
  brief_id: string | null;
  status: "received" | "negotiating" | "agreed" | "live" | "completed" | "reviewed" | "declined" | "cancelled";
  brief_title: string | null;
  brief_budget_min: number;
  brief_budget_max: number;
  brief_format: string | null;
  brief_timeline: string | null;
  brief_goal: string | null;
  brief_deliverables: string | null;
  brief_exclusivity_category: string | null;
  brief_exclusivity_window: string | null;
  match_score: number | null;
  agreed_rate: number | null;
  campaign_url: string | null;
  projected_views: number | null;
  actual_views: number | null;
  projected_engagements: number | null;
  actual_engagements: number | null;
  days_live: number | null;
  performance_status: "above_target" | "on_target" | "below_target" | null;
  created_at: string;
  updated_at: string;
}

export interface DealMessage {
  id: string;
  deal_id: string;
  sender_type: "brand" | "creator";
  sender_name: string | null;
  text: string;
  sent_at: string;
}

export interface DealReview {
  id: string;
  deal_id: string;
  reviewer_type: "brand" | "creator";
  delivery_rating: number | null;
  communication_rating: number | null;
  overall_rating: number | null;
  note: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  type: "match_alert" | "new_deal" | "deal_status" | "message" | "campaign_alert" | "data_refresh" | "system";
  title: string;
  body: string | null;
  recipient_type: "brand" | "creator" | "admin" | null;
  recipient_id: string | null;
  related_id: string | null;
  read: boolean;
  created_at: string;
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
