import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "sonner";
import { authService } from "../../services/Auth";
import { z } from "zod"; 
import { GrValidate } from "react-icons/gr";
import { MdOutlinePersonOutline } from "react-icons/md";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



type InscriptionProps = {
  onSwitch: () => void;
};

interface FormData {
  nomUtilisateur: string;
  nom: string;
  prenoms: string;
  email: string;
  password: string;
}



// Schéma de validation pour le mot de passe
const passwordSchema = z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères");

export function Inscription({ onSwitch }: InscriptionProps) {
  const [formData, setFormData] = useState<FormData>({
    nomUtilisateur: "",
    nom: "",
    prenoms: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [jetonIdentification, setJetonIdentification] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (e: FormEvent) => {
    e.preventDefault();
    
    // Validation Zod du mot de passe
    const validation = passwordSchema.safeParse(formData.password);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }
    
    setStep(2);
  };

  const handleFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      const response = await authService.register({
        email: formData.email,
        username: formData.nomUtilisateur,
        password: formData.password,
        jeton: jetonIdentification,
      });

      if (response.ok) {
        const successMsg = response.result?.message || "Inscription réussie !";
        toast.success(successMsg);
        
        setStep(1);
        
       
        setTimeout(() => onSwitch(), 2000);
      } else {
        const errorMsg = response.error || "Une erreur est survenue.";
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorDetail = 
        err.response?.data?.error || 
        err.response?.data?.detail?.[0]?.msg || 
        "Impossible de joindre le serveur.";
        
      toast.error(errorDetail);
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
            <CardTitle className="text-3xl text-center font-bold">
              S'inscrire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form id="register-form" onSubmit={handleOpenModal} className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="nomUtilisateur">Nom d'utilisateur</Label>
                  <Input
                    id="nomUtilisateur"
                    name="nomUtilisateur"
                    value={formData.nomUtilisateur}
                    onChange={handleChange}
                    className="h-11"
                    placeholder="Ex: iaitogo"
                    required
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} className="h-11" placeholder="Votre nom" required />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="prenoms">Prénoms</Label>
                  <Input id="prenoms" name="prenoms" value={formData.prenoms} onChange={handleChange} className="h-11" placeholder="Vos prénoms" required />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="h-11" placeholder="votre@email.com" required />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="pr-10 h-11"
                      placeholder="min 8 caractères"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-4 pt-2">
            <Button
              form="register-form"
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 h-11 text-white flex items-center justify-center font-medium"
            >
              Créer un compte
            </Button>
            <p className="text-center text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={onSwitch}
                className="text-blue-600 font-semibold hover:underline"
              >
                Se Connecter
              </button>
            </p>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-[400px] shadow-2xl border-none bg-white animate-in fade-in zoom-in duration-300">
            <CardHeader className="space-y-4 flex flex-col items-center">
              <CardTitle className="text-2xl font-bold text-center text-green-600"><GrValidate /></CardTitle>
              <p className="text-xs text-muted-foreground text-center px-6">
                Un jeton d'identification est nécessaire pour confirmer la création de votre compte.
              </p>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-6">
              <div className="w-full space-y-2 text-left">
                <Label htmlFor="jeton" className="text-gray-700">Votre Jeton</Label>
                <Input
                  id="jeton"
                  placeholder="Saisir le jeton"
                  value={jetonIdentification}
                  onChange={(e) => setJetonIdentification(e.target.value)}
                  className="h-12 text-center bg-white text-lg tracking-widest font-mono focus-visible:ring-blue-400"
                  autoFocus
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={handleFinalSubmit}
                disabled={loading || !jetonIdentification}
                className="w-full bg-yellow-600 hover:bg-yellow-700 h-11 text-white text-md font-semibold"
              >
                {loading ? "Validation en cours..." : "Confirmer l'inscription"}
              </Button>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-muted-foreground hover:underline"
              >
                ← Retour à l'inscription
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}