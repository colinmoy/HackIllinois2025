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
  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [loadingDots, setLoadingDots] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>(""); // Added input state

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (loadingText !== null) {
      interval = setInterval(() => {
        setLoadingDots((prev) => {
          if (prev === "") return ".";
          if (prev === ".") return "..";
          if (prev === "..") return "...";
          return ".";
        });
      }, 500);
    } else {
      setLoadingDots("");
    }

    return () => clearInterval(interval);
  }, [loadingText]);

  const handleTextSubmit = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUserMessage: true },
    ]);

    setLoadingText("Loading...");

    askChatBot("text", message).then((result) => {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Bot response: " + result[0][1], isUserMessage: false },
        ]);
        setLoadingText(null);
      }, 1000);
    });
  };

  return (
    <div className="app-container">
      <div className="chat-history">
        <ChatHistory
          messages={[
            ...messages,
            ...(loadingText !== null
              ? [{ text: loadingDots, isUserMessage: false }]
              : []),
          ]}
        />
      </div>

      <div className="input-container">
        <ImageUpload />
        <TextInput
          onSubmit={handleTextSubmit}
          inputValue={inputValue}
          setInputValue={setInputValue} // Pass input state
        />
        <VoiceRecord
          onLiveTranscription={setInputValue} // Update input in real-time
          onFinalTranscription={handleTextSubmit} // Send final text as message
        />
      </div>
    </div>
  );
};

export default App;
