import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX, RefreshCw, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getGeminiResponse, ChatMessage } from "@/services/aiService";
import { Language } from "@/data/krishiMysuru";

interface KrishiVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const copy = {
  en: {
    title: "Krishi AI Voice Assistant",
    subtitle: "Your intelligent farming companion",
    placeholder: "Ask about crops, soil, weather, or schemes...",
    listening: "Listening carefully...",
    speakBtn: "Tap to Speak",
    stopBtn: "Stop Listening",
    sendBtn: "Send query",
    mute: "Mute voice",
    unmute: "Unmute voice",
    errorSpeech: "Speech recognition not supported in this browser. Please type your query.",
    welcome: "Hello! I am Krishi AI. How can I help you with your farming today?",
    reset: "Clear chat",
    systemStatus: "Ready",
    connecting: "Thinking...",
  },
  kn: {
    title: "ಕೃಷಿ AI ಧ್ವನಿ ಸಹಾಯಕ",
    subtitle: "ನಿಮ್ಮ ಕೃಷಿ ಸಲಹೆಗಾರ",
    placeholder: "ಬೆಳೆಗಳು, ಹವಾಮಾನ ಅಥವಾ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    listening: "ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...",
    speakBtn: "ಮಾತನಾಡಲು ಒತ್ತಿ",
    stopBtn: "ನಿಲ್ಲಿಸಲು ಒತ್ತಿ",
    sendBtn: "ಕಳುಹಿಸಿ",
    mute: "ಧ್ವನಿ ಆಫ್ ಮಾಡಿ",
    unmute: "ಧ್ವನಿ ಆನ್ ಮಾಡಿ",
    errorSpeech: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.",
    welcome: "ನಮಸ್ಕಾರ! ನಾನು ಕೃಷಿ AI. ಇಂದು ನಿಮ್ಮ ಕೃಷಿ ಕೆಲಸದಲ್ಲಿ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    reset: "ಚಾಟ್ ಅಳಿಸಿ",
    systemStatus: "ಸಿದ್ಧವಾಗಿದೆ",
    connecting: "ಯೋಚಿಸುತ್ತಿದೆ...",
  },
  hi: {
    title: "कृषि AI वॉयस सहायक",
    subtitle: "आपका स्मार्ट खेती साथी",
    placeholder: "फसलों, मौसम या योजनाओं के बारे में पूछें...",
    listening: "सुन रहा हूँ...",
    speakBtn: "बोलने के लिए टैप करें",
    stopBtn: "सुनना बंद करें",
    sendBtn: "भेजें",
    mute: "आवाज़ बंद करें",
    unmute: "आवाज़ चालू करें",
    errorSpeech: "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। कृपया टाइप करें।",
    welcome: "नमस्ते! मैं कृषि AI हूँ। आज मैं आपकी खेती में कैसे सहायता कर सकता हूँ?",
    reset: "चैट साफ़ करें",
    systemStatus: "तैयार",
    connecting: "सोच रहा हूँ...",
  },
} as const;

