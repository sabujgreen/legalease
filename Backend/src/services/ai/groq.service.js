import Groq from "groq-sdk";
import fs from "fs/promises";

const IPC_JSON_URL = new URL("../../../../Indian-Law-Penal-Code-Json/ipc.json", import.meta.url);
const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "into",
  "your",
  "have",
  "been",
  "were",
  "what",
  "when",
  "where",
  "which",
  "about",
  "there",
  "their",
  "will",
  "would",
  "could",
  "should",
  "under",
  "into",
  "over",
  "after",
  "before",
  "through",
  "because",
  "while",
  "does",
  "did",
  "done",
  "only",
  "very",
  "user",
  "situation",
  "input",
  "case",
  "law",
  "legal"
]);

let cachedIpcSections = null;

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

const normalizeIpcSection = (entry) => ({
  section: String(entry.Section ?? entry.section ?? "").trim(),
  title: String(entry.section_title ?? entry.title ?? "").trim(),
  description: String(entry.section_desc ?? entry.description ?? "").trim(),
  chapter: entry.chapter ?? null,
  chapterTitle: entry.chapter_title ?? null,
  punishment: entry.punishment ?? entry.penalty ?? null,
});

const loadIpcSections = async () => {
  if (cachedIpcSections) {
    return cachedIpcSections;
  }

  const raw = await fs.readFile(IPC_JSON_URL, "utf8");
  const parsed = JSON.parse(raw);
  cachedIpcSections = Array.isArray(parsed) ? parsed.map(normalizeIpcSection) : [];
  return cachedIpcSections;
};

const scoreSectionForQuery = (queryTokens, section) => {
  const haystackTokens = normalizeText(
    `${section.section} ${section.title} ${section.description}`
  );

  if (!queryTokens.length || !haystackTokens.length) {
    return 0;
  }

  let score = 0;
  for (const token of queryTokens) {
    if (haystackTokens.includes(token)) {
      score += 4;
    }
    if (section.title.toLowerCase().includes(token)) {
      score += 3;
    }
    if (section.description.toLowerCase().includes(token)) {
      score += 1;
    }
  }

  return score;
};

export const getRelevantIpcSections = async (userInput, limit = 5) => {
  const sections = await loadIpcSections();
  const queryTokens = normalizeText(userInput);

  return sections
    .map((section) => ({
      ...section,
      relevanceScore: scoreSectionForQuery(queryTokens, section),
    }))
    .filter((section) => section.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
    .map(({ relevanceScore, ...section }) => section);
};

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
      throw new Error("Invalid Groq API key. Please check your GROQ_API_KEY in .env file. Get a free key at https://console.groq.com/keys", { cause: error });
    }
    if (error.message?.includes("model")) {
      throw new Error("Invalid model name. The model 'llama-3.3-70b-versatile' may not be available.", { cause: error });
    }
    if (error.message?.includes("rate limit")) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.", { cause: error });
    }

    throw error;
  }
};

export const analyzeIpcSituationWithGroq = async ({ userInput, retrievedSections }) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined in environment variables. Please add it to your .env file.");
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const sections = Array.isArray(retrievedSections) && retrievedSections.length
    ? retrievedSections.map(normalizeIpcSection)
    : await getRelevantIpcSections(userInput, 8);

  const systemPrompt = `You are a precise Indian criminal law assistant focused on IPC analysis.

Your job is to give only legal information based strictly on the IPC sections provided in the prompt.

What you must do:
- Identify the IPC sections that may apply to the user's facts
- Explain why each section may apply in clear legal terms
- State the possible legal consequences, such as imprisonment, fine, arrest risk, bail implications, or police investigation, only when supported by the provided IPC data
- Give practical next steps in legal terms, such as consulting a criminal lawyer, preserving evidence, responding to police notice, filing a complaint, or preparing for bail, when relevant

What you must not do:
- Do not give moral, ethical, emotional, or motivational advice unless it is directly relevant to legal risk
- Do not give final legal judgments
- Do not invent any IPC section that is not present in the retrieved sections
- Do not invent punishment details if they are not explicitly present in the retrieved data
- Do not discuss unrelated laws or general legal theory

Style rules:
- Use cautious wording such as "may attract", "could be considered", and "appears to fit"
- Stay factual, concise, and legally grounded
- If no section clearly applies, say that honestly

Return strict JSON only in this format:
{
  "applicableIpcSections": [
    {
      "section": "",
      "title": ""
    }
  ],
  "whyTheseSectionsApply": [
    ""
  ],
  "possibleLegalConsequences": [
    ""
  ],
  "practicalAdvice": [
    ""
  ]
}`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `USER SITUATION:\n${userInput}\n\nRELEVANT IPC DATA:\n${JSON.stringify(sections, null, 2)}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_tokens: 1200,
    response_format: { type: "json_object" },
  });

  const text = chatCompletion.choices[0]?.message?.content || "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
};

export const classifyOffenseCategoriesWithGroq = async ({ userInput, retrievedSections }) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined in environment variables. Please add it to your .env file.");
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const sections = Array.isArray(retrievedSections) && retrievedSections.length
    ? retrievedSections.map(normalizeIpcSection)
    : await getRelevantIpcSections(userInput, 8);

  const systemPrompt = `You are a legal issue classifier.

Given a user query, identify the type of offense involved.

Categories:
- Cheating / Fraud
- Theft
- Assault
- Criminal Breach of Trust
- Defamation
- Other

Return the top 2 categories only as strict JSON:
{
  "topCategories": ["", ""]
}

Use only the provided IPC context when it is available. Do not add moral or ethical commentary. If nothing matches clearly, include "Other" as needed.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `USER INPUT:\n${userInput}\n\nRELEVANT IPC DATA:\n${JSON.stringify(sections, null, 2)}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 256,
    response_format: { type: "json_object" },
  });

  const text = chatCompletion.choices[0]?.message?.content || "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
};

// Keep the old function name for backward compatibility
export default analyzeCaseWithGroq;

