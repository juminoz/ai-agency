import { GoogleGenerativeAI } from "@google/generative-ai";

import { type Comment, type Video } from "@/lib/supabase/types";

function getGeminiClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return new GoogleGenerativeAI(key);
}

export interface InterestGraphResult {
  interests: InterestNode[];
  crossCategoryOpportunities: string[];
  summary: string;
}

export interface InterestNode {
  category: string;
  confidence: number;
  sources: (
    | "video_titles"
    | "video_tags"
    | "video_descriptions"
    | "comments"
  )[];
  relatedCategories: string[];
}

/**
 * Interest Graph using Gemini 3.0 Flash
 *
 * From scoring.md section 7:
 * - Extract topics from video metadata + comment themes
 * - Build interest vector with top 5–10 categories + confidence scores
 * - Identify cross-category brand opportunities
 */
export async function buildInterestGraph(
  videos: Video[],
  comments: Comment[]
): Promise<InterestGraphResult> {
  if (videos.length === 0) {
    return {
      interests: [],
      crossCategoryOpportunities: [],
      summary: "No videos to analyze.",
    };
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  // Prepare video metadata summary
  const videoSummary = videos
    .slice(0, 30)
    .map((v) => {
      const tags = v.tags?.slice(0, 10).join(", ") ?? "none";
      return `- "${v.title}" (tags: ${tags})`;
    })
    .join("\n");

  // Prepare comment sample
  const commentSample = comments
    .slice(0, 50)
    .map((c) => `- ${c.comment_text.slice(0, 200)}`)
    .join("\n");

  const prompt = `You are an audience interest analyst for influencer marketing. Analyze this YouTube channel's content and audience to build an interest graph.

Recent video titles and tags:
${videoSummary}

Sample audience comments:
${commentSample}

Return a JSON object with this exact structure (no markdown, just JSON):
{
  "interests": [
    {
      "category": "broad interest category name",
      "confidence": 0.0-1.0,
      "sources": ["video_titles", "video_tags", "video_descriptions", "comments"],
      "relatedCategories": ["adjacent interest 1", "adjacent interest 2"]
    }
  ],
  "crossCategoryOpportunities": [
    "Brand category that could match this audience despite not being the creator's primary niche"
  ],
  "summary": "2-3 sentence description of the audience interest profile and what brands should know"
}

Rules:
- Return 5–10 interest categories, sorted by confidence (highest first)
- Categories should be specific enough to be useful (e.g., "Japan travel" not just "travel")
- Cross-category opportunities should be non-obvious brand matches
- Sources array indicates where the signal was found
- Related categories help with cluster matching`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Gemini response");
    }

    // Clean common JSON issues from LLM output
    const cleaned = jsonMatch[0]
      .replace(/,\s*([}\]])/g, "$1") // trailing commas
      .replace(/'/g, '"') // single quotes → double quotes
      .replace(/\/\/[^\n]*/g, "") // single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, ""); // block comments

    const parsed = JSON.parse(cleaned) as InterestGraphResult;

    return {
      interests: parsed.interests ?? [],
      crossCategoryOpportunities: parsed.crossCategoryOpportunities ?? [],
      summary: parsed.summary ?? "",
    };
  } catch (error) {
    console.error("Gemini interest graph error:", error);
    return {
      interests: [],
      crossCategoryOpportunities: [],
      summary: `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
