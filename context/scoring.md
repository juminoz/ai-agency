Use the **YouTube Data API** in a 5-step pipeline:

1. **Get the channel**  
2. **Get the uploads playlist**  
3. **Get the recent videos**  
4. **Get video stats \+ metadata**  
5. **Get comments for recent videos**

That is enough to estimate all five questions from **public data only**. The relevant endpoints are channels.list, playlistItems.list, videos.list, commentThreads.list, and optionally search.list.  

## **1\. Does this creator post about the right topics?**

### **Data source**

Use:

* channels.list for channel description/basic context  
* playlistItems.list for recent uploads  
* videos.list for titles, descriptions, tags, categories

channels.list returns channel resources, and playlistItems.list can retrieve the videos in a channel’s uploads playlist. videos.list returns video resources and can include metadata via the snippet part.  

### **What to inspect**

For the last 20–50 videos, look at:

* snippet.title  
* snippet.description  
* snippet.tags  
* publish dates  
* repeated keywords/themes

### **Heuristic**

Create a keyword dictionary for your target audience, then score recent videos against it.

Example target: **Japan travel audience**

keywords \= \["japan", "tokyo", "kyoto", "osaka", "travel", "itinerary", "food", "shopping", "japanese"\]  
topic\_fit \= (\# of recent videos matching keywords) / (recent videos analyzed)

### **Example cURL**

curl "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics\&id=VIDEO\_ID1,VIDEO\_ID2,VIDEO\_ID3\&key=YOUR\_API\_KEY"

## **2\. Are recent videos getting meaningful views?**

### **Data source**

Use:

* playlistItems.list to get recent video IDs  
* videos.list with part=statistics,snippet

videos.list supports retrieving video statistics, and Google documents a quota cost of 1 unit for that method.  

### **What to measure**

Do **not** use lifetime channel averages as your main signal. Use recent videos only:

* median views of last 10 videos  
* median views of last 20 videos  
* views/subscriber ratio  
* trend over time

### **Heuristic**

median\_recent\_views \= median(viewCount of last 10 or 20 videos)  
views\_per\_sub \= median\_recent\_views / subscriberCount

“Meaningful” depends on your use case:

* brand awareness: absolute reach matters  
* niche brand: consistency and topic relevance may matter more than raw reach

### **Practical thresholds**

You can bucket it like:

* **strong**: median recent views \>= 30% of subscribers  
* **okay**: 10%–30%  
* **weak**: \<10%

Not a YouTube rule — just a useful screening heuristic.

## **3\. Is engagement healthy?**

### **Data source**

Use:

* videos.list with statistics

Public video stats include counts like views, likes, and comments through the video resource.  

### **What to calculate**

For each recent video:

like\_rate \= likeCount / viewCount  
comment\_rate \= commentCount / viewCount  
engagement\_rate \= (likeCount \+ commentCount) / viewCount

Then use the **median** across recent videos.

### **What good looks like**

Healthy engagement usually means:

* not all views are concentrated in one outlier  
* likes/comments appear on most uploads  
* comments are substantive, not generic spam

### **Warning signs**

* high views but near-zero comments across many videos  
* a few viral videos hiding weak baseline engagement  
* repetitive or bot-like comments

## **4\. Is the channel active and consistent?**

### **Data source**

Use:

* playlistItems.list or videos.list publish timestamps from snippet.publishedAt

The uploads playlist is the standard way to retrieve a channel’s uploaded videos.  

### **What to measure**

* uploads in last 30 days  
* uploads in last 90 days  
* average days between uploads  
* variance in recent views

### **Heuristic**

activity\_score \=  
  40% posting frequency  
\+ 30% recency of last upload  
\+ 30% stability of recent view counts

### **Interpretation**

A creator can be a good fit even with low frequency if the format is long-form and deliberate. But if you want campaign reliability, you usually want:

* recent upload within the last few weeks  
* at least some consistent cadence  
* no long unexplained inactivity

## **5\. Do comments suggest the right audience?**

### **Data source**

Use:

* commentThreads.list

The Data API supports commentThreads resources and methods in the API reference.  

### **What to inspect**

Pull top comments on the last 10–20 videos and look for:

* language used  
* recurring audience identity cues  
* purchase intent / travel-planning intent / hobby expertise  
* geography clues  
* age/life-stage hints  
* whether commenters talk like your target segment

### **Example signals**

If your target is **women planning Japan trips**, useful signals include comments like:

* “Saving this for my Tokyo trip”  
* “Which neighborhood did you stay in?”  
* “Is this solo-female-travel friendly?”  
* “I’m going next spring, this helped a lot”

If the comments instead skew toward:

* creator-fandom only  
* unrelated meme chatter  
* low-substance emoji spam

then audience fit is weaker, even if views look decent.

### **Example comment query**

curl "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet\&videoId=VIDEO\_ID\&maxResults=50\&order=relevance\&textFormat=plainText\&key=YOUR\_API\_KEY"

## **Minimal data model you need**

For each channel, store:

**Channel**

* channel\_id  
* title  
* description  
* subscriber\_count  
* video\_count  
* uploads\_playlist\_id

**Video**

* video\_id  
* published\_at  
* title  
* description  
* tags  
* view\_count  
* like\_count  
* comment\_count

**Comment sample**

* video\_id  
* comment\_text  
* author\_name  
* published\_at

That is enough to compute your first-pass fit score.

## **Recommended scoring model**

fit\_score \=  
30% topic relevance  
25% recent views  
20% engagement health  
15% activity/consistency  
10% comment-audience match

## **What the Data API still cannot tell you**

Even after all this, you still will **not** know:

* viewer age/gender  
* viewer geography at scale  
* watch time  
* average view duration  
* retention  
* traffic sources  
* new vs returning viewers

Those come from the **YouTube Analytics API**, not the Data API. Google’s YouTube developer docs separate the Data API from the Analytics API, which is for viewing statistics and popularity metrics for channels and videos.  

## **Best practical workflow**

Use the Data API for **screening**:

* topic fit  
* recent view quality  
* engagement  
* consistency  
* comment-based audience proxies

Then use the Analytics API only for creators you are seriously considering.

### **The shortest version of the pipeline**

channels.list  
\-\> contentDetails.relatedPlaylists.uploads  
\-\> playlistItems.list  
\-\> videos.list  
\-\> commentThreads.list  
\-\> compute fit score

If you want, I can turn this into a concrete **endpoint-by-endpoint checklist** or give you a **single script** that outputs these five scores for any channel handle.

---

## **6. Engagement Authenticity / Bot Detection**

### **Data source**

Use the same data already fetched in the pipeline:

* videos.list for view/like/comment counts per video
* commentThreads.list for comment text samples
* channels.list for subscriber count history context

### **What to inspect**

* **View spike detection**: flag videos where viewCount > 5× the channel's median recent views
* **Comment quality**: send a sample of comments to the Claude API and classify as genuine vs spam/bot
* **Like-to-view anomaly**: an unusually high like ratio (e.g., likeCount/viewCount > 10%) suggests purchased engagement
* **Follower growth patterns**: compare subscriber count growth vs view trends for consistency — rapid subscriber growth with flat views is a red flag

### **Heuristic**

authenticity_score =
  25% view consistency (inverse of spike ratio)
+ 25% comment quality (% classified as genuine)
+ 25% like-to-view ratio normality
+ 25% follower-growth consistency

### **Output**

* Authenticity Score: 0–100%
* Fake Follower Risk: Low / Medium / High (thresholds: >75% = Low, 50–75% = Medium, <50% = High)

---

## **7. Audience Interest Graph**

### **Data source**

Use data already fetched:

* videos.list for titles, descriptions, tags
* commentThreads.list for top comment themes

### **What to inspect**

* Pull topics from recent videos (titles, descriptions, tags) + recurring comment themes
* Use AI (Claude API) to extract semantic interest categories — not just raw keywords, but meaningful groupings

### **Heuristic**

* Build an interest vector per channel: a weighted list of topic categories derived from video metadata and comment themes
* Enables unexpected brand-creator matches (e.g., an anime creator matches a Japan travel brand because their audience interest vectors overlap on Japanese culture, travel, and food)

### **Output**

* List of top 5–10 interest categories with confidence scores
* Interest overlap score when comparing two or more channels

---

## **8. Campaign Reach Simulator**

### **Data source**

Uses existing scored channel data — no additional API calls needed.

### **Inputs**

* List of selected channels (with their stored video stats)
* Campaign budget

### **Calculations**

* **Total reach** = sum of median recent views across all selected channels
* **Expected engagement** = apply each channel's median engagement rate to their median views, then sum
* **Estimated conversions** = industry benchmark conversion rate (1–3% of engagements, configurable)
* **Cost per estimated conversion** = budget / estimated conversions

### **Output**

Campaign forecast:
* Total audience reach
* Expected engagements
* Estimated conversions (low / mid / high range)
* Cost per conversion estimate
* Cost efficiency rating (High / Medium / Low)

---

## **9. Influencer Network Discovery**

### **Data source**

Uses per-channel data already computed:

* Topic tags and interest vectors from section 7
* Comment audience signals from section 5
* Engagement and view patterns from sections 2–3

### **What to inspect**

* For a set of scored channels, use AI to analyze overlap in topics and audience signals
* Group creators into clusters that share audience characteristics (similar interest vectors, overlapping comment themes)

### **Heuristic**

* Compute pairwise similarity between channel interest vectors
* Cluster channels with similarity above a threshold (e.g., cosine similarity > 0.7)
* Rank clusters by total combined reach

### **Output**

* Creator clusters with shared audience profile descriptions
* Enables brands to sponsor multiple creators in the same cluster to dominate a niche

---

## **10. AI-Powered Comment Audience Analysis**

This replaces the simple keyword matching approach in section 5 ("Do comments suggest the right audience?") with AI-driven analysis.

### **Data source**

* commentThreads.list — same comments already fetched

### **What to inspect**

Send a batch of comments (50–100 per channel) to the Claude API along with brand context. Extract:

* **Demographic signals**: age hints, gender indicators, location references
* **Purchase intent**: comments expressing buying interest or product research
* **Interest categories**: what the audience cares about beyond the video topic
* **Audience match confidence**: how well comment signals align with the brand's target market

### **Heuristic**

ai_audience_score =
  30% demographic signal match
+ 30% purchase intent presence
+ 20% interest category overlap with brand
+ 20% audience match confidence from AI

Fallback to keyword matching (section 5 approach) if AI is unavailable.

### **Why this matters**

This partially addresses the demographic gap that the YouTube Data API cannot fill directly. While not as accurate as Analytics API demographics, AI comment analysis provides meaningful audience proxy signals from public data.

---

## **11. Multi-Platform Strategy (TikTok & Instagram)**

### **Platform-specific data sources**

* **YouTube**: real API pipeline (sections 1–5 above)
* **TikTok**: TikTok Research API or third-party tools for video stats, engagement, comments
* **Instagram**: Instagram Graph API for media stats, comments, follower counts

### **Normalization approach**

All platform data is normalized into the same shape as YouTube:

* **Video/Post object**: views, likes, comments, publish date, text content, tags
* **Channel/Profile object**: follower count, post count, description
* **Comment object**: text, author, publish date

### **Scoring**

Once data is normalized, all 5 core scoring modules (topic relevance, views, engagement, consistency, audience match) work platform-agnostic. No platform-specific scoring logic needed.

### **Access restrictions**

* TikTok Research API requires application approval and has rate limits
* Instagram Graph API requires a connected Facebook Business account
* For MVP: mock data is acceptable for TikTok and Instagram; YouTube is the primary real-data pipeline

---

## **12. AI Outreach Email Generation**

### **Data source**

Uses all scored channel data + brand input:

* Channel info (name, description, content topics)
* Brand description and campaign goals
* Fit score breakdown (topic, views, engagement, consistency, audience)
* Audience insights from comment analysis

### **What to generate**

A personalized brand-to-creator outreach email that:

* References specific content alignment ("Your recent videos on X align perfectly with our brand's focus on Y")
* Highlights audience match data ("Your audience shows strong purchase intent in Z category")
* Includes a clear value proposition for the creator
* Avoids generic/spammy language

### **Implementation**

* Send structured prompt to Claude API with channel data, brand context, and scoring breakdown
* AI generates a draft email the brand can review and send
* Solves both sides: brands get targeted outreach, creators receive relevant (not spammy) collaboration requests


