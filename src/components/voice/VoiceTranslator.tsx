import { useState, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, Loader2, Languages, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

const VOICES = [
  { id: "george", name: "George", gender: "Masculin" },
  { id: "sarah", name: "Sarah", gender: "Féminin" },
  { id: "lily", name: "Lily", gender: "Féminin" },
  { id: "daniel", name: "Daniel", gender: "Masculin" },
  { id: "charlie", name: "Charlie", gender: "Masculin" },
  { id: "brian", name: "Brian", gender: "Masculin" },
];

interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  audioUrl?: string;
  timestamp: Date;
}

export function VoiceTranslator() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [selectedVoice, setSelectedVoice] = useState("george");
  const [translations, setTranslations] = useState<Translation[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Step 1: Transcribe audio
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const transcribeResponse = await fetch(
        "https://zvqiuhostvqwxtumrwdp.supabase.co/functions/v1/elevenlabs-transcribe",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed");
      }

      const transcription = await transcribeResponse.json();
      const originalText = transcription.text;

      if (!originalText || originalText.trim() === "") {
        toast({
          title: "Aucun texte détecté",
          description: "Veuillez réessayer en parlant plus clairement",
          variant: "destructive",
        });
        return;
      }

      // Step 2: Translate text
      const { data: translateData, error: translateError } = await supabase.functions.invoke("translate-text", {
        body: { 
          text: originalText, 
          targetLanguage,
          sourceLanguage: transcription.language_code || "auto",
        },
      });

      if (translateError) throw translateError;

      const translatedText = translateData.translatedText;

      // Step 3: Generate TTS for translation
      const ttsResponse = await fetch(
        "https://zvqiuhostvqwxtumrwdp.supabase.co/functions/v1/elevenlabs-tts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: translatedText, voice: selectedVoice }),
        }
      );

      if (!ttsResponse.ok) {
        throw new Error("TTS failed");
      }

      const ttsData = await ttsResponse.json();
      const audioUrl = `data:audio/mpeg;base64,${ttsData.audioContent}`;

      // Add translation to history
      const newTranslation: Translation = {
        id: crypto.randomUUID(),
        originalText,
        translatedText,
        targetLanguage,
        audioUrl,
        timestamp: new Date(),
      };

      setTranslations(prev => [newTranslation, ...prev]);

      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("vocals").insert({
          user_id: user.id,
          original_text: originalText,
          original_language: transcription.language_code,
          translated_text: translatedText,
          target_language: targetLanguage,
          voice_used: selectedVoice,
        });
      }

      // Auto-play the translation
      playAudio(audioUrl);

    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Erreur de traitement",
        description: "Impossible de traiter l'audio. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    
    audio.play();
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const targetLang = LANGUAGES.find(l => l.code === targetLanguage);

  return (
    <div className="space-y-6">
      {/* Language and Voice Selection */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                <Languages className="h-4 w-4 inline mr-1" />
                Traduire vers
              </label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                <Volume2 className="h-4 w-4 inline mr-1" />
                Voix
              </label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICES.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name} ({voice.gender})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recording Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`h-24 w-24 rounded-full transition-all ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600 animate-pulse" 
              : "gradient-primary shadow-primary"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-10 w-10" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {isProcessing 
          ? "Traitement en cours..." 
          : isRecording 
            ? "Appuyez pour arrêter" 
            : "Appuyez pour parler"
        }
      </p>

      {/* Translations History */}
      <div className="space-y-4">
        {translations.map((translation) => {
          const lang = LANGUAGES.find(l => l.code === translation.targetLanguage);
          return (
            <Card key={translation.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                {/* Original Text */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Original</p>
                  <p className="text-foreground">{translation.originalText}</p>
                </div>
                
                {/* Translated Text */}
                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-xs text-primary mb-1">
                    {lang?.flag} {lang?.name}
                  </p>
                  <p className="text-foreground font-medium">{translation.translatedText}</p>
                  {translation.audioUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => isPlaying ? stopAudio() : playAudio(translation.audioUrl!)}
                      className="mt-2"
                    >
                      {isPlaying ? (
                        <>
                          <Square className="h-4 w-4 mr-1" /> Arrêter
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" /> Écouter
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {translations.length === 0 && !isProcessing && (
        <div className="text-center py-12 text-muted-foreground">
          <Languages className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Appuyez sur le micro pour commencer</p>
          <p className="text-sm">Vos traductions apparaîtront ici</p>
        </div>
      )}
    </div>
  );
}
