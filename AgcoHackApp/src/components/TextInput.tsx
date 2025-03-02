import React, { useState } from "react";

const TextInput = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    setInputValue(""); // Clear the input after submitting
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(); // Trigger submit on Enter key
    }
  };

  return (
    <div className="text-input-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing..."
      />
      <button onClick={handleSubmit}>→</button>{" "}
      {/* Submit button with an arrow */}
    </div>
  );
};

export default TextInput;
