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
You are LegalEase AI Assistant.
You explain Indian laws in very simple language.
Avoid complex legal terms.
Do not give illegal or unethical advice.
If a matter is serious, suggest consulting a lawyer.
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
