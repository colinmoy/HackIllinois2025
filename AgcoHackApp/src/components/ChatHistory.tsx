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
        maxWidth: "800px", // Limit the max width as per your design
        flex: 1, // Allow container to take available height
        overflowY: "auto", // Enable vertical scrolling
        backgroundColor: "#000", // Black background
        padding: "10px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column", // Align items in a column
        gap: "10px", // Space between messages
        boxSizing: "border-box", // Ensure padding doesn’t affect size
      }}
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.isUserMessage ? "user" : "bot"}`}
          style={{
            padding: "10px",
            borderRadius: "10px",
            maxWidth: "80%", // Limit max width of the message
            wordWrap: "break-word",
            backgroundColor: message.isUserMessage ? "#4e7dff" : "transparent", // Only user messages have background color
            color: message.isUserMessage ? "white" : "white", // Text color for both user and bot
            alignSelf: message.isUserMessage ? "flex-end" : "flex-start", // Align user messages right, bot messages left
            fontSize: message.isUserMessage ? "14px" : "18px", // Larger font size for bot
            fontWeight: message.isUserMessage ? "normal" : "bold", // Bold text for bot
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
