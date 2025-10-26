import { useState, useEffect, useRef } from 'react';

// Fallback for environments where SpeechRecognition is not available.
// Fix: Cast window to `any` to access non-standard SpeechRecognition properties and rename the constant to avoid shadowing the global `SpeechRecognition` type.
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = (onTranscriptReady: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(interimTranscript);
      if (finalTranscript) {
        onTranscriptReady(finalTranscript.trim());
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setTranscript('');
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    
    return () => {
        recognition.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTranscriptReady]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) {
        console.error("Could not start recognition", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening, hasRecognitionSupport: !!SpeechRecognitionAPI };
};