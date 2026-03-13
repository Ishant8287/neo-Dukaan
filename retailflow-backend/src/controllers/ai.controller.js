import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const insightCache = new Map();

export const getGeminiInsights = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }

    const shopId = req.shop.id;
    const cached = insightCache.get(shopId);

    if (cached && Date.now() - cached.time < 10 * 60 * 1000) {
      return res
        .status(200)
        .json({ success: true, data: cached.text, cached: true });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) throw new Error("No response from AI");

    insightCache.set(shopId, { text: responseText, time: Date.now() });

    res.status(200).json({ success: true, data: responseText });
  } catch (error) {
    console.error("AI Error:", error);
    if (error?.status === 429) {
      return res
        .status(429)
        .json({
          success: false,
          message: "AI quota exceeded. Try again in a few minutes.",
        });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
