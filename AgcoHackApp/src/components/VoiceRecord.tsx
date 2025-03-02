import React, { useState, useEffect, useRef } from "react";

interface VoiceRecordProps {
  onLiveTranscription: (text: string) => void;
  onFinalTranscription: (text: string) => void;
}

// Fix: Declare missing Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
}

const VoiceRecord: React.FC<VoiceRecordProps> = ({
  onLiveTranscription,
  onFinalTranscription,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<string>("");

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let newTranscript = "";
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        newTranscript = result[0].transcript;
        isFinal = result.isFinal;
      }

      if (isFinal) {
        // Only append final results to the main transcript
        transcriptRef.current += " " + newTranscript.trim();
        transcriptRef.current = transcriptRef.current.trim();
        resetSilenceTimer();
      } else {
        // Show interim results as they come in (without adding to the main transcript)
        onLiveTranscription(transcriptRef.current + " " + newTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      stopRecording();
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start(); // Restart if still recording
      } else {
        setIsRecording(false);
      }
    };

    return () => {
      recognition.stop();
      clearSilenceTimer();
    };
  }, [onLiveTranscription, onFinalTranscription]);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setIsRecording(true);
    transcriptRef.current = ""; // Reset transcript
    recognitionRef.current.start();
    resetSilenceTimer();
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsRecording(false);
    clearSilenceTimer();

    // Only submit if the text contains meaningful content
    if (transcriptRef.current.trim().length > 0) {
      onFinalTranscription(transcriptRef.current.trim());
    }
  };

  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 10000); // **Mic stays on for 10 seconds after last speech**
  };

  const clearSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`record-icon ${isRecording ? "active" : ""}`}
      style={{
        width: "40px",
        height: "40px",
        cursor: "pointer",
        backgroundColor: isRecording ? "red" : "#444",
        borderRadius: "50%",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      {/* Mic Icon (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="white"
      >
        <path d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3zM19 10v2a7 7 0 01-14 0v-2H3v2a9 9 0 008 8.94V22h2v-1.06A9 9 0 0021 12v-2h-2z" />
      </svg>
    </button>
  );
};

export default VoiceRecord;
