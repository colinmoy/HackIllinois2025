import React from "react";

interface TextInputProps {
  onSubmit: (message: string) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputHeight?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  onSubmit,
  inputValue,
  setInputValue,
  inputHeight = "45px", // Default height if not provided
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim() === "") return;
    onSubmit(inputValue);
    setInputValue(""); // Clear the input field upon submit
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
        position: "relative",
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
          padding: "12px 45px 12px 20px", // Increased right padding to 45px\n          fontSize: "16px",
          borderRadius: "10px",
          width: "100%",
          height: inputHeight,
          overflowX: "auto", // Allow horizontal scrolling if text is too long\n          transition: "background-color 0.3s ease-in-out",
          outline: "none",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#444",
          color: "white",
          border: "1px solid #444",
          padding: "0",
          fontSize: "20px",
          borderRadius: "10px",
          cursor: "pointer",
          position: "absolute",
          right: "5px",
          top: "50%",
          transform: "translateY(-50%)",
          height: "35px",
          width: "35px",
        }}
      >
        →
      </button>
    </div>
  );
};

export default TextInput;
