import React, { useEffect, useRef } from "react";

// Define message structure to handle image, loading, and error states
interface Message {
  text: string;
  isUserMessage: boolean;
  imageUrl?: string;
  imageLoading?: boolean;
  imageError?: boolean;
}

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory = ({ messages }: ChatHistoryProps) => {
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

          {/* Display the image if it's uploaded */}
          {message.imageUrl && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <img
                src={message.imageUrl}
                alt="User Upload"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatHistory;
