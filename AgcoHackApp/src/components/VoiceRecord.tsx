import React, { useState, useEffect, useRef } from "react";

interface VoiceRecordProps {
  onLiveTranscription: (text: string) => void;
  onFinalTranscription: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
}

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
  isRecording,
  setIsRecording,
}) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptBuffer = useRef<string[]>([]);

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
        transcriptBuffer.current.push(newTranscript.trim());
        const cleanTranscript = transcriptBuffer.current
          .join(" ")
          .replace(/\b(\w+)\s+\1\b/g, "$1");
        onLiveTranscription(cleanTranscript);
        resetSilenceTimer();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      stopRecording();
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    return () => {
      recognition.stop();
      clearSilenceTimer();
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setIsRecording(true);
    recognitionRef.current.start();
    transcriptBuffer.current = [];
    resetSilenceTimer();
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsRecording(false);
    clearSilenceTimer();

    const finalText = transcriptBuffer.current.join(" ").trim();
    if (finalText) {
      onFinalTranscription(finalText);
    }
    transcriptBuffer.current = [];
  };

  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 10000);
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
