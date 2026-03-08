-- ============================================================================
-- Vettd: Initial Schema
-- ============================================================================

-- Channels table
CREATE TABLE IF NOT EXISTS channels (
  channel_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subscriber_count BIGINT DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  uploads_playlist_id TEXT,
  thumbnail_url TEXT,
  custom_url TEXT,
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  video_id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL REFERENCES channels(channel_id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  category_id TEXT,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count BIGINT DEFAULT 0,
  duration TEXT,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON videos(channel_id);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at DESC);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  video_id TEXT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL REFERENCES channels(channel_id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  author_name TEXT,
  author_channel_id TEXT,
  like_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_channel_id ON comments(channel_id);

-- Channel scores table
CREATE TABLE IF NOT EXISTS channel_scores (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  channel_id TEXT NOT NULL REFERENCES channels(channel_id) ON DELETE CASCADE,
  topic_relevance REAL DEFAULT 0,
  views_score REAL DEFAULT 0,
  engagement_score REAL DEFAULT 0,
  consistency_score REAL DEFAULT 0,
  audience_match_score REAL DEFAULT 0,
  authenticity_score REAL DEFAULT 0,
  overall_score REAL DEFAULT 0,
  scoring_context JSONB DEFAULT '{}',
  scored_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id)
);

CREATE INDEX IF NOT EXISTS idx_channel_scores_overall ON channel_scores(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_channel_scores_channel_id ON channel_scores(channel_id);

-- Interest profiles table
CREATE TABLE IF NOT EXISTS interest_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  channel_id TEXT NOT NULL REFERENCES channels(channel_id) ON DELETE CASCADE,
  interests JSONB DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id)
);

CREATE INDEX IF NOT EXISTS idx_interest_profiles_channel_id ON interest_profiles(channel_id);

-- AI analyses table
CREATE TYPE analysis_type AS ENUM ('comment_sentiment', 'authenticity', 'interest_graph');

CREATE TABLE IF NOT EXISTS ai_analyses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  channel_id TEXT NOT NULL REFERENCES channels(channel_id) ON DELETE CASCADE,
  analysis_type analysis_type NOT NULL,
  result JSONB DEFAULT '{}',
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_analyses_channel_id ON ai_analyses(channel_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_type ON ai_analyses(analysis_type);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER channels_updated_at
  BEFORE UPDATE ON channels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
