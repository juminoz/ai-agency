Hackathon 2026

**Problem**: Brands waste money because they don’t know which influencers will actually reach the *right* audience.

* The challenge is **matching brands with influencers using data**, not guesswork or agencies.  
* If no agency, need to create personalized emails to creators  
  * AI generated templates  
  * Influencers get influx of collaboration requests  
  * Problem for influencer \= going through meaningless mass generated collab requests  
  * Problem for brands \= not targeting correct influencers, spending money on agencies or wasting time contacting influencers that have no interest  
  * Access to larger and smaller influencers. Influencers with less followers/ engagement might be better for acquisition if they have the correct demographic

## **Core Concept**

### **AI Influencer Matchmaker**

A tool that analyzes influencer data across **YouTube, TikTok, and Instagram** to match brands with creators whose audience and content will **maximize reach and conversion**.

Think: **“LinkedIn for influencer marketing \+ AI analytics.”**

## **Key Features Ideas**

# **1\. Audience Match Score**

The system calculates how closely an influencer’s audience matches a brand’s target market.

**Inputs:**

* Age demographics  
* Gender  
* Location  
* Interests  
* Engagement behavior

| Influencer | Audience Match | Engagement | Conversion Potential |
| ----- | ----- | ----- | ----- |
| Creator A | 92% | High | Excellent |
| Creator B | 65% | Medium | Moderate |

## **2\. Content Topic Analysis**

Use NLP or AI to analyze creator content.

The system identifies:

* main topics  
* sentiment  
* brand alignment  
* niche category

Example output:

Influencer topics:

* fitness  
* gym routines  
* supplements  
* wellness

Brand topic:

* protein powder

Match: **Very high**

## **3\. Authentic Engagement Detection**

A big problem in influencer marketing is **fake engagement**.

The tool analyzes:

* comment quality  
* engagement spikes  
* follower growth patterns  
* bot likelihood

**Output**:  
Engagement Authenticity Score: 87%  
Fake Follower Risk: Low

## **4\. Audience Interest Graph**

The system builds a **map of audience interests**.

Example:

Audience interests:

* anime  
* Japanese culture  
* travel  
* fashion

This helps brands find **unexpected influencer opportunities**.

**Example**:  
 A Japan travel brand could match with:

* anime creators  
* Japanese language creators  
* food vloggers

## **5\. Campaign Reach Simulator**

Predict campaign performance before spending money.

Example:

Campaign Reach Estimate:

Total audience reach: 2.3M  
Expected engagement: 110K  
Estimated conversions: 1,500

Cost efficiency: High

# **Product Concept**

### **Brand Side**

Brands input:

* product category  
* target demographic  
* campaign goal  
* budget

The AI returns:

**Top influencer matches ranked by performance potential.**

### **Influencer Side**

Creators can:

* register profiles  
* connect social accounts  
* see brand opportunities  
* get match scores

# **Cool Hackathon Twist**

Instead of just **matching influencers**, you could create:

### **Influencer Network Discovery**

The AI finds **clusters of creators that share audiences**.

Example:

Fitness cluster

 ├ influencer A

 ├ influencer B

 ├ influencer C

Brands could sponsor **multiple creators in the same cluster** to dominate a niche.

## **6. AI Outreach Emails**

After scoring and matching, the system generates **personalized outreach emails** from brands to creators.

* References specific content alignment and audience match data
* Avoids generic mass-email language — each email is tailored to the creator's content and audience
* Solves both sides of the problem:
  * **Brands** get ready-to-send, data-backed outreach
  * **Creators** receive relevant collaboration requests instead of spam

---

# **Platform Data Strategy**

### **Which APIs power each platform**

| Platform | API | Access Level |
| -------- | --- | ------------ |
| YouTube | YouTube Data API v3 | Public data, API key required |
| YouTube (advanced) | YouTube Analytics API | Creator opt-in (OAuth), provides demographics, watch time, retention |
| TikTok | TikTok Research API | Application approval required, rate-limited |
| Instagram | Instagram Graph API | Requires connected Facebook Business account |

### **Normalization approach**

All platform data is normalized into a common shape so scoring is **platform-agnostic**:

* **Video/Post**: views, likes, comments, publish date, text, tags
* **Channel/Profile**: follower count, post count, description
* **Comment**: text, author, publish date

The 5 core scoring modules (topic relevance, views, engagement, consistency, audience match) run identically across platforms once data is normalized.

### **MVP priority**

YouTube is the primary pipeline with real API data. TikTok and Instagram can use mock data for MVP, with real integrations added later.

---

# **Data Strategy Summary**

### **Feature-to-data mapping**

| Feature | Primary Data Source | Approach |
| ------- | ------------------- | -------- |
| Audience Match Score | Video metadata + comments | Keyword matching + AI comment analysis as demographic proxy |
| Content Topic Analysis | Video titles, descriptions, tags | AI-powered semantic topic extraction |
| Authentic Engagement Detection | Video stats + comments | Statistical anomaly detection + AI spam classification |
| Audience Interest Graph | Video metadata + comment themes | AI semantic clustering into interest categories |
| Campaign Reach Simulator | Stored channel scores | Aggregation of median views/engagement across selected channels |
| AI Outreach Emails | All scored data + brand input | AI-generated personalized email drafts |
| Influencer Network Discovery | Interest vectors + audience signals | Pairwise similarity clustering of channels |

### **The demographic gap**

The YouTube Data API **cannot** provide viewer age, gender, or geography directly. These require the **YouTube Analytics API**, which needs creator opt-in via OAuth.

**Workaround**: AI-powered comment analysis serves as a proxy — extracting demographic hints, purchase intent, and interest signals from public comment data. This is less precise than Analytics API demographics but works without creator cooperation.

### **What requires creator opt-in**

* Watch time and retention metrics
* Viewer age/gender breakdown
* Geographic distribution
* Traffic sources
* New vs returning viewers

These are available only through the Analytics API after a creator connects their account. The screening pipeline (Data API) works entirely without creator involvement.


