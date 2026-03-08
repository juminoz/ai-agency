**Vettd**

Creator–Brand Marketplace

Workflows, Feature Set, Limitations & Roadmap Gaps · v2.1

 

# **Overview**

Vettd is a two-sided marketplace for influencer marketing built on verified public data. It connects creators and brands through the same underlying data layer — the same channel metrics, engagement patterns, content analysis, and audience interest graphs — surfaced differently depending on who is looking.

 

| Creators Have an audience. No structured way to prove its value. No visibility into which brands are spending. No leverage in negotiation because they lack data about themselves. | Brands Have budget. No objective way to evaluate creators. Reliant on agencies or gut-feel. No post-campaign accountability. Can’t express a brief in a way that returns ranked results. |
| :---- | :---- |

 

The fit score is symmetric. When a brand’s brief scores Creator A at 87% match, that creator’s profile can display the same score as proof of relevance. The data is computed once. Both sides read from it.

# **Workflow 1: Creator Finding Brands**

## 

## **User Journey**

**STEP-BY-STEP FLOW**

 

| 1 | Register and connect channel Creator enters their YouTube or Twitch handle. Vettd verifies the channel, runs the full API pipeline (uploads playlist → video stats → comments), computes all metrics, and builds their profile automatically. No manual data entry required. |
| :---: | :---- |

 

| 2 | See yourself as brands see you Creator lands on their private dashboard. For the first time they see their Vettd Score, which metrics brands weight most, where they rank within their niche cluster, and specifically what is dragging their score down. This is the core value moment — the mirror that YouTube Studio never provides. |
| :---: | :---- |

 

| 3 | Review audience intelligence Creator sees the lateral interest map of their audience — what their viewers care about beyond the channel’s own content. A gaming creator learns their audience over-indexes on energy drinks, mechanical keyboards, and Japan travel. These adjacent interests are their actual brand opportunities, not just the obvious category. |
| :---: | :---- |

 

| 4 | Browse brand opportunity feed Creator sees active brands on Vettd ranked by audience match score against their profile. Not a generic brand directory — personalised and ranked. Creator sets category preferences upfront: open to tech, gaming, food; not alcohol, gambling, or fast fashion. |
| :---: | :---- |

 

| 5 | Signal availability to matched brands For brands they want to work with, creator taps “Open to deal.” This does not send a pitch. It triggers a match notification on the brand side: “A creator with 87% match score for your brief is available.” The brand discovers them — the creator just raised their hand. No cold email. No PDF. |
| :---: | :---- |

 

| 6 | Respond to inbound enquiries When a brand initiates contact, creator receives a structured brief — budget range, campaign goal, content format, timeline. They can accept, decline, or counter. Everything tracked on-platform, not over email. |
| :---: | :---- |

 

| 7 | Log deal outcomes and build track record After a campaign, creator (or brand) logs basic outcomes. Each completed deal adds to a verified delivery record. Compounds over time into a credibility asset that commands higher rates. |
| :---: | :---- |

 

 

## **Creator Features**

 

**DISCOVERY & POSITIONING**

 

| Feature | What it does |
| :---- | :---- |
| **Creator Profile Card** | A live public URL (vettd.com/c/handle) that replaces the PDF media kit. Shows real-time Vettd Score, engagement rate, recent performance trend, audience interest graph, and authenticity score. Always current. Brands visit it — the creator does not send it. |
| **Niche Positioning Score**  ✎ | Shows where the creator ranks within their category cluster. “Top 12% of tech creators in your subscriber tier for engagement rate.” A data-backed negotiation card. |
| **Audience Interest Expansion** | Lateral interest map showing what the creator’s audience cares about beyond the channel’s own content. The source of cross-category brand opportunities the creator would otherwise miss entirely. |
| **Performance Trend Narrative** | Auto-generated 90-day summary in plain English. “Average views up 34%, strongest format is product reviews, optimal video length under 12 minutes.” Ready to reference in any brand conversation. |

 

 

**BRAND DISCOVERY**

 

