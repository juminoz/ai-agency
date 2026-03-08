**Brand Buddy**

Feature Specification for Development

Creator–Brand Marketplace · v1.0 · Must-Have + Roadmap

# **How to Read This Spec**

Every feature is tagged with a priority and a category. These tags are the dev team's instruction set for what to build in which order.



| MVP Must-have for launch | V2 Second release / post-launch | NICE Nice to have, not blocking | API Requires external API integration | AUTH Requires user auth / permissions |
| :---- | :---- | :---- | :---- | :---- |





*Features tagged API require a third-party API key or integration to be set up before development begins. Features tagged AUTH require the authentication and session system to be in place first. Build auth before everything else.*

# **Feature Count Summary**

| Section | MVP | V2 | NICE | Total |
| :---- | :---- | :---- | :---- | :---- |
| **Creator View** | **30** | **14** | **0** | 44 |
| **Brand View** | **27** | **14** | **2** | 43 |
| **Shared** | **19** | **7** | **1** | 27 |
| **TOTAL** | **76** | **35** | **3** | **114** |





Total features in this specification: 114. MVP features represent the minimum viable product required for a first public launch. V2 features represent the post-launch roadmap. Build in the order they appear within each section.



| 1. Creator View Features for creators registering and managing their presence on Brand Buddy |
| :---- |



**AUTHENTICATION & REGISTRATION**



| 1 | MVP | Account Registration Sign up with email + password. Creator selects account type (Individual / Agency). Email verification required before profile is activated. |
| :---: | :---: | :---- |



| 2 | MVP | Channel Connect & Verify Enter YouTube handle or Twitch username. Brand Buddy calls the platform API, verifies the channel exists, and pulls basic stats to confirm ownership context. No OAuth required for basic verification. |
| :---: | :---: | :---- |



| 3 | V2 | OAuth — Analytics Unlock (YouTube) Optional: connect YouTube account via Google OAuth to unlock real demographic data (age, gender, geography) from the YouTube Analytics API. Unlocks Verified Demographics badge and boosts search ranking. |
| :---: | :---: | :---- |



| 4 | MVP | Login — Email / Password Standard email + password login with session management and remember-me token. |
| :---: | :---: | :---- |



| 5 | V2 | Login — Google SSO Single sign-on via Google account. Required if creator wants to connect YouTube Analytics. |
| :---: | :---: | :---- |



| 6 | MVP | Password Reset Flow Forgot password → email link → reset form. Standard secure flow. |
| :---: | :---: | :---- |



| 7 | V2 | Two-Factor Authentication Optional 2FA via authenticator app or SMS for account security. |
| :---: | :---: | :---- |





**PROFILE & CHANNEL SETUP**



| 8 | MVP | Auto-Generated Channel Profile On connect, Brand Buddy runs the full API pipeline: uploads playlist → video stats → comment sample. Computes all metrics automatically. Creator does not manually enter any channel data. |
| :---: | :---: | :---- |



| 9 | MVP | Profile Completeness Indicator Progress bar showing how complete the creator profile is. Missing items (categories, min budget, availability) are flagged with specific prompts. |
| :---: | :---: | :---- |



| 10 | MVP | Category & Niche Tags Creator selects primary content categories and can add custom niche tags. Affects brand search ranking and match scoring. |
| :---: | :---: | :---- |



| 11 | MVP | Minimum Deal Size Creator sets a minimum budget threshold. Brands below this threshold see the creator in results but cannot initiate contact without meeting the floor. |
| :---: | :---: | :---- |



| 12 | MVP | Brand Category Preferences Creator opts into and out of brand categories. E.g. open to: tech, food, gaming. Blocked: alcohol, gambling, adult content. Blocks are enforced — those brands will not see the creator in results. |
| :---: | :---: | :---- |



| 13 | MVP | Availability Status Toggle: Open to deals / Not currently available. Visible to brands in search results. Auto-prompt to update if status has not changed in 30 days. |
| :---: | :---: | :---- |



| 14 | V2 | Availability Calendar Creator marks booked or unavailable windows. Brands can filter search by availability for a specific campaign date range. |
| :---: | :---: | :---- |



| 15 | MVP | Media Kit URL Optional link to an external media kit or portfolio. Displayed on public profile. |
| :---: | :---: | :---- |



| 16 | MVP | Bio / Pitch Statement Short free-text field (max 280 characters) for a creator's own pitch statement. Shown on public profile above data. |
| :---: | :---: | :---- |



