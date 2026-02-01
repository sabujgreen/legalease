import { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello 👋 I’m your AI Legal Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input },
      {
        sender: "ai",
        text: "Thanks for your question. I’ll help you with this shortly.",
      },
    ]);

    setInput("");
  };

  return (
    <section className="px-6 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-primary mb-4">
          AI Legal Assistant
        </h1>

        {/* Chat Box */}
        <div className="flex flex-col h-[70vh] border border-borderColor rounded-xl bg-white">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-light text-gray-700 border border-borderColor"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-borderColor p-4 flex gap-3">
            <input
              type="text"
              placeholder="Type your legal question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2 rounded-lg border border-borderColor focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dull transition-colors"
            >
              Send
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Chatbot;