| Feature | What it does |
| :---- | :---- |
| **Brand Opportunity Feed** | Active brands ranked by audience match score against the creator’s profile. Not a generic list. Category preferences set by the creator control what appears. |
| **Availability Signal**  ✎ | One-tap signal of interest in a specific brand. Triggers a match notification on the brand side without requiring a pitch. Removes friction from both directions. |
| **Brand Fit Preview** | Before signalling interest, creator sees their simulated match rank for that brand: “You’d rank \#4 if this brand searched right now.” Shows exactly what to improve to move up. |
| **Market Rate Indicator** | Based on comparable creators’ deals and Vettd Score, shows the current rate range for integrations. “Creators like you typically command $800–$2,400 per integration.” Prevents systematic undercharging. |
| **Outreach Generator (removed from default flow)**  ✎ | Retained as an optional tool for creators who want to reach out directly — but this is no longer positioned as the primary workflow. Availability signals and inbound handling come first. |

 

 

**REPUTATION & TRUST**

 

| Feature | What it does |
| :---- | :---- |
| **Verified Metrics Badge** | Embeddable badge linking to the creator’s live Vettd profile. Proof that numbers are not self-reported. Usable in email signatures, websites, social bios. |
| **Campaign Track Record** | Verified delivery record built across completed campaigns. “4 deals, 100% delivery, avg 9% above projected views.” Compounds into a credibility asset over time. |
| **Deal History & Rate Card** | Private log of past brand deals with rates, formats, and outcomes. Used by Vettd to calibrate market rate suggestions. Not visible to other creators. |

 

# **Workflow 2: Brand Finding Creators**

*The brand’s goal is to translate a campaign brief into a verified shortlist — without an agency, without a spreadsheet, and with projected ROI before any money moves.*

 

## **User Journey**

**STEP-BY-STEP FLOW**

 

| 1 | Submit a campaign brief Brand describes the campaign in natural language: product category, target audience (age, gender, interests, location), goal, budget, and platform. Claude converts it into structured filters and runs it against the creator index. The brief is the search query — no dropdowns required. |
| :---: | :---- |

 

| 2 | Review AI-ranked matches Returns a ranked list with three scores per creator: Audience Match (inferred audience vs target profile), Topic Alignment (content relevance to the product), and Overall Match (weighted composite). Each result includes a one-sentence AI reasoning for the score. |
| :---: | :---- |

 

| 3 | Evaluate before committing For any creator in results, brand can drill into full metric profile, authenticity report (fake engagement risk, view spike history, bot likelihood), historical consistency (variance across 50 videos), and comment sentiment analysis (what the audience actually says). |
| :---: | :---- |

 

| 4 | Run campaign simulations Select 1–5 creators, input budget and goal. Vettd projects reach, engagements, conversions, cost-per-action, and ROI score. Also models the cluster option: “These 4 mid-tier creators match your total reach at this budget but deliver 2x the combined engagement.” |
| :---: | :---- |

 

| 5 | Build internal shortlist Curated shortlist with projections generates a shareable internal report — for sign-off, not for sending to creators. Brand team can review and approve before outreach. |
| :---: | :---- |

 

| 6 | Initiate structured contact Brand sends a deal proposal through Vettd: budget range, content format, timeline, exclusivity requirements. Creator receives a formal brief. No cold email. No ambiguity about basic terms from the first message. |
| :---: | :---- |

 

| 7 | Track live campaign After the video goes live, brand logs the URL. Vettd pulls daily stats and compares against projection. Alerts if performance is significantly off-track. |
| :---: | :---- |

 

| 8 | Log actual ROI and build brand model Post-campaign: brand inputs promo code usage, affiliate clicks, UTM traffic. Vettd calculates actual vs projected CPE. Feeds back into a brand-specific performance model for future campaigns. |
| :---: | :---- |

 

 

## **Brand Features**

 

**DISCOVERY**

 

| Feature | What it does |
| :---- | :---- |
| **Brief-First Search** | Natural language brief parsed by Claude into structured filters. No category dropdowns. The brief is the query. |
| **Audience Overlap Calculator** | Scores creators by how closely their inferred audience matches the brand’s target. Not content category matching — audience signal matching. “This creator’s audience is 68% male, 25–34, clustering around performance nutrition.” |
| **Whitespace Discovery** | Adjacent clusters with matching audience demographics but zero competitor sponsorship. Helps brands find underpriced inventory before competitors do. |
| **Budget Optimizer** | Models two strategies for any budget: single large creator vs cluster of mid-tier creators. Usually the cluster wins on cost-per-engagement. Shows the case with actual numbers. |

 

 

**EVALUATION**

 

