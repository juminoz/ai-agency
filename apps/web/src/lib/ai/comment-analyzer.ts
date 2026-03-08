import { GoogleGenerativeAI } from "@google/generative-ai";

import { type Comment } from "@/lib/supabase/types";

function getGeminiClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return new GoogleGenerativeAI(key);
}

export interface CommentAnalysisResult {
  demographicSignals: DemographicSignal[];
  purchaseIntent: PurchaseIntentSignal;
  interestCategories: InterestCategory[];
  audienceMatchConfidence: number;
  summary: string;
}

export interface DemographicSignal {
  type: "age" | "gender" | "location" | "life_stage";
  value: string;
  confidence: number;
}

export interface PurchaseIntentSignal {
  score: number;
  examples: string[];
}

export interface InterestCategory {
  category: string;
  confidence: number;
  commentCount: number;
}

/**
 * AI Comment Analysis using Gemini 3.0 Flash
 *
 * Sends a batch of comments to Gemini and extracts:
 * - Demographic signals (age, gender, location, life stage)
 * - Purchase intent
 * - Interest categories
 * - Audience match confidence
 */
export async function analyzeComments(
  comments: Comment[],
  brandContext?: string
): Promise<CommentAnalysisResult> {
  if (comments.length === 0) {
    return {
      demographicSignals: [],
      purchaseIntent: { score: 0, examples: [] },
      interestCategories: [],
      audienceMatchConfidence: 0,
      summary: "No comments to analyze.",
    };
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const commentTexts = comments
    .slice(0, 100)
    .map((c, i) => `${i + 1}. ${c.comment_text}`)
    .join("\n");

  const brandClause = brandContext
    ? `\nBrand context: ${brandContext}\nEvaluate how well the comment audience aligns with this brand.`
    : "";

  const prompt = `You are an audience analyst. Analyze these YouTube comments to extract audience insights.
${brandClause}

Comments:
${commentTexts}

Return a JSON object with this exact structure (no markdown, just JSON):
{
  "demographicSignals": [
    { "type": "age|gender|location|life_stage", "value": "description", "confidence": 0.0-1.0 }
  ],
  "purchaseIntent": {
    "score": 0-100,
    "examples": ["quote from comment showing purchase intent"]
  },
  "interestCategories": [
    { "category": "category name", "confidence": 0.0-1.0, "commentCount": number }
  ],
  "audienceMatchConfidence": 0-100,
  "summary": "2-3 sentence summary of the audience profile"
}

Rules:
- Extract at most 10 demographic signals
- Extract at most 8 interest categories
- Purchase intent examples should be direct quotes, max 5
- Be conservative with confidence scores
- If brand context is provided, audienceMatchConfidence reflects alignment with that brand`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response (handle potential markdown wrapping)
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

    const parsed = JSON.parse(cleaned) as CommentAnalysisResult;

    return {
      demographicSignals: parsed.demographicSignals ?? [],
      purchaseIntent: parsed.purchaseIntent ?? { score: 0, examples: [] },
      interestCategories: parsed.interestCategories ?? [],
      audienceMatchConfidence: parsed.audienceMatchConfidence ?? 0,
      summary: parsed.summary ?? "",
    };
  } catch (error) {
    console.error("Gemini comment analysis error:", error);
    return {
      demographicSignals: [],
      purchaseIntent: { score: 0, examples: [] },
      interestCategories: [],
      audienceMatchConfidence: 0,
      summary: `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
