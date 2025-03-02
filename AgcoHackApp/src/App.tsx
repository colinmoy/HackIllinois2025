import React, { useState } from "react";
import TextInput from "./components/TextInput";
import ChatHistory from "./components/ChatHistory";
import ImageUpload from "./components/ImageUpload";
import VoiceRecord from "./components/VoiceRecord";
import "./App.css"; // Assuming you have an external CSS file for styles

const App = () => {
  const [messages, setMessages] = useState<
    { text: string; isUserMessage: boolean }[]
  >([]);

  const handleTextSubmit = (message: string) => {
    // Add user message to chat history
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUserMessage: true },
    ]);

    // Simulate a bot response (replace with actual bot logic if needed)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Bot response: " + message, isUserMessage: false },
      ]);
    }, 1000);
  };

  return (
    <div className="app-container">
      {/* Chat history */}
      <div className="chat-history">
        <ChatHistory messages={messages} />
      </div>

      {/* Input and buttons */}
      <div className="input-container">
        <ImageUpload />
        <TextInput onSubmit={handleTextSubmit} />
        <VoiceRecord />
      </div>
    </div>
  );
};

export default App;
