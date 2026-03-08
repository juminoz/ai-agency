# Vettd — Creator–Brand Marketplace

Workflows, Feature Set, Limitations & Roadmap Gaps · v2.1

---

## Overview

Vettd is a two-sided marketplace for influencer marketing built on verified public data. It connects creators and brands through the same underlying data layer — channel metrics, engagement patterns, content analysis, and audience interest graphs — surfaced differently depending on who is looking.

| Creators | Brands |
| :--- | :--- |
| Have an audience. No structured way to prove its value. No visibility into which brands are spending. No leverage because they lack data about themselves. | Have budget. No objective way to evaluate creators. Reliant on agencies or gut-feel. No post-campaign accountability. Can't express a brief in a way that returns ranked results. |

The fit score is **symmetric**. When a brand's brief scores Creator A at 87% match, that creator's profile displays the same score as proof of relevance. Data computed once. Both sides read from it.

---

# Workflow 1: Creator Finding Brands

## User Journey

| Step | Action |
| :---: | :--- |
| 1 | **Register and connect channel.** Creator enters their YouTube or Twitch handle. Vettd verifies the channel, runs the full API pipeline (uploads playlist → video stats → comments), computes all metrics, and builds the profile automatically. No manual data entry. |
| 2 | **See yourself as brands see you.** Creator lands on their dashboard showing Vettd Score, which metrics brands weight most, niche ranking, and what's dragging their score down. The core value moment — the mirror YouTube Studio never provides. |
| 3 | **Review audience intelligence.** Creator sees lateral interest map — what their viewers care about beyond the channel's own content. A gaming creator learns their audience over-indexes on energy drinks, mechanical keyboards, and Japan travel. These adjacent interests are the actual brand opportunities. |
| 4 | **Browse brand opportunity feed.** Active brands ranked by audience match score. Not a generic directory — personalised and filtered by the creator's category preferences (open to tech, gaming, food; not alcohol, gambling, fast fashion). |
| 5 | **Signal availability.** Creator taps "Open to deal" on a matched brand. This doesn't send a pitch — it triggers a match notification on the brand side: *"A creator with 87% match score for your brief is available."* No cold email. No PDF. |
| 6 | **Respond to inbound enquiries.** When a brand initiates contact, creator receives a structured brief — budget range, campaign goal, content format, timeline. They can accept, decline, or counter. Everything tracked on-platform. |
| 7 | **Log deal outcomes and build track record.** After a campaign, creator or brand logs basic outcomes. Each completed deal adds to a verified delivery record that compounds into a credibility asset commanding higher rates. |

## Creator Features

### Discovery & Positioning

| Feature | What it does |
| :--- | :--- |
| **Creator Profile Card** | Live public URL (`vettd.com/c/handle`) replacing the PDF media kit. Shows real-time Vettd Score, engagement rate, performance trend, audience interest graph, and authenticity score. Always current. |
| **Niche Positioning Score** | Rank within category cluster. *"Top 12% of tech creators in your subscriber tier for engagement rate."* A data-backed negotiation card. |
| **Audience Interest Expansion** | Lateral interest map showing what the audience cares about beyond the channel's content. The source of cross-category brand opportunities the creator would otherwise miss. |
| **Performance Trend Narrative** | Auto-generated 90-day summary. *"Average views up 34%, strongest format is product reviews, optimal length under 12 minutes."* Ready for any brand conversation. |

### Brand Discovery

| Feature | What it does |
| :--- | :--- |
| **Brand Opportunity Feed** | Active brands ranked by audience match score. Category preferences control what appears. |
| **Availability Signal** | One-tap interest in a specific brand. Triggers match notification on the brand side without requiring a pitch. Removes friction from both directions. |
| **Brand Fit Preview** | Simulated match rank before signalling interest: *"You'd rank #4 if this brand searched right now."* Shows what to improve to move up. |
| **Market Rate Indicator** | Current rate range based on comparable creators and Vettd Score. *"Creators like you typically command $800–$2,400 per integration."* Prevents undercharging. |
| **Outreach Generator** *(optional)* | Retained for creators who want to reach out directly. Not the primary workflow — availability signals and inbound handling come first. |

### Reputation & Trust

| Feature | What it does |
| :--- | :--- |
| **Verified Metrics Badge** | Embeddable badge linking to the live Vettd profile. Proof that numbers are not self-reported. Usable in email signatures, websites, social bios. |
| **Campaign Track Record** | Verified delivery record across completed campaigns. *"4 deals, 100% delivery, avg 9% above projected views."* Compounds into a credibility asset. |
| **Deal History & Rate Card** | Private log of past deals with rates, formats, and outcomes. Used to calibrate market rate suggestions. Not visible to other creators. |

