import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

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
        maxWidth: "800px",
        flex: 1,
        overflowY: "auto",
        backgroundColor: "#000",
        padding: "10px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxSizing: "border-box",
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
            backgroundColor: message.isUserMessage ? "#4e7dff" : "transparent",
            color: "white",
            alignSelf: message.isUserMessage ? "flex-end" : "flex-start",
            fontSize: message.isUserMessage ? "14px" : "18px",
            fontWeight: message.isUserMessage ? "normal" : "bold",
            textAlign: message.isUserMessage ? "right" : "left",
          }}
        >
          {message.isUserMessage ? (
            message.text
          ) : (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          )}

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