| Feature | What it does |
| :---- | :---- |
| **Fake Engagement Report** | One-click risk summary: view spike history, bot likelihood, comment quality, ghost follower estimate. Traffic light output — green / amber / red — for fast screening. |
| **Historical Consistency Report** | Variance analysis across last 50 videos. A creator with steady 80K views is more reliable than one averaging 300K off two viral outliers. This surfaces the difference. |
| **Comment Sentiment Analysis** | Claude categorises sampled comments across recent videos: purchase intent signals, geographic cues, life-stage indicators, audience identity markers. Audience intelligence no media kit can provide. |
| **Side-by-Side Comparison** | Compare up to 5 creators on all metrics with campaign projections tailored to the brand’s brief and budget. Exportable as CSV. |

 

 

**CAMPAIGN MANAGEMENT**

 

| Feature | What it does |
| :---- | :---- |
| **Shortlist Report** | Internal-facing document: creator profiles, match scores, projections, cost estimates. Presentation-ready for sign-off. Not sent to creators. |
| **Structured Outreach** | Deal proposal template sent through Vettd with all terms defined upfront. Removes ambiguity from first contact. |
| **Campaign Tracker** | Daily stat pull on live videos vs projected performance. Alerts if a video is tracking significantly below projection. |
| **ROI Attribution Model** | Post-campaign actuals vs projections. Builds a brand-specific model over time: “Your best-performing type historically: mid-tier gaming, 200K–500K subs, 3–4% ER.” |

 

# **Limitations**

Honest accounting of what the current architecture cannot do, and how to handle each gap. Red \= blocks a core promise. Amber \= degrades quality. Grey \= low priority.

 

## **Data Constraints**

 

|   | No real demographic data Impact:  Age, gender, and geographic breakdown are locked in YouTube Analytics API, accessible only by the channel owner. All demographic scoring is inferred from content signals, not ground truth. The Audience Match score is a proxy, not a measurement. Workaround:  Creator opt-in OAuth flow to unlock their own Analytics data. Frame as a trust differentiator: creators who connect Analytics get a Verified Demographics badge and rank higher in brand searches. |
| :---- | :---- |

 

|   | YouTube quota constraints Impact:  YouTube Data API v3 gives 10,000 units per day on the free tier. search.list costs 100 units per call. Using playlistItems.list (1 unit) extends range significantly, but scale is still limited without a paid quota increase. Workaround:  Implement 24-hour caching aggressively. Default to the playlist pipeline. Apply for quota increase via Google Cloud Console once traffic justifies it. |
| :---- | :---- |

 

|   | No watch time or retention data Impact:  Average view duration and retention curves live in YouTube Analytics, not the Data API. These are arguably more important than view count for brand decisions — a creator with 60% average retention on a 10-minute video is more valuable than one with 15%. Workaround:  Same creator opt-in flow. Frame as unlocking a deep analytics tier: watch time and retention become visible to matched brands, creating a strong incentive to connect. |
| :---- | :---- |

 

|   | Twitch engagement data is weak Impact:  Twitch API does not expose likes or comments on VODs. Engagement metrics for Twitch creators are therefore thinner than YouTube equivalents. The Vettd Score is less reliable for Twitch. Workaround:  Weight Twitch scores more heavily on consistency and growth momentum where data is stronger. Clearly label which metrics are unavailable per platform in the UI. |
| :---- | :---- |

 

|   | Comment analysis is sampled, not complete Impact:  commentThreads.list caps at 100 comments per API call. For high-engagement videos this is a small and potentially unrepresentative sample. Sentiment conclusions are directional. Workaround:  Pull by relevance ranking, not recency, for better signal. Label all comment-based metrics explicitly as based on a sample. Expand sample size with multiple calls where quota allows. |
| :---- | :---- |

 

## **Product Gaps**

 

|   | No in-platform messaging Impact:  Once a brand initiates contact, there is no on-platform communication channel. Deal negotiation moves off-platform to email, losing all record of terms discussed. Workaround:  Add a simple threaded messaging system per deal. Even basic chat keeps the full negotiation attached to the campaign record and creates an audit trail. |
| :---- | :---- |

 

|   | No content exclusivity tracking Impact:  Brands routinely require exclusivity windows — a creator cannot work with a competing brand for 30–90 days. There is no way to flag or surface this currently. Brand could unknowingly shortlist a creator already under a competing exclusivity. Workaround:  Add an exclusivity window field to deal records. Surface it during the match phase: “This creator is in an active exclusivity period for fitness supplement brands until \[date\].” |
| :---- | :---- |

 

