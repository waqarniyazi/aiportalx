"use client";

import { useState } from "react";
import { Chat, ChatContainer, ChatForm } from "@/components/ui/chat";
import ModelSelector from "@/components/ModelSelector";

export default function DeploymentPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState("deepseek-ai/DeepSeek-R1"); // default model

  // Define handleSubmit to send the current messages and selected model
  const handleSubmit = async (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList },
  ) => {
    event?.preventDefault();
    if (!input.trim()) return;

    // Append the user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, model: selectedModel }),
      });
      const data = await response.json();
      const assistantMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Top area: Model selector */}
      <div className="p-4">
        <ModelSelector value={selectedModel} onSelect={setSelectedModel} />
      </div>
      {/* Chat area */}
      <div className="flex-1 border-t">
        <Chat
          messages={messages}
          input={input}
          handleInputChange={(e) => setInput(e.target.value)}
          handleSubmit={handleSubmit}
          isGenerating={isGenerating}
          suggestions={[
            "What is the weather in Tokyo?",
            "Tell me about AI inference.",
          ]}
          append={(msg) => setMessages([...messages, msg])}
        />
      </div>
    </div>
  );
}
