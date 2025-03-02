import React from "react";
import TextInput from "./components/TextInput";
import ImageUpload from "./components/ImageUpload";
import VoiceRecord from "./components/VoiceRecord";
import "./App.css"; // Assuming you have an external CSS file for styles

function App() {
  return (
    <div className="app-container">
      <div className="input-container">
        <ImageUpload />
        <TextInput />
        <VoiceRecord />
      </div>
    </div>
  );
}

export default App;
