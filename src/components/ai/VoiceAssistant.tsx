import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, X, Bot, Sparkles, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVoiceCommand } from "@/hooks/useVoiceCommand";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { cn } from "@/lib/utils";

interface VoiceAssistantProps {
  context?: string;
  className?: string;
  minimized?: boolean;
}

export function VoiceAssistant({ context = "general", className, minimized = false }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, sendMessage, clearMessages } = useAIAssistant({ context });
  
  const { isListening, transcript, isSupported, toggleListening } = useVoiceCommand({
    onResult: (text) => {
      setInputValue(text);
      // Auto-send after voice input
      setTimeout(() => {
        if (text.trim()) {
          handleSend(text);
        }
      }, 500);
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update input with transcript
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleSend = async (text?: string) => {
    const messageToSend = text || inputValue;
    if (!messageToSend.trim() || isLoading) return;
    
    setInputValue("");
    await sendMessage(messageToSend);
  };

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (minimized) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg animate-pulse-glow",
          "gradient-primary hover:scale-110 transition-transform",
          className
        )}
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "gradient-primary hover:scale-110 transition-transform",
          isOpen && "rotate-180",
          className
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Bot className="h-6 w-6 text-white animate-pulse" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] shadow-2xl",
          "animate-scale-in border-primary/20"
        )}>
          <CardHeader className="gradient-primary text-white rounded-t-lg py-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-lg">Assistant IA</span>
              </div>
              <div className="flex items-center gap-2">
                {isSupported && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full text-white hover:bg-white/20",
                      isListening && "voice-active bg-white/30"
                    )}
                    onClick={toggleListening}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white hover:bg-white/20"
                  onClick={clearMessages}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea className="h-[300px] p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="h-12 w-12 text-primary/30 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Bonjour ! Je suis votre assistant OkouSmart.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Comment puis-je vous aider aujourd'hui ?
                  </p>
                  {isSupported && (
                    <p className="text-xs text-primary mt-2">
                      🎤 Cliquez sur le micro pour parler
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                          message.role === "user"
                            ? "gradient-primary text-white rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.role === "assistant" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 mt-1 -mb-1 -mr-2"
                            onClick={() => isSpeaking ? stopSpeaking() : speakMessage(message.content)}
                          >
                            <Volume2 className={cn("h-3 w-3", isSpeaking && "text-primary")} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Voice indicator */}
            {isListening && (
              <div className="px-4 py-2 bg-primary/10 text-center">
                <p className="text-sm text-primary animate-pulse">
                  🎤 Écoute en cours... Parlez maintenant
                </p>
                {transcript && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    "{transcript}"
                  </p>
                )}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Posez votre question..."
                  disabled={isLoading || isListening}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !inputValue.trim()}
                  className="gradient-primary"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
