import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../services/chatbot.api";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello 👋 I'm your AI Legal Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    // Set loading state
    setIsLoading(true);

    try {
      // Call backend API
      const response = await sendMessage(userMessage);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      // Show error message
      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (error.response?.status === 401) {
        errorMessage = "Please login to use the chatbot.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-6 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-primary mb-4">
          AI Legal Assistant
        </h1>

        {/* Chat Box */}
        <div className="flex flex-col h-[70vh] border border-borderColor rounded-xl bg-white shadow-sm">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-lg text-sm whitespace-pre-wrap ${msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-light text-gray-700 border border-borderColor"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] px-4 py-3 rounded-lg text-sm bg-light text-gray-700 border border-borderColor">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-borderColor p-4 flex gap-3">
            <input
              type="text"
              placeholder="Type your legal question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dull transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Chatbot;