---

# Workflow 2: Brand Finding Creators

*The brand's goal: translate a campaign brief into a verified shortlist — without an agency, without a spreadsheet, and with projected ROI before any money moves.*

## User Journey

| Step | Action |
| :---: | :--- |
| 1 | **Submit a campaign brief.** Brand describes the campaign in natural language: product category, target audience (age, gender, interests, location), goal, budget, platform. Claude converts it into structured filters and runs it against the creator index. The brief is the search query. |
| 2 | **Review AI-ranked matches.** Ranked list with three scores per creator: Audience Match (inferred audience vs target), Topic Alignment (content relevance to product), Overall Match (weighted composite). Each result includes one-sentence AI reasoning. |
| 3 | **Evaluate before committing.** Drill into full metric profile, authenticity report (fake engagement risk, view spikes, bot likelihood), historical consistency (variance across 50 videos), and comment sentiment analysis. |
| 4 | **Run campaign simulations.** Select 1–5 creators, input budget and goal. Vettd projects reach, engagements, conversions, cost-per-action, and ROI. Also models the cluster option: *"These 4 mid-tier creators match your total reach but deliver 2x combined engagement."* |
| 5 | **Build internal shortlist.** Curated shortlist with projections generates a shareable report for internal sign-off — not for sending to creators. |
| 6 | **Initiate structured contact.** Deal proposal through Vettd: budget range, content format, timeline, exclusivity requirements. Creator receives a formal brief. No cold email. No ambiguity from the first message. |
| 7 | **Track live campaign.** Brand logs the video URL. Vettd pulls daily stats and compares against projection. Alerts if performance is significantly off-track. |
| 8 | **Log actual ROI and build brand model.** Post-campaign: brand inputs promo code usage, affiliate clicks, UTM traffic. Vettd calculates actual vs projected CPE. Feeds into a brand-specific performance model for future campaigns. |

## Brand Features

### Discovery

| Feature | What it does |
| :--- | :--- |
| **Brief-First Search** | Natural language brief parsed by Claude into structured filters. The brief is the query. |
| **Audience Overlap Calculator** | Scores creators by inferred audience match to the brand's target profile. Not content category matching — audience signal matching. |
| **Whitespace Discovery** | Adjacent clusters with matching demographics but zero competitor sponsorship. Underpriced inventory before competitors find it. |
| **Budget Optimizer** | Models single large creator vs mid-tier cluster for any budget. Shows the case with actual numbers. |

### Evaluation

| Feature | What it does |
| :--- | :--- |
| **Fake Engagement Report** | One-click risk summary: view spikes, bot likelihood, comment quality, ghost followers. Traffic light output — green / amber / red. |
| **Historical Consistency Report** | Variance analysis across 50 videos. Surfaces the difference between steady performers and viral-outlier averages. |
| **Comment Sentiment Analysis** | Claude categorises sampled comments: purchase intent, geographic cues, life-stage indicators, audience identity markers. Audience intelligence no media kit provides. |
| **Side-by-Side Comparison** | Compare up to 5 creators on all metrics with campaign projections tailored to the brand's brief and budget. Exportable as CSV. |

### Campaign Management

| Feature | What it does |
| :--- | :--- |
| **Shortlist Report** | Internal-facing document: creator profiles, match scores, projections, cost estimates. Presentation-ready. Not sent to creators. |
| **Structured Outreach** | Deal proposal template with all terms defined upfront. Removes ambiguity from first contact. |
| **Campaign Tracker** | Daily stat pull on live videos vs projection. Alerts if tracking significantly below. |
| **ROI Attribution Model** | Post-campaign actuals vs projections. Builds a brand-specific model over time: *"Best-performing type: mid-tier gaming, 200K–500K subs, 3–4% ER."* |

---

# Limitations

Honest accounting of what the current architecture cannot do.

**Severity key:** RED = blocks a core promise. AMBER = degrades quality. GREY = low priority.

## Data Constraints

