import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";

interface OTPVerificationProps {
  phone: string;
  onBack: () => void;
}

export function OTPVerification({ phone, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const { verifyOtp, signInWithPhone, loading } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    const { error } = await verifyOtp(phone, otp);
    if (!error) {
      navigate("/dashboard");
    }
  };

  const handleResend = async () => {
    await signInWithPhone(phone);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <CardTitle className="text-2xl">Vérification</CardTitle>
        <CardDescription>
          Entrez le code à 6 chiffres envoyé au {phone}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          onClick={handleVerify}
          className="w-full"
          disabled={loading || otp.length !== 6}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Vérifier
        </Button>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Vous n'avez pas reçu le code ?{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={handleResend}
              disabled={loading}
            >
              Renvoyer
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
