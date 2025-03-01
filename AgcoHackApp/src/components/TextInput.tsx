import React, { useState } from "react";

const TextInput = () => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    setInputValue("");
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Ask me anything"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TextInput;