| 17 | MVP | Public Profile URL Every creator gets a canonical public URL: brandbuddy.com/c/[handle]. Shareable. Always shows live, current data. |
| :---: | :---: | :---- |



| 18 | V2 | Verified Metrics Badge Embeddable badge (HTML snippet + image) linking to the creator's live Brand Buddy profile. Usable in email signatures, websites, media kits. |
| :---: | :---: | :---- |





**CREATOR DASHBOARD**



| 19 | MVP | Brand Buddy Score Overview Prominent display of current Brand Buddy Score (0–100) with breakdown: which of the 6 components is highest and lowest, and what is dragging the score down. Components: topic relevance, recent views, engagement health, authenticity, activity/consistency, comment-audience match. |
| :---: | :---: | :---- |



| 20 | MVP | Niche Ranking Shows where the creator ranks within their category cluster by subscriber tier. "Top 14% for engagement rate among tech creators at your scale." |
| :---: | :---: | :---- |



| 21 | MVP | Performance Trend Chart Views, engagement rate, and upload frequency plotted over last 90 days. Highlights upward or downward trends. |
| :---: | :---: | :---- |



| 22 | MVP | Performance Trend Narrative Auto-generated plain-English summary of the last 90 days. Updated weekly. "Average views up 22% this quarter. Your best-performing format is product reviews. Optimal video length for your audience: under 14 minutes." |
| :---: | :---: | :---- |



| 23 | MVP | Audience Interest Map Visual graph of inferred audience interests beyond the creator's own content category. Shows lateral interests that represent cross-category brand opportunities. |
| :---: | :---: | :---- |



| 24 | MVP | Authenticity Report Full fake engagement analysis: bot likelihood score, ghost follower risk, view spike detection, comment-to-like ratio, engagement consistency. Presented as a score + flagged patterns. |
| :---: | :---: | :---- |



| 25 | MVP | Recent Video Performance Table Last 20 videos with title, publish date, views, likes, comments, and individual engagement rate. Sortable. |
| :---: | :---: | :---- |



| 26 | V2 | Comment Sentiment Summary AI-generated summary of what the creator's audience says in comments. Audience identity signals, purchase intent language, recurring themes. Updated on each data refresh. |
| :---: | :---: | :---- |



| 27 | V2 | Score Improvement Tips Based on current weak points in the Brand Buddy Score, specific actionable recommendations. "Posting twice per week instead of once would move your upload velocity score from 42 to 71." |
| :---: | :---: | :---- |



| 28 | MVP | Data Refresh Status Timestamp of last data pull. Manual refresh button with 24-hour cooldown to manage API quota. |
| :---: | :---: | :---- |





**BRAND DISCOVERY**



| 29 | MVP | Brand Opportunity Feed List of brands currently active on Brand Buddy, ranked by audience match score against the creator's profile. Not a generic directory — personalised and scored. |
| :---: | :---: | :---- |



| 30 | MVP | Brand Fit Preview Before signalling interest in a brand, creator sees their simulated match rank: "If this brand searched right now, you would rank #4 out of matching creators." Shows the specific gap to close. |
| :---: | :---: | :---- |



| 31 | MVP | Availability Signal One-tap signal of interest in a specific brand. Does not send a pitch. Triggers a match notification on the brand side. Creator just raises their hand — the brand discovers and initiates. |
| :---: | :---: | :---- |



| 32 | V2 | Market Rate Indicator Based on comparable creators' Brand Buddy Scores and tiers, shows the current rate range for integrations. "Creators like you typically command $800–$2,400 per integration." Sourced from anonymised deal data on platform. |
| :---: | :---: | :---- |



| 33 | V2 | Outreach Draft Tool Optional tool (not the primary workflow). Creator selects a brand, Claude drafts a pitch using their actual metrics. Every number is pulled live. For creators who want to initiate directly. |
| :---: | :---: | :---- |





**DEAL MANAGEMENT**



| 34 | MVP | Inbound Deal Inbox When a brand initiates contact, creator receives a structured brief: brand name, product category, campaign goal, budget range, content format, timeline. Creator can Accept / Decline / Counter. |
| :---: | :---: | :---- |



| 35 | MVP | Deal Status Tracker Each active deal moves through statuses: Received → Negotiating → Agreed → Live → Completed → Reviewed. Visible to both parties. |
| :---: | :---: | :---- |



| 36 | MVP | Counter-Offer Flow Creator can respond to a brand brief with a counter — rate, timeline, or format change — without leaving the platform. |
| :---: | :---: | :---- |



