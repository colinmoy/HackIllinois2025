import React, { useState, useRef } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // References for the audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);

      // Automatically upload the file once it's selected
      await handleFileUpload(file);
    }
  };

  // Handle file upload to the backend
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://your-backend-url/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully", response.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file");
    }
  };

  // Start recording the audio
  const startRecording = async () => {
    if (navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = []; // Reset chunks for next recording

        // Send audio to backend
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav"); // Append audio as a file
        await handleAudioUpload(formData);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  // Stop recording the audio
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Handle audio upload to the backend
  const handleAudioUpload = async (formData: FormData) => {
    try {
      const response = await axios.post(
        "http://your-backend-url/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Audio uploaded successfully", response.data);
      alert("Audio uploaded successfully!");
    } catch (error) {
      console.error("Error uploading audio", error);
      alert("Error uploading audio");
    }
  };

  return (
    <div className="file-upload-container">
      <div className="input-inline">
        {/* File upload button */}
        <label className="file-upload-btn">
          <img
            src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344393.jpg"
            alt="Upload Icon"
            style={{ width: "40px", height: "40px" }}
          />
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }} // Hide the default file input
          />
        </label>

        {/* Recording button with dynamic filter based on recording state */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="record-button"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/007/804/325/non_2x/record-icon-record-button-logo-illustration-isolated-on-white-background-editable-stroke-vector.jpg"
            alt="Record Icon"
            className={`record-icon ${isRecording ? "active" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
