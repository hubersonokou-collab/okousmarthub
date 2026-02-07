import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return { error };
    }

    toast({
      title: "Connexion réussie",
      description: "Bienvenue !",
    });
    setLoading(false);
    return { error: null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || "",
        },
      },
    });

    if (error) {
      let message = error.message;
      if (error.message.includes("already registered")) {
        message = "Cet email est déjà utilisé. Veuillez vous connecter.";
      }
      toast({
        title: "Erreur d'inscription",
        description: message,
        variant: "destructive",
      });
      setLoading(false);
      return { error };
    }

    toast({
      title: "Inscription réussie",
      description: "Vérifiez votre email pour confirmer votre compte.",
    });
    setLoading(false);
    return { error: null };
  };

  const signInWithPhone = async (phone: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return { error };
    }

    toast({
      title: "Code envoyé",
      description: "Un code de vérification a été envoyé à votre téléphone.",
    });
    setLoading(false);
    return { error: null };
  };

  const verifyOtp = async (phone: string, token: string) => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) {
      toast({
        title: "Code invalide",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return { error };
    }

    toast({
      title: "Connexion réussie",
      description: "Bienvenue !",
    });
    setLoading(false);
    return { error: null };
  };

  const signInAnonymously = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return { error };
    }

    toast({
      title: "Connexion en mode invité",
      description: "Vous pouvez explorer la plateforme.",
    });
    setLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
    
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    });
    return { error: null };
  };

  return {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    verifyOtp,
    signInAnonymously,
    signOut,
    isAuthenticated: !!session,
    isAnonymous: user?.is_anonymous ?? false,
  };
}