| 37 | V2 | Content Exclusivity Display Shows the creator's active exclusivity commitments by category and expiry date. Warns before accepting a deal that conflicts with an existing exclusivity window. |
| :---: | :---: | :---- |



| 38 | MVP | Deal History Log Private record of all past deals: brand, rate, format, dates, outcome. Used to populate market rate suggestions. Never shared with other creators. |
| :---: | :---: | :---- |



| 39 | MVP | Campaign Outcome Logging After a deal completes, creator logs: views delivered, any performance notes. This adds a verified data point to their track record. |
| :---: | :---: | :---- |



| 40 | MVP | Campaign Track Record Public-facing verified delivery history. "5 completed campaigns, 100% delivery, avg 11% above projected views." Displayed on public profile. |
| :---: | :---: | :---- |





**AGENCY ACCOUNTS**



| 41 | V2 | Agency Account Type One login with multiple creator profiles managed underneath. Agency can view, edit, and respond to deals on behalf of any creator in their roster. |
| :---: | :---: | :---- |



| 42 | V2 | Roster Overview Dashboard Aggregated analytics across all managed creators: total combined reach, average Brand Buddy Score, active deals, open deal enquiries. |
| :---: | :---: | :---- |



| 43 | V2 | Bulk Availability Management Set availability windows across multiple creators at once. |
| :---: | :---: | :---- |



| 44 | V2 | Agency Profile Page Public agency page listing all represented creators. Brands can browse the full roster from one URL. |
| :---: | :---: | :---- |







| 2. Brand View Features for brands discovering creators, running campaigns, and tracking ROI |
| :---- |



**AUTHENTICATION & REGISTRATION**



| 1 | MVP | Account Registration Sign up with email + password. Brand selects account type (Direct Brand / Agency). Company name and product category required at registration. |
| :---: | :---: | :---- |



| 2 | MVP | Login — Email / Password Standard login with session management. |
| :---: | :---: | :---- |



| 3 | V2 | Login — Google SSO Single sign-on via Google Workspace. |
| :---: | :---: | :---- |



| 4 | MVP | Password Reset Flow Standard secure email reset flow. |
| :---: | :---: | :---- |



| 5 | V2 | Team Members / Seat Management Brand account can invite additional team members with role-based permissions: Admin (full access), Manager (can initiate deals), Viewer (read-only). |
| :---: | :---: | :---- |



| 6 | V2 | Two-Factor Authentication Optional 2FA for account security. |
| :---: | :---: | :---- |





**CREATOR SEARCH & DISCOVERY**



| 7 | MVP | Natural Language Campaign Brief Brand describes the campaign in plain text. Claude converts it into structured filters: platform, category, audience profile, budget, goal. The brief is the search query. |
| :---: | :---: | :---- |



| 8 | MVP | Structured Filter Search Fallback manual filter UI: platform, subscriber tier, content category, country, engagement rate minimum, Brand Buddy Score minimum, availability, deal size range. |
| :---: | :---: | :---- |



| 9 | MVP | AI-Ranked Match Results Results sorted by Brand Buddy Score (0–100). Each result shows the score and a one-sentence AI reasoning explaining why this creator matches the brief. Single score, single ranking — no sub-score breakdown in search results. |
| :---: | :---: | :---- |



| 10 | MVP | Platform Filter Filter results by YouTube only, Twitch only, or both. Future: Instagram, TikTok when APIs permit. |
| :---: | :---: | :---- |



| 11 | MVP | Subscriber Tier Filter Nano (<10K), Micro (10K–100K), Mid (100K–500K), Macro (500K–2M), Mega (2M+). |
| :---: | :---: | :---- |



| 12 | MVP | Availability Filter Filter to only show creators who are currently open to deals, or who are available within a specified date window. |
| :---: | :---: | :---- |



| 13 | MVP | Category & Niche Filter Primary content category plus free-text keyword search against creator niche tags. |
| :---: | :---: | :---- |



| 14 | V2 | Whitespace Discovery Mode Toggle that shows adjacent creator clusters with matching audience demographics but currently low competitor sponsorship. Surfaces underpriced inventory. |
| :---: | :---: | :---- |



| 15 | V2 | Budget Optimizer Input a total budget. Returns two options: one large creator vs a cluster of mid-tier creators. Shows projected combined reach, engagement, and cost-per-view for each option side by side. |
| :---: | :---: | :---- |



