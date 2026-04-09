import { Button } from "@/components/ui/button";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdEmail, MdOutlinePersonOutline } from "react-icons/md";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { authService } from "../../services/Auth";
import { toast } from "sonner";
import { z } from "zod";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// définition du schéma de validation
const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
});



type ConnexionProps = {
  onSwitch: () => void;
};

export function Connexion({ onSwitch }: ConnexionProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation avec Zod
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      toast.error(firstError);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.requestOtp(email, password);
      if (response.ok) {
        toast.success(response.result.message || "Code envoyé !");
        setStep(2);
      } else {
        toast.error(response.error || "Identifiants invalides");
      }
    } catch (err: any) {
      // Extraction de l'erreur backend et personnalisé 
      let errorMsg = err.response?.data?.error || "Erreur lors de la connexion";
      if (typeof errorMsg === 'string') {
        errorMsg = errorMsg.replace(/OTP/gi, "code d'identification");
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const response = await authService.verifyOtp(email, parseInt(otp));
      if (response.ok) {
        toast.success("Connexion réussie !");
        //a revoir pour gerer les roles 
        navigate("/accueil");
      } else {
        let errMsg = response.error || "Code incorrect. Veuillez recommencer.";
        if (typeof errMsg === 'string') {
          errMsg = errMsg.replace(/OTP/gi, "code d'identification");
        }
        toast.error(errMsg);
        setOtp("");
      }
    } catch (err: any) {
      let errorMsg = err.response?.data?.error || "Code invalide ou expiré";
      if (typeof errorMsg === 'string') {
        errorMsg = errorMsg.replace(/OTP/gi, "code d'identification");
      }
      toast.error(errorMsg);
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      {step === 1 && (
        <Card className="w-full max-w-sm border-none shadow-none">
          <CardHeader>
            <CardTitle className="flex justify-center w-full">
              <MdOutlinePersonOutline size={80} />
            </CardTitle>
            <CardTitle className="text-3xl text-center font-bold">Se connecter</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="login-form" onSubmit={handleRequestOtp} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    className="pr-10"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
              form="login-form"
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 h-11 text-white flex items-center justify-center"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                  Veuillez patienter
                </>
              ) : (
                "Continuer"
              )}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Pas de compte ?{" "}
              <button onClick={onSwitch} className="text-blue-500 font-semibold hover:underline">
                S'inscrire
              </button>
            </p>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-[400px] shadow-2xl border-none bg-white animate-in fade-in zoom-in duration-300">
            <CardHeader className="space-y-4 flex flex-col items-center">
              <div className="bg-blue-50 p-3 rounded-xl">
                <MdEmail className="text-red-600 size-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Authentification </CardTitle>
              <p className="text-xs text-muted-foreground text-center px-6">
                Nous avons envoyé un code à 6 chiffres à <br />
                <span className="font-semibold text-foreground">{email}</span>
              </p>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-6">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                onComplete={() => handleVerifyOtp()}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="rounded-md border h-12 w-10 md:h-14 md:w-12" />
                  <InputOTPSlot index={1} className="rounded-md border h-12 w-10 md:h-14 md:w-12" />
                  <InputOTPSlot index={2} className="rounded-md border h-12 w-10 md:h-14 md:w-12" />
                  <InputOTPSlot index={3} className="rounded-md border h-12 w-10 md:h-14 md:w-12" />
                  <InputOTPSlot index={4} className="rounded-md border h-12 w-10 md:h-14 md:w-12" />
                  <InputOTPSlot index={5} className="rounded-md border h-12 w-10 md:h-14 md:w-12" />
                </InputOTPGroup>
              </InputOTP>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={() => handleVerifyOtp()}
                disabled={loading || otp.length < 6}
                className="w-full bg-yellow-600 hover:bg-yellow-700 h-11 text-white"
              >
                {loading ? "Vérification..." : "Vérifier Le Code"}
              </Button>
              <button
                onClick={() => {
                  setOtp("");
                  setStep(1);
                }}
                className="text-sm text-muted-foreground hover:underline"
              >
                ← Retour a la connection
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>

  );
}