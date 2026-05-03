import chatWithGroq from "../../services/ai/chatbot.service.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // System prompt for LegalEase AI
    const systemPrompt = `
You are LegalEase AI Assistant focused on Indian criminal law and IPC-style legal analysis.

Your answer must stay in legal terms and should clearly include:
1. Possible criminal charges or offence types
2. Relevant IPC sections, if they can be reasonably identified from the facts
3. Possible legal consequences
4. Immediate lawful next steps the user should take

Rules:
- Do not give moral, ethical, or emotional advice unless it is directly relevant to legal risk
- Do not tell the user how to evade responsibility or "lower consequences" unlawfully
- Do not give final legal judgment
- If the exact section is uncertain, say it may attract charges under relevant IPC provisions
- Use cautious wording such as "may attract", "could be considered", and "appears to fit"
- Keep the response practical, factual, and concise
- If the situation is serious, advise consulting a criminal lawyer and cooperating with police

Preferred response structure:
Possible Criminal Charges:
IPC Sections:
Why They May Apply:
Possible Legal Consequences:
Immediate Legal Next Steps:
`;

    const aiResponse = await chatWithGroq([
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ]);

    return res.status(200).json({
      success: true,
      reply: aiResponse,
    });

  } catch (error) {
    console.error("Chatbot Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get AI response",
    });
  }
};
