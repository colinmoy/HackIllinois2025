import React, { useEffect, useRef } from "react";

interface ChatHistoryProps {
  messages: { text: string; isUserMessage: boolean }[];
}

const ChatHistory = ({ messages }: ChatHistoryProps) => {
  // Ref to the bottom of the chat container
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat whenever the messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className="chat-history"
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "300px",
        overflowY: "auto",
        backgroundColor: "#333",
        padding: "10px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        scrollBehavior: "smooth", // Apply smooth scroll behavior
      }}
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.isUserMessage ? "user" : "bot"}`}
          style={{
            padding: "10px",
            borderRadius: "10px",
            maxWidth: "80%",
            wordWrap: "break-word",
            backgroundColor: message.isUserMessage ? "#4e7dff" : "#666",
            alignSelf: message.isUserMessage ? "flex-end" : "flex-start",
          }}
        >
          {message.text}
        </div>
      ))}
      {/* This empty div is used to scroll the chat to the bottom */}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatHistory;