| 16 | V2 | Audience Overlap Calculator Brand inputs their customer profile: age range, gender split, interests, location. Brand Buddy re-scores all results against this specific profile, not just the campaign brief defaults. |
| :---: | :---: | :---- |



| 17 | V2 | Saved Searches Save a search filter set with a name. Re-run it with one click. Useful for recurring campaign types. |
| :---: | :---: | :---- |





**CREATOR EVALUATION**



| 18 | MVP | Creator Full Profile View Full metric breakdown: Brand Buddy Score components, engagement rate, view consistency, growth momentum, subscriber-to-view ratio, upload velocity, estimated CPM, cost efficiency score. |
| :---: | :---: | :---- |



| 19 | MVP | Recent Video Performance Table Last 20 videos with views, likes, comments, engagement rate per video. Sortable. |
| :---: | :---: | :---- |



| 20 | MVP | Authenticity / Fake Engagement Report Full risk report: bot likelihood score, ghost follower risk level (low/medium/high), view spike detection, comment-to-like ratio. Traffic light summary at the top. |
| :---: | :---: | :---- |



| 21 | MVP | Historical Consistency Report Variance analysis across last 50 videos. Shows standard deviation of views, flags outlier videos, and surfaces the underlying baseline performance beneath any viral spikes. |
| :---: | :---: | :---- |



| 22 | MVP | Comment Sentiment Analysis Claude categorises top sampled comments: purchase intent language, geographic cues, life-stage indicators, audience identity markers. Quantified percentages where possible. Clearly labelled as a sample. |
| :---: | :---: | :---- |



| 23 | MVP | Topic & Content Analysis Primary content topics extracted from recent video titles and tags. Inferred audience interests. Content tone classification. Brand safety score (0–100). |
| :---: | :---: | :---- |



| 24 | MVP | Audience Interest Graph Visual map of audience interest clusters. Shows creator's content topics alongside inferred lateral interests of their audience. |
| :---: | :---: | :---- |



| 25 | MVP | Campaign Projection (Single Creator) Input budget + campaign goal. Returns: estimated reach, expected engagements, estimated conversions, cost-per-engagement, cost-per-conversion, ROI score. Adjustable in real time. |
| :---: | :---: | :---- |



| 26 | MVP | Creator Track Record Verified delivery history from past Brand Buddy campaigns. Number of deals, delivery rate, average performance vs projection, brand satisfaction rating. |
| :---: | :---: | :---- |



| 27 | MVP | Side-by-Side Comparison Select 2–5 creators. Compare all metrics in a table. Add campaign projections column based on a shared budget. Export to CSV. |
| :---: | :---: | :---- |





**SHORTLIST & REPORTING**



| 28 | MVP | Shortlist (Saved Creators) Save creators to a named shortlist during a search session. Shortlist persists across sessions. Multiple shortlists allowed per brand account. |
| :---: | :---: | :---- |



| 29 | MVP | Shortlist Internal Report Generate a shareable internal report from a shortlist: creator profiles, match scores, projections, cost estimates. PDF export. For internal sign-off — not sent to creators. |
| :---: | :---: | :---- |



| 30 | V2 | Multi-Creator Campaign Simulation Run a combined campaign projection across all creators on a shortlist. Shows aggregate reach, engagement, conversions, total cost, and per-creator contribution breakdown. |
| :---: | :---: | :---- |



| 31 | V2 | Team Collaboration on Shortlist Shortlist can be shared with team members (if brand has team seats). Team members can add notes, upvote/downvote creators, and leave comments. |
| :---: | :---: | :---- |





**DEAL MANAGEMENT**



| 32 | MVP | Initiate Deal (Structured Brief) Brand sends a formal deal proposal to a creator: budget range, content format (dedicated video / integration / short / livestream mention), timeline, deliverables, exclusivity window, usage rights. |
| :---: | :---: | :---- |



| 33 | MVP | Deal Status Tracker Deal pipeline view: Sent → Accepted / Countered / Declined → Agreed → Live → Completed → Reviewed. |
| :---: | :---: | :---- |



| 34 | MVP | Counter-Offer Handling Brand receives and responds to creator counter-offers within the platform. |
| :---: | :---: | :---- |



| 35 | MVP | Campaign URL Logging After the content goes live, brand logs the video or post URL. Brand Buddy begins daily stat tracking. |
| :---: | :---: | :---- |



