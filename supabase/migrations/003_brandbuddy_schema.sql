-- ============================================================================
-- BrandBuddy: Full platform schema
-- Migration 003 — adds user subtype, brands, briefs, deals, messages,
--                  notifications, and creator profiles
-- ============================================================================

-- ─── 1. Add subtype to profiles (creator / brand) ────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subtype TEXT DEFAULT NULL
    CHECK (subtype IS NULL OR subtype IN ('creator', 'brand'));

-- Update the auto-create trigger to also capture subtype from metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, subtype)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE
      WHEN NEW.raw_user_meta_data->>'role' IN ('creator', 'brand')
      THEN NEW.raw_user_meta_data->>'role'
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ─── 2. Creator profiles (extends channels with marketplace data) ────────────
CREATE TABLE IF NOT EXISTS creator_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  channel_id TEXT REFERENCES channels(channel_id) ON DELETE CASCADE,
  handle TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  platform TEXT NOT NULL DEFAULT 'youtube' CHECK (platform IN ('youtube', 'twitch')),
  subscriber_count BIGINT DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  categories TEXT[] DEFAULT '{}',
  niche_tags TEXT[] DEFAULT '{}',
  availability_status TEXT DEFAULT 'open' CHECK (availability_status IN ('open', 'limited', 'closed')),
  minimum_deal_size INTEGER DEFAULT 0,
  brand_preferences_open TEXT[] DEFAULT '{}',
  brand_preferences_blocked TEXT[] DEFAULT '{}',
  public_profile_url TEXT,
  channel_url TEXT,

  -- Score (denormalized from channel_scores for fast reads)
  score_overall REAL DEFAULT 0,
  score_topic_relevance REAL DEFAULT 0,
  score_recent_views REAL DEFAULT 0,
  score_engagement_health REAL DEFAULT 0,
  score_authenticity REAL DEFAULT 0,
  score_activity_consistency REAL DEFAULT 0,
  score_comment_audience_match REAL DEFAULT 0,

  -- Niche ranking
  niche_percentile REAL DEFAULT 0,
  niche_category TEXT,
  niche_tier TEXT,

  -- Performance trend
  views_trend TEXT,
  engagement_trend TEXT,
  trend_narrative TEXT,

  -- Authenticity detail
  authenticity_score REAL DEFAULT 0,
  fake_follower_risk TEXT DEFAULT 'unknown',
  view_spike_detected BOOLEAN DEFAULT FALSE,
  comment_quality REAL DEFAULT 0,
  like_to_view_normality REAL DEFAULT 0,

  -- Audience interests (JSONB for flexibility)
  audience_interests JSONB DEFAULT '[]',

  -- Track record
  completed_campaigns INTEGER DEFAULT 0,
  delivery_rate REAL DEFAULT 100,
  avg_performance_vs_projection TEXT,
  avg_rating REAL DEFAULT 0,

  -- Deal history (JSONB — lightweight, doesn't need relational queries)
  deal_history JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(channel_id),
  UNIQUE(handle)
);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_platform ON creator_profiles(platform);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_score ON creator_profiles(score_overall DESC);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_categories ON creator_profiles USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_niche_tags ON creator_profiles USING GIN(niche_tags);

-- ─── 3. Creator videos (recent videos for profile display) ──────────────────
CREATE TABLE IF NOT EXISTS creator_videos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  creator_id TEXT NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  video_id TEXT, -- platform video ID
  title TEXT NOT NULL,
  published_at DATE,
  views BIGINT DEFAULT 0,
  likes BIGINT DEFAULT 0,
  comments INTEGER DEFAULT 0,
  engagement_rate REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creator_videos_creator_id ON creator_videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_videos_published ON creator_videos(published_at DESC);

-- ─── 4. Brands ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  logo TEXT,
  category TEXT,
  description TEXT,

  -- Target audience
  target_age_range TEXT,
  target_gender TEXT DEFAULT 'all',
  target_interests TEXT[] DEFAULT '{}',
  target_locations TEXT[] DEFAULT '{}',

  completed_deals INTEGER DEFAULT 0,
  reliability_score REAL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_brands_category ON brands(category);

-- ─── 5. Briefs (campaign briefs posted by brands) ───────────────────────────
CREATE TABLE IF NOT EXISTS briefs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  budget_min INTEGER DEFAULT 0,
  budget_max INTEGER DEFAULT 0,
  platform TEXT DEFAULT 'youtube',
  goal TEXT CHECK (goal IN ('awareness', 'consideration', 'conversion', 'engagement')),
  content_formats TEXT[] DEFAULT '{}',
  timeline TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_briefs_brand_id ON briefs(brand_id);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);

