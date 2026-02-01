import Groq from "groq-sdk";

export const analyzeCaseWithGroq = async ({ title, description, location }) => {
  // Validate API key exists
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined in environment variables. Please add it to your .env file.");
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // console.log("Groq API Key present:", !!process.env.GROQ_API_KEY);
  // console.log("API Key length:", process.env.GROQ_API_KEY?.length);

  try {
    // Using Llama 3.3 70B - extremely fast and powerful, completely free
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a legal case classification engine.
Analyze legal problems ONLY for classification.
Do NOT give legal advice.
Do NOT suggest lawyers.
Do NOT explain your answer.

Return STRICT JSON in this exact format:
{
  "caseType": "",
  "subCategory": "",
  "urgency": "",
  "suggestedSpecializations": [],
  "locationImportance": "",
  "confidenceScore": 0.0
}

Allowed caseType values:
Criminal Law, Civil Law, Property Law, Family Law, Corporate Law, Labour Law, Consumer Law, Constitutional Law, Other

Allowed urgency values: Low, Medium, High
Allowed locationImportance values: Low, Medium, High`
        },
        {
          role: "user",
          content: `Case Title: ${title || "N/A"}

Case Description: ${description}

Location: ${location?.city || ""}, ${location?.state || ""}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const text = chatCompletion.choices[0]?.message?.content || "{}";

    // Groq returns clean JSON, but still handle markdown wrapping just in case
    const cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Groq API Error:", error.message);
    console.error("Error details:", error);

    // Provide more specific error messages
    if (error.message?.includes("API key") || error.message?.includes("401")) {
      throw new Error("Invalid Groq API key. Please check your GROQ_API_KEY in .env file. Get a free key at https://console.groq.com/keys");
    }
    if (error.message?.includes("model")) {
      throw new Error("Invalid model name. The model 'llama-3.3-70b-versatile' may not be available.");
    }
    if (error.message?.includes("rate limit")) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }

    throw error;
  }
};

// Keep the old function name for backward compatibility
export default analyzeCaseWithGroq;