export function KrishiVoiceAssistant({ isOpen, onClose, language }: KrishiVoiceAssistantProps) {
  const t = copy[language] ?? copy.en;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [transcriptText, setTranscriptText] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const handleSubmitRef = useRef<(text: string) => Promise<void>>();

  // ─── Speak assistant response aloud ───────────────────────────
  const speak = useCallback((text: string) => {
    if (isMuted || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any current speech

    // Remove markdown asterisks or special characters to make speech sound natural
    const cleanText = text.replace(/[*#_~`-]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (language === "kn") {
      utterance.lang = "kn-IN";
    } else if (language === "hi") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    window.speechSynthesis.speak(utterance);
  }, [isMuted, language]);

  // ─── Submit query (voice or text) ────────────────────────────
  const handleSubmit = useCallback(async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    // 1. Add user message to thread immediately
    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setTranscriptText("");
    setIsGenerating(true);

    try {
      // Build chat history from current messages (excluding welcome)
      // Use a ref-style read via setState to get latest state
      let chatHistory: ChatMessage[] = [];
      setMessages((prev) => {
        chatHistory = prev
          .filter((m) => m.role !== "assistant" || m.text !== t.welcome)
          .slice(0, -1); // exclude the just-added user message from history
        return prev; // don't modify state
      });

      // 2. Fetch response from Gemini AI service
      const reply = await getGeminiResponse(text, chatHistory, language);

      // 3. Add model reply
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);

      // 4. Speak response
      speak(reply);
    } catch (err) {
      console.error("AI response error:", err);
      const errMsg = language === "kn"
        ? "ಕ್ಷಮಿಸಿ, ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ."
        : language === "hi"
        ? "क्षमा करें, प्रतिक्रिया प्राप्त करने में विफल। कृपया पुन: प्रयास करें।"
        : "Sorry, I encountered an error. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: errMsg }]);
    } finally {
      setIsGenerating(false);
    }
  }, [language, speak, t.welcome]);

  // ─── Keep handleSubmitRef always pointing to the latest handleSubmit ──
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  // ─── Initialize Speech Recognition ──────────────────────────
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;

    // Map language locales
    if (language === "kn") {
      rec.lang = "kn-IN";
    } else if (language === "hi") {
      rec.lang = "hi-IN";
    } else {
      rec.lang = "en-IN";
    }

    rec.onstart = () => {
      setIsListening(true);
      setTranscriptText("");
      transcriptRef.current = "";
    };

    rec.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Concatenate both so we don't lose interim text if final text already exists
      const displayText = finalTranscript + interimTranscript;
      setTranscriptText(displayText);
      transcriptRef.current = displayText;
    };

    rec.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        setSpeechSupported(false);
      }
    };

    rec.onend = () => {
      setIsListening(false);
      const text = transcriptRef.current.trim();
      if (text && handleSubmitRef.current) {
        handleSubmitRef.current(text);
      }
    };

    recognitionRef.current = rec;

    // Reset messages with welcome note in local language
    setMessages([
      { role: "assistant", text: t.welcome }
    ]);

    // Clean up
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language, isOpen, t.welcome]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating, transcriptText]);

  // Start speech recognition
  const startListening = () => {
    if (!speechSupported || isGenerating) return;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Mute assistant if user interrupts
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Clear Chat History
  const clearHistory = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMessages([{ role: "assistant", text: t.welcome }]);
    setInputText("");
    setTranscriptText("");
  };

  // Handle closing modal
  const handleClose = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stopListening();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg overflow-hidden border border-glass-border bg-glass/96 p-0 text-glass-foreground shadow-glass backdrop-blur-panel">
        
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between border-b border-glass-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-4 animate-pulse" />
            </div>
            <div>
              <DialogTitle className="font-display text-lg font-black leading-none">{t.title}</DialogTitle>
              <p className="text-[11px] font-bold text-muted-foreground mt-1">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? t.unmute : t.mute}
            >
              {isMuted ? <VolumeX className="size-4 text-destructive" /> : <Volume2 className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={clearHistory}
              title={t.reset}
            >
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Chat Thread Area */}
        <div className="flex h-[340px] flex-col overflow-y-auto bg-card/10 px-5 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 text-sm font-semibold shadow-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-tr-none bg-primary text-primary-foreground"
                    : "rounded-tl-none border border-glass-border bg-card/80 text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* User speech transcript in progress */}
          {isListening && transcriptText && (
            <div className="flex w-full justify-end animate-pulse">
              <div className="max-w-[85%] rounded-[1.25rem] rounded-tr-none bg-primary/45 px-4 py-3 text-sm font-semibold text-primary-foreground italic">
                {transcriptText}
              </div>
            </div>
          )}

          {/* AI Thinking/Generating state */}
          {isGenerating && (
            <div className="flex w-full justify-start animate-pulse">
              <div className="flex items-center gap-2 rounded-[1.25rem] rounded-tl-none border border-glass-border bg-card/85 px-4 py-3 text-sm font-bold text-muted-foreground">
                <div className="flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                  <span className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                  <span className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
                </div>
                <span>{t.connecting}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Visualizer Status & Mic Control */}
        <div className="flex flex-col items-center justify-center border-t border-glass-border bg-card/15 py-6">
          {!speechSupported ? (
            <p className="px-5 text-center text-xs font-semibold text-destructive">{t.errorSpeech}</p>
          ) : (
            <div className="relative flex flex-col items-center justify-center">
              {/* Outer pulsing animation ring */}
              {isListening && (
                <>
                  <div className="absolute size-24 animate-ping rounded-full bg-primary/15" />
                  <div className="absolute size-20 animate-pulse rounded-full bg-primary/25" />
                </>
              )}
              
              <Button
                size="lg"
                className={`relative z-10 size-16 rounded-full shadow-lg transition-transform active:scale-95 ${
                  isListening
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                onClick={isListening ? stopListening : startListening}
                disabled={isGenerating}
              >
                {isListening ? (
                  <MicOff className="size-6 animate-pulse" />
                ) : (
                  <Mic className="size-6" />
                )}
              </Button>
              <p className="mt-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
                {isListening ? t.listening : t.speakBtn}
              </p>
            </div>
          )}
        </div>

        {/* Text Input Footer Fallback */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(inputText);
          }}
          className="flex border-t border-glass-border bg-card/40 p-3 gap-2"
        >
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.placeholder}
            disabled={isListening || isGenerating}
            className="h-11 w-full rounded-xl border border-input bg-background/80 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim() || isListening || isGenerating}
            className="size-11 shrink-0 rounded-xl"
            aria-label={t.sendBtn}
          >
            <Send className="size-4" />
          </Button>
        </form>

      </DialogContent>
    </Dialog>
  );
}
