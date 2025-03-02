import TextInput from "./components/TextInput";
import FileUpload from "./components/FileUpload";
import { useState } from "react";
import "./App.css"; // Assuming you have an external CSS file for styles

function App() {
  return (
    <div className="app-container">
      <div className="input-container">
        <TextInput />
        <FileUpload />
      </div>
    </div>
  );
}

export default App;
