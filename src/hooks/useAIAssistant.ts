import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseAIAssistantOptions {
  context?: string;
}

export function useAIAssistant(options: UseAIAssistantOptions = {}) {
  const { context = "general" } = options;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      role: "user",
      content: userMessage.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { message: userMessage, context, type: "normal" },
      });

      if (error) {
        throw new Error(error.message || "Erreur de communication avec l'assistant");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de contacter l'assistant IA",
        variant: "destructive",
      });
      
      // Add error message
      const errorMsg: Message = {
        role: "assistant",
        content: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [context, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const getLastAssistantMessage = useCallback(() => {
    const assistantMessages = messages.filter(m => m.role === "assistant");
    return assistantMessages[assistantMessages.length - 1]?.content || null;
  }, [messages]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    getLastAssistantMessage,
  };
}