| 36 | MVP | Campaign Performance Tracker Daily pulls on the live video's stats vs projection. Dashboard shows current performance as a percentage of projected target. Alert if tracking significantly below projection. |
| :---: | :---: | :---- |



| 37 | V2 | Brand Safety Alert Automated re-scan of a creator's new uploads during an active campaign. Alert if a new video scores below brand safety threshold or contains flagged content categories. |
| :---: | :---: | :---- |



| 38 | V2 | ROI Outcome Logger Post-campaign: brand inputs actual outcome data — promo code redemptions, affiliate link clicks, UTM-tracked traffic. Brand Buddy calculates actual CPE and conversion rate vs projection. |
| :---: | :---: | :---- |



| 39 | V2 | Historical ROI Model After 3+ completed campaigns, Brand Buddy surfaces the brand's own performance patterns: best-performing creator tier, category, platform, and campaign goal type. |
| :---: | :---: | :---- |



| 40 | V2 | Content Exclusivity Enforcement When sending a deal brief, brand specifies exclusivity category and window. System flags if the creator already has an active exclusivity conflict. Exclusivity recorded in deal terms. |
| :---: | :---: | :---- |





**ADVANCED DISCOVERY**



| 41 | V2 | Trend Surfacing Weekly digest of which creator categories are showing rising engagement velocity. "Outdoor fitness creators +34% average views this quarter." Helps brands act on shifts before ad rates adjust. |
| :---: | :---: | :---- |



| 42 | NICE | Rising Creator Alerts Brand sets criteria for a creator type they want to work with. Brand Buddy alerts when a new creator matching those criteria joins or when an existing creator crosses a metric threshold. |
| :---: | :---: | :---- |



| 43 | NICE | Competitor Sponsorship Tracker Surfaces which creators in a given category have recent sponsored content from identified competitor brands. Helps identify saturated vs open sponsorship territory. |
| :---: | :---: | :---- |







| 3. Shared — Both Sides Messaging, notifications, reviews, integrations, and admin tools used by both user types |
| :---- |



**MESSAGING**



| 1 | MVP | In-Platform Threaded Messaging Per-deal message thread between creator and brand. Full history attached to the deal record. Replaces email negotiation. Both parties notified via email on new messages. |
| :---: | :---: | :---- |



| 2 | MVP | Message Templates Pre-built templates for common messages: initial deal enquiry, counter-offer, content brief details, approval request, deal confirmation. Editable before sending. |
| :---: | :---: | :---- |



| 3 | V2 | File Attachments Ability to attach files to messages: content briefs, contracts, creative assets. Max 20MB per attachment. |
| :---: | :---: | :---- |



| 4 | V2 | Read Receipts Message read status visible to sender. Unread badge on inbox icon. |
| :---: | :---: | :---- |



| 5 | MVP | Email Notification Digest New message notifications sent to email. Configurable: immediate / daily digest / weekly digest. |
| :---: | :---: | :---- |





**NOTIFICATIONS & ALERTS**



| 6 | MVP | In-App Notification Centre Bell icon with unread count. Notifications for: new deal enquiry, new message, deal status change, campaign performance alert, data refresh complete, match alert. |
| :---: | :---: | :---- |



| 7 | MVP | Email Notifications Configurable email alerts for key events. Separate controls for: deal activity, messages, weekly performance digest, platform announcements. |
| :---: | :---: | :---- |



| 8 | MVP | Match Notification (Creator) "A brand in [category] is looking for creators with your profile." Sent when a brand brief closely matches the creator. Links to the brand's public info and the creator's match score for that brief. |
| :---: | :---: | :---- |



| 9 | MVP | Match Notification (Brand) "A creator with an 87% match score for your brief has signalled availability." Sent when a creator raises their hand for a brand's active brief. |
| :---: | :---: | :---- |



| 10 | MVP | Campaign Alert Automated alert when a live campaign is tracking more than 20% below projected performance at day 7. |
| :---: | :---: | :---- |





**REVIEWS & REPUTATION**



| 11 | MVP | Post-Campaign Mutual Review After a deal is marked Complete, both parties are prompted to leave a private structured review: delivery score, communication score, overall rating, free-text note. Not public — used internally for reliability scoring. |
| :---: | :---: | :---- |



| 12 | MVP | Creator Reliability Score After 3+ completed campaigns, a creator's verified reliability score (delivery rate, avg performance vs projection, brand rating average) becomes visible to brands. Shown on creator profile. |
| :---: | :---: | :---- |



