import React, { useState, useRef } from "react";
import axios from "axios";

const VoiceRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // References for the audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
    } catch (error) {
      console.error("Error uploading audio", error);
    }
  };

  return (
    <div>
      {/* Mic icon for recording */}
      <img
        src="https://community.adobe.com/legacyfs/online/1168284_1.png"
        alt="Record"
        className={`record-icon ${isRecording ? "active" : ""}`}
        onClick={isRecording ? stopRecording : startRecording}
        style={{ width: "60px", height: "60px", cursor: "pointer" }}
      />
    </div>
  );
};

export default VoiceRecord;