| Severity | Limitation | Impact & Workaround |
| :---: | :--- | :--- |
| RED | **No real demographic data** | Age, gender, and geographic breakdown are locked in YouTube Analytics API (channel-owner only). All demographic scoring is inferred, not measured. **Workaround:** Creator opt-in OAuth flow to unlock Analytics. Frame as a trust differentiator — Verified Demographics badge, higher ranking in brand searches. |
| RED | **No watch time or retention data** | Average view duration and retention curves live in YouTube Analytics, not the Data API. Arguably more important than view count for brand decisions. **Workaround:** Same opt-in flow. Frame as unlocking a deep analytics tier with strong incentive to connect. |
| AMBER | **YouTube quota constraints** | Data API v3 gives 10,000 units/day on free tier. `search.list` costs 100 units/call. **Workaround:** Aggressive 24-hour caching, default to playlist pipeline (1 unit/call), apply for quota increase when traffic justifies it. |
| AMBER | **Comment analysis is sampled** | `commentThreads.list` caps at 100 comments/call. For high-engagement videos this is potentially unrepresentative. **Workaround:** Pull by relevance ranking (not recency), label metrics as sample-based, expand with multiple calls where quota allows. |
| GREY | **Twitch engagement data is weak** | Twitch API doesn't expose likes or comments on VODs. Vettd Score is less reliable for Twitch. **Workaround:** Weight on consistency and growth momentum. Label unavailable metrics per platform. |

## Product Gaps

| Severity | Gap | Impact & Workaround |
| :---: | :--- | :--- |
| RED | **No in-platform messaging** | Deal negotiation moves off-platform, losing all record of terms. **Workaround:** Simple threaded messaging per deal. Keeps negotiation attached to the campaign record. |
| RED | **No content exclusivity tracking** | Brands can unknowingly shortlist a creator under a competing exclusivity window. **Workaround:** Exclusivity window field on deal records, surfaced during match phase. |
| AMBER | **No agency / roster management** | Many mid-tier+ creators are represented by agencies managing 10–50 creators. No multi-creator account support. **Workaround:** Agency account type with roster management and aggregated analytics. High-value customer segment — they bring multiple creators at signup. |
| AMBER | **No availability calendar** | No way to filter by availability for a specific campaign window. **Workaround:** Creators mark availability windows; brands filter by available dates when building shortlists. |
| AMBER | **No post-campaign rating system** | No structured mutual feedback. Bad actors face no accountability. **Workaround:** Private mutual reviews. After 3 completed deals, reliability score becomes visible. Filters out bad actors on both sides. |
| GREY | **No affiliate / promo code integration** | ROI attribution requires manual input. No direct connection to Shopify, Impact, or ShareASale. **Workaround:** Lightweight Vettd-generated affiliate link feeding back into campaign tracking automatically. |

---

# Untapped Use Cases

Adjacent problems Vettd can solve with existing data infrastructure. None require a new data source — only new interfaces on data already computed.

## For Creators

- **Competitive benchmarking.** Metrics against 3–5 anonymised comparable creators. *"Your engagement rate is top 20%, but upload consistency is below average for your tier."* Specific enough to act on.
- **Improvement roadmap.** Based on what brands in the creator's category search for most, prescribe exactly what to fix. *"Brands here prioritise upload consistency. Two posts/week instead of one would move you from #7 to #3."*
- **Creator bundle packages.** Creators in the same niche cluster opt into a joint listing. Brands book the bundle at a package rate. Increases deal size for creators, reduces research effort for brands.

## For Brands

- **Brand safety monitoring.** Ongoing alerts during active campaigns. If a creator posts flagged content after a deal is signed, the brand gets notified. Brand safety score re-runs automatically on new uploads.
- **Trend surfacing.** Which categories are seeing rising engagement velocity? *"Outdoor fitness creators are up 34% in average views this quarter."* Helps brands act on audience interest shifts before ad rates catch up.
- **Micro-campaign marketplace.** Standardised nano-creator deals — fixed rate, fixed deliverable, no negotiation — for $200–$500 budgets. Activating 10 nano creators becomes as simple as booking one macro creator.

## For the Marketplace

- **Seasonal planning layer.** Campaign calendar visibility across the creator index. Brands see availability gaps in peak periods. Creators see demand spikes approaching and adjust pricing accordingly.
- **Long-term creator development.** For recurring campaigns, flag mid-tier creators on a growth trajectory toward macro within 6–12 months. Lock in rates early.
- **Verified Analytics tier.** Creators who connect YouTube Analytics via OAuth get verified data — real demographics, watch time, retention. These profiles are surfaced first in brand searches. Natural incentive to share more data voluntarily.

---

## The Core Insight

Every feature draws from the same five data points: video titles, view counts, engagement stats, upload timestamps, and comments. The data model is simple. What Vettd adds is the scoring layer that makes it meaningful, and the two-sided interface that surfaces it differently depending on who is looking.

The biggest unlock — what separates Vettd from a basic analytics scraper — is that creators and brands see each other through the same verified lens. No agency inflating numbers. No unverifiable PDFs. Public data, scored consistently, available to both sides simultaneously.