| 13 | V2 | Brand Reliability Score After 3+ completed deals, a brand's reliability score (payment speed rating, brief clarity rating, communication rating) becomes visible to creators in the deal inbox. |
| :---: | :---: | :---- |



| 14 | V2 | Review Dispute Flag Either party can flag a review as inaccurate. Flagged reviews are held pending manual review before affecting scores. |
| :---: | :---: | :---- |





**ANALYTICS & EXPORT**



| 15 | MVP | Shared Deal Analytics Both parties can see the campaign performance data for their shared deal: live video stats, daily view trend, projection vs actual. Same data, same view. |
| :---: | :---: | :---- |



| 16 | MVP | Data Export (CSV) Any table in the platform — search results, campaign stats, comparison tables — can be exported as CSV. |
| :---: | :---: | :---- |



| 17 | MVP | Shortlist PDF Report Brand-generated shortlist report exported as a formatted PDF. Creator names, scores, projections, cost estimates. Clean enough for a stakeholder presentation. |
| :---: | :---: | :---- |





**PLATFORM & API INTEGRATIONS**



| 18 | MVP | YouTube Data Integration Full pipeline: channels.list → playlistItems.list (uploads playlist) → videos.list (stats + snippet + tags) → commentThreads.list. 24-hour cache on all channel data to manage quota. |
| :---: | :---: | :---- |



| 19 | MVP | Twitch Data Integration Helix API: users, channel info, follower count, recent clips/VODs. App access token (no user OAuth required for read access). Noted: engagement data thinner than YouTube. |
| :---: | :---: | :---- |



| 20 | MVP | Claude AI Integration Powers: natural language brief parsing, topic analysis, comment sentiment, audience interest inference, brand alignment scoring, outreach draft, performance narrative. Uses claude-sonnet-4. |
| :---: | :---: | :---- |



| 21 | V2 | YouTube Analytics API (OAuth) Unlocked by creator consent flow. Provides: real demographic data, watch time, retention, traffic sources. Used to power Verified Demographics badge and deeper audience scoring. |
| :---: | :---: | :---- |



| 22 | V2 | Affiliate Link Generator Brand Buddy-generated tracked links for campaigns. Clicks and referral conversions feed back into campaign ROI tracking automatically. |
| :---: | :---: | :---- |



| 23 | NICE | Shopify / Impact Integration Connect a brand's Shopify store or Impact affiliate account to pull promo code redemptions and conversions directly into campaign ROI tracking. |
| :---: | :---: | :---- |





**ADMIN & MODERATION**



| 24 | MVP | Creator Registration Moderation New creator registrations are auto-approved after channel verification. Flag queue for accounts with suspicious signals (very new channels, <100 subscribers, verification mismatch). |
| :---: | :---: | :---- |



| 25 | MVP | Content Moderation Queue Flagged messages, reviews, and profiles held for manual review. Basic moderation tools: warn, suspend, remove. |
| :---: | :---: | :---- |



| 26 | MVP | Platform Analytics Dashboard Internal admin view: total registered creators by tier and category, total active brands, deals initiated, deals completed, monthly active users, API quota usage. |
| :---: | :---: | :---- |



| 27 | V2 | Feature Flags Per-account and global feature flags for staged rollout of V2 features. |
| :---: | :---: | :---- |







# **Development Notes**

**Build order recommendation:**



- **Phase 1 (core infrastructure):** Auth system (both account types), YouTube + Twitch API pipeline with caching, Claude AI integration, database schema for creators, brands, deals, and campaigns.

- **Phase 2 (MVP features):** Creator onboarding and dashboard, brand search and discovery, deal initiation and status tracking, in-platform messaging.

- **Phase 3 (MVP completion):** Campaign tracking, post-campaign logging, shortlist and PDF report, mutual reviews, public creator profile URLs.

- **Phase 4 (V2 features):** YouTube Analytics OAuth, agency accounts, budget optimiser, affiliate links, advanced discovery features, team seats.

- **Phase 5 (NICE features):** Shopify integration, competitor sponsorship tracker, rising creator alerts.





*API keys needed before development starts: YouTube Data API v3 (Google Cloud Console), Twitch Helix API (dev.twitch.tv), Anthropic API (console.anthropic.com). YouTube Analytics API requires OAuth app approval, which can take several days.*



*The filesystem-based store (store.ts) used in the current scaffold must be replaced with a proper database before any production deployment. Recommended: Supabase (Postgres) for structured relational data and easy row-level security for the two-sided auth model.*