-- ─── 6. Deals ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  creator_id TEXT NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  brief_id TEXT REFERENCES briefs(id) ON DELETE SET NULL,

  status TEXT NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'negotiating', 'agreed', 'live', 'completed', 'reviewed', 'declined', 'cancelled')),

  -- Brief snapshot (denormalized so deal retains context even if brief changes)
  brief_title TEXT,
  brief_budget_min INTEGER DEFAULT 0,
  brief_budget_max INTEGER DEFAULT 0,
  brief_format TEXT,
  brief_timeline TEXT,
  brief_goal TEXT,
  brief_deliverables TEXT,
  brief_exclusivity_category TEXT,
  brief_exclusivity_window TEXT,

  match_score REAL,
  agreed_rate INTEGER,
  campaign_url TEXT,

  -- Performance (populated when live/completed)
  projected_views BIGINT,
  actual_views BIGINT,
  projected_engagements BIGINT,
  actual_engagements BIGINT,
  days_live INTEGER,
  performance_status TEXT CHECK (performance_status IS NULL OR performance_status IN ('above_target', 'on_target', 'below_target')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deals_brand_id ON deals(brand_id);
CREATE INDEX IF NOT EXISTS idx_deals_creator_id ON deals(creator_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);

-- ─── 7. Deal messages ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deal_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  deal_id TEXT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('brand', 'creator')),
  sender_name TEXT,
  text TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deal_messages_deal_id ON deal_messages(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_messages_sent_at ON deal_messages(sent_at);

-- ─── 8. Deal reviews (mutual) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deal_reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  deal_id TEXT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  reviewer_type TEXT NOT NULL CHECK (reviewer_type IN ('brand', 'creator')),
  delivery_rating INTEGER CHECK (delivery_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(deal_id, reviewer_type)
);

CREATE INDEX IF NOT EXISTS idx_deal_reviews_deal_id ON deal_reviews(deal_id);

-- ─── 9. Notifications ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  type TEXT NOT NULL CHECK (type IN ('match_alert', 'new_deal', 'deal_status', 'message', 'campaign_alert', 'data_refresh', 'system')),
  title TEXT NOT NULL,
  body TEXT,
  recipient_type TEXT CHECK (recipient_type IN ('brand', 'creator', 'admin')),
  recipient_id TEXT, -- references brand.id or creator_profiles.id
  related_id TEXT,   -- generic FK to deal/brief/etc
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ─── 10. Shortlists ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shortlists (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brief_id TEXT REFERENCES briefs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shortlists_brand_id ON shortlists(brand_id);

CREATE TABLE IF NOT EXISTS shortlist_creators (
  shortlist_id TEXT NOT NULL REFERENCES shortlists(id) ON DELETE CASCADE,
  creator_id TEXT NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (shortlist_id, creator_id)
);

-- ─── 11. RLS policies ──────────────────────────────────────────────────────

-- Brands: owners can CRUD their own
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands are viewable by all authenticated users"
  ON brands FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Brand owners can update their brand"
  ON brands FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Brand owners can insert their brand"
  ON brands FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Creator profiles: public read, owner write
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator profiles are viewable by all authenticated users"
  ON creator_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creator profile owners can update"
  ON creator_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Creator profile owners can insert"
  ON creator_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Deals: parties can see their own deals
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deal participants can view deals"
  ON deals FOR SELECT
  TO authenticated
  USING (
    brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
    OR creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Brands can create deals"
  ON deals FOR INSERT
  WITH CHECK (
    brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
  );

CREATE POLICY "Deal participants can update deals"
  ON deals FOR UPDATE
  USING (
    brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
    OR creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
  );

-- Deal messages: parties can read/write
ALTER TABLE deal_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deal message participants can view"
  ON deal_messages FOR SELECT
  TO authenticated
  USING (
    deal_id IN (
      SELECT id FROM deals WHERE
        brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
        OR creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Deal message participants can insert"
  ON deal_messages FOR INSERT
  WITH CHECK (
    deal_id IN (
      SELECT id FROM deals WHERE
        brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
        OR creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
    )
  );

-- Notifications: recipients can read their own
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (true); -- simplified for hackathon; production would filter by recipient

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (true);

-- Briefs: public read, brand owner write
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Briefs are viewable by all authenticated users"
  ON briefs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Brand owners can manage briefs"
  ON briefs FOR ALL
  USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

-- Shortlists: brand owner only
ALTER TABLE shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brand owners can manage shortlists"
  ON shortlists FOR ALL
  TO authenticated
  USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

ALTER TABLE shortlist_creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brand owners can manage shortlist creators"
  ON shortlist_creators FOR ALL
  TO authenticated
  USING (shortlist_id IN (
    SELECT id FROM shortlists WHERE brand_id IN (
      SELECT id FROM brands WHERE user_id = auth.uid()
    )
  ));

-- Creator videos: public read
ALTER TABLE creator_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator videos are viewable by all authenticated users"
  ON creator_videos FOR SELECT
  TO authenticated
  USING (true);

-- Deal reviews: public read
ALTER TABLE deal_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deal reviews are viewable by all authenticated users"
  ON deal_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Deal participants can insert reviews"
  ON deal_reviews FOR INSERT
  WITH CHECK (
    deal_id IN (
      SELECT id FROM deals WHERE
        brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
        OR creator_id IN (SELECT id FROM creator_profiles WHERE user_id = auth.uid())
    )
  );

-- ─── 12. Updated_at triggers ────────────────────────────────────────────────

CREATE TRIGGER creator_profiles_updated_at
  BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER briefs_updated_at
  BEFORE UPDATE ON briefs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
