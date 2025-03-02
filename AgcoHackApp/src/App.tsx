import React, { useState, useEffect } from "react";
import TextInput from "./components/TextInput";
import ChatHistory from "./components/ChatHistory";
import ImageUpload from "./components/ImageUpload";
import VoiceRecord from "./components/VoiceRecord";
import "./App.css"; // Assuming you have an external CSS file for styles
import { askChatBot } from "../test";

const App = () => {
  const [messages, setMessages] = useState<
    { text: string; isUserMessage: boolean }[]
  >([]);
  const [loadingText, setLoadingText] = useState<string | null>(null); // Store loading text
  const [loadingDots, setLoadingDots] = useState<string>("");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (loadingText !== null) {
      interval = setInterval(() => {
        // Cycle through ".", "..", and "..."
        setLoadingDots((prev) => {
          if (prev === "") return ".";
          if (prev === ".") return "..";
          if (prev === "..") return "...";
          return "."; // Reset back to "."
        });
      }, 500);
    } else {
      setLoadingDots(""); // Reset loading dots when loadingText is null
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [loadingText]);

  const handleTextSubmit = (message: string) => {
    // Add user message to chat history
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUserMessage: true },
    ]);

    setLoadingText("Loading..."); // Set loading text when waiting for bot response

    // Simulate a bot response (replace with actual bot logic if needed)
    askChatBot("text", message).then((result) => {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Bot response: " + result[0][1], isUserMessage: false },
        ]);
        setLoadingText(null); // Stop loading animation
      }, 1000);
    });
  };

  return (
    <div className="app-container">
      {/* Chat history */}
      <div className="chat-history">
        <ChatHistory
          messages={[
            ...messages,
            ...(loadingText !== null
              ? [{ text: loadingDots, isUserMessage: false }] // Show loading animation
              : []),
          ]}
        />
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
