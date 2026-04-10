import { useState, useEffect, useRef } from 'react';

interface UseVoiceInputResult {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

export function useVoiceInput(): UseVoiceInputResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
  };
}

export function parseVoiceCommand(transcript: string): { amount?: number; category?: string; action?: string } {
  const result: { amount?: number; category?: string; action?: string } = {};

  const amountMatch = transcript.match(/(?:spent|paid|₹|rs\.?|inr)?\s*(\d+)/i);
  if (amountMatch) {
    result.amount = parseInt(amountMatch[1], 10);
  }

  const categories = ['food', 'transport', 'shopping', 'entertainment', 'bills', 'health', 'travel', 'groceries'];
  const foundCategory = categories.find(cat => transcript.toLowerCase().includes(cat));
  if (foundCategory) {
    result.category = foundCategory.charAt(0).toUpperCase() + foundCategory.slice(1);
  }

  if (transcript.toLowerCase().includes('spent') || transcript.toLowerCase().includes('paid')) {
    result.action = 'expense';
  } else if (transcript.toLowerCase().includes('received') || transcript.toLowerCase().includes('got')) {
    result.action = 'income';
  }

  return result;
}
