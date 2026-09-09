'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Web Speech API interface declarations for TypeScript
interface IWindowSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => IWindowSpeechRecognition;
    webkitSpeechRecognition?: new () => IWindowSpeechRecognition;
  }
}

export function useSpeechRecognition(langCode: string = 'en-IN') {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<IWindowSpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        setIsSupported(true);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (onFinalTranscript?: (text: string) => void) => {
      setError(null);
      setTranscript('');

      if (typeof window === 'undefined') return;
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        setError('Speech recognition is not supported in this browser.');
        return;
      }

      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }

        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = langCode;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: ISpeechRecognitionEvent) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);

          const lastResult = event.results[event.results.length - 1];
          if (lastResult.isFinal && onFinalTranscript && currentText.trim()) {
            onFinalTranscript(currentText.trim());
          }
        };

        recognition.onerror = (e: ISpeechRecognitionErrorEvent) => {
          console.warn('Speech recognition error:', e.error);
          if (e.error !== 'no-speech') {
            setError(e.error);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err: unknown) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    },
    [langCode]
  );

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    setTranscript,
  };
}
