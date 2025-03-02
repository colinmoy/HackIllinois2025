// global.d.ts
export {};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  var SpeechRecognition: {
    new (): SpeechRecognition;
  };
  var webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };
}
