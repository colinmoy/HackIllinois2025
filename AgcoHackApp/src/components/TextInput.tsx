import React, { useState } from "react";

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
        position: "relative", // This is to make the button inside the input
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
          padding: "12px 12px 12px 20px", // Add padding to the left to give space for the button
          fontSize: "16px",
          borderRadius: "10px",
          width: "100%",
          height: "45px", // Make the input height a bit taller
          transition: "background-color 0.3s ease-in-out",
          outline: "none",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#2f2f2f",
          color: "white",
          border: "1px solid #444",
          padding: "12px", // Increase padding for a larger button
          fontSize: "20px", // Decrease arrow size slightly
          borderRadius: "10px",
          cursor: "pointer",
          position: "absolute", // Position the button inside the input
          right: "5px", // Position it to the right side inside the input
          top: "50%",
          transform: "translateY(-50%)", // Center the button vertically inside the input
          height: "45px", // Match the height with the input
          width: "45px", // Adjust the width to be a bit larger
        }}
      >
        →
      </button>
    </div>
  );
};

export default TextInput;
