import React, { useState } from "react";
import "../../test"

const TextInput = ({ onSubmit }: { onSubmit: (message: string) => void }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim() === "") return; // Do nothing if input is empty
    onSubmit(inputValue);
    setInputValue(""); // Clear the input field after submission
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      className="text-input-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative", // Ensures absolute positioning works
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing"
        style={{
          backgroundColor: "#2f2f2f",
          color: "white",
          border: "1px solid #444",
          padding: "12px 12px 12px 20px", // Padding to the left for space
          fontSize: "16px",
          borderRadius: "10px",
          width: "100%", // Adjust input width to take full space
          height: "45px", // Keep consistent height
          transition: "background-color 0.3s ease-in-out",
          outline: "none",
        }}
      />
      {/* Submit button inside the text input */}
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#444", // Slightly lighter than the input field
          color: "white",
          border: "1px solid #444",
          padding: "0", // Remove extra padding
          fontSize: "20px",
          borderRadius: "10px",
          cursor: "pointer",
          position: "absolute", // Position the button inside the input field
          right: "5px", // Align button to the right inside the input field
          top: "50%",
          transform: "translateY(-50%)", // Center the button vertically
          height: "35px", // Make button height smaller than input to fit nicely
          width: "35px", // Set button width
        }}
      >
        →
      </button>
    </div>
  );
};

export default TextInput;
