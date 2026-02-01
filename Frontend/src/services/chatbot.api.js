import api from "./api.js";

/**
 * Send a message to the AI chatbot
 * @param {string} message - User's message
 * @returns {Promise<object>} AI response
 */
export const sendMessage = async (message) => {
    const response = await api.post("/chatbot/chat", { message });
    return response.data;
};

export default { sendMessage };