|   | No agency / roster management Impact:  Many mid-tier and macro creators are represented by talent agencies managing 10–50 creators at once. The current flow is individual creator accounts only. Agencies cannot manage a roster under one login. Workaround:  Add an Agency account type with one login and multiple creator profiles managed underneath. Agency-level analytics aggregated across the full roster. High-value customer segment — they bring multiple creators at signup. |
| :---- | :---- |

 

|   | No availability calendar Impact:  Brands plan around seasonal moments and product launches. There is no way to book creator availability ahead of time or filter by availability for a specific campaign window. Workaround:  Add a campaign calendar. Creators mark availability windows. Brands filter by available dates when building a shortlist. |
| :---- | :---- |

 

|   | No post-campaign rating system Impact:  After a campaign completes, there is no structured mutual feedback loop. Reliability and professionalism stay informal. Bad actors on either side face no accountability. Workaround:  Add private mutual post-campaign reviews. After 3 completed deals, a creator’s reliability score becomes visible to brands. Filters out bad actors on both sides over time. |
| :---- | :---- |

 

|   | No affiliate / promo code integration Impact:  ROI attribution requires manual input of promo code usage or affiliate link data. No direct connection to Shopify, Impact, or ShareASale. The ROI story relies on the brand doing work outside the platform. Workaround:  Build a lightweight Vettd-generated affiliate link. Links feed back into campaign tracking automatically. Stronger ROI story with less brand effort. |
| :---- | :---- |

 

# **Untapped Use Cases**

Adjacent problems Vettd is well-positioned to solve with existing data infrastructure. None of these require a new data source — only new interfaces on data already computed.

 

## **For Creators**

 

• 	**Competitive benchmarking.** Show a creator’s metrics against 3–5 anonymised comparable creators in their niche. “Your engagement rate is top 20%, but upload consistency is below average for your tier.” Specific enough to act on.

• 	**Improvement roadmap.** Based on what brands in the creator’s category search for most, tell them exactly what to fix to increase deal inflow. “Brands here prioritise upload consistency. Two posts per week instead of one would move you from \#7 to \#3 in most relevant searches.”

• 	**Creator bundle packages.** Creators in the same niche cluster can opt into a joint listing. Brands can book the bundle at a package rate. Increases deal size for the creators, reduces research effort for the brand.

 

## **For Brands**

 

• 	**Brand safety monitoring.** Ongoing alert system during active campaigns. If a creator posts something with a flagged sentiment score after a deal is signed, the brand gets notified. Brand safety score re-runs automatically on new uploads.

• 	**Trend surfacing.** Which creator categories are seeing rising engagement velocity this quarter? “Outdoor fitness creators are up 34% in average views.” Helps brands act on audience interest shifts before ad rates catch up.

• 	**Micro-campaign marketplace.** Standardised nano-creator deals — fixed rate, fixed deliverable, no negotiation — for brands with $200–$500 budgets. Activating 10 nano creators at once becomes as operationally simple as booking one macro creator.

 

## **For the Marketplace**

 

• 	**Seasonal planning layer.** Campaign calendar visibility across the creator index. Brands see availability gaps in peak periods. Creators see demand spikes approaching and can adjust availability and pricing accordingly.

• 	**Long-term creator development.** For brands that run recurring campaigns, flag which mid-tier creators are on a growth trajectory that will move them to macro within 6–12 months. Lock in rates early before the creator’s asking price increases.

• 	**Verified Analytics tier.** Creators who connect YouTube Analytics via OAuth get a separate tier of verified data — real demographics, watch time, retention. These profiles are surfaced first in brand searches. Creates a natural incentive for creators to share more data voluntarily.

 

# **The Core Insight**

Every feature in this document draws from the same five data points: video titles, view counts, engagement stats, upload timestamps, and comments. The data model is simple. What Vettd adds is the scoring layer that makes it meaningful, and the two-sided interface that surfaces it differently depending on who is looking.

 

The biggest unlock — the one that separates Vettd from a basic analytics scraper — is that creators and brands see each other through the same verified lens. No agency inflating numbers in one direction. No creator sending unverifiable PDFs. Just public data, scored consistently, available to both sides simultaneously.


