import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";


import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



import SpotlightCard from "@/components/ReactsLibsComponents/SpotlightCard";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Callback de authpage i ci  aussi.
 */

type InscriptionProps = {
  onSwitch: () => void;
};

interface FormData {
        //update, version finale
        nomUtilisateur: string;
        nom: string;
        prenoms: string;
        email: string;
        password: string;
        jetonIdentification: string;
    }


interface MessageState {
    type: "success" | "error";
    text: string;
}



export function Inscription({ onSwitch }: InscriptionProps) {
    const [formData, setFormData] = useState<FormData>({
        nomUtilisateur: "",
        nom: "",
        prenoms: "",
        email: "",
        password: "",
        jetonIdentification: "",
    });



    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<MessageState | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [jetonIdentification, setJetonIdentification] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }



    const handleOpenModal = (e: FormEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    }

    const handleFinalSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setIsModalOpen(false);

        const finalData = {...formData, jetonIdentification : jetonIdentification}; 
        try {
            //la route sera changée et le payload aussi surement
            //const response = await registerUser(formData);
            const success = true;
            setIsModalOpen(false);
            if (success) {
                setMessage({ type: "success", text: "Inscription réussie !" });
                console.log("Données envoyées:", finalData);
                // Ici on ne redirige plus avec navigate.
                // Le changement Connexion/Inscription est maintenant géré
                // par le parent via simple switch d'état.
                setTimeout(() => onSwitch(), 2000);
            }
        } catch (err) {
            setMessage({ type: "error", text: "Une erreur est survenue." });
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
        <Card className="w-full max-w-sm border-none shadow-none">
            <CardHeader>
                <CardTitle className="flex justify-center w-full">
                    {/*icône*/}
                    <IoPersonOutline size={80} />
                </CardTitle>
                <CardTitle className="text-3xl text-center">
                    <h1>S'inscrire</h1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleOpenModal} className="space-y-5">
                    {message && (
                    <div className={`p-3 text-sm rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {message.text}
                    </div>
                    )}


                    {/*Nom utilisateur*/}
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">        
                        <Label htmlFor="nomUtilisateur" className="text-gray-600">Nom d'utilisateur</Label>
                        <Input 
                            id="nomUtilisateur" 
                            name="nomUtilisateur" 
                            value={formData.nomUtilisateur} 
                            onChange={handleChange} 
                            className="border-gray-200 focus-visible:ring-blue-400 h-11" 
                            placeholder="Ex: iaitogo" 
                            required 
                        />
                        </div>


                        {/*Nom prénoms*/}
                        <div className="grid gap-2">
                            <Label htmlFor="nom" className="text-gray-600">Nom</Label>
                            <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} className="border-gray-200 h-11" placeholder="Nom" required />
                        </div>


                        <div className="grid gap-2">
                            <Label htmlFor="prenoms" className="text-gray-600">Prénoms</Label>
                            <Input id="prenoms" name="prenoms" value={formData.prenoms} onChange={handleChange} className="border-gray-200 h-11" placeholder="Prénoms" required />
                        </div>


                        {/*Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" 
                            className="text-gray-600">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="border-gray-200 h-11" placeholder="Ex : agbonon667@email.com" required />
                        </div>


                        {/*Mot de passe*/}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-gray-600">Mot de passe</Label>
                            <div className="relative">
                                <Input 
                                id="password" 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                value={formData.password} 
                                onChange={handleChange} 
                                className="border-gray-200 pr-10 h-11" 
                                placeholder="Votre mot de passe" 
                                required 
                                />
                            <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                            {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                            </button>
                            </div>
                        </div>


                        <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium h-12 rounded-xl mt-4 transition-all"
                        >
                        {loading ? "Chargement..." : "S'inscrire"}
                        </Button>
                    </div>
                
                </form>

                <CardFooter className="flex-col gap-2">
                {/*Compte existant*/}
                <p className="text-center text-sm text-gray-500 mt-6">
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

        </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 overflow-hidden border-none max-w-md bg-transparent shadow-none">

          {/*Spotlight Card*/}
          <SpotlightCard className="p-8 bg-white border rounded-2xl shadow-2xl" spotlightColor="rgba(240, 237, 237, 0.94)">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-center text-[#6366f1]">Validation de l'inscription</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <p className="text-sm text-gray-600 text-center px-2">
                Un jeton d'identification valide est nécessaire pour confirmer la création de votre compte.
              </p>
              
              <div className="space-y-2 text-left">
                <Label htmlFor="jeton" className="text-gray-700">Votre Jeton</Label>
                <Input 
                  id="jeton" 
                  placeholder="Saisir le jeton reçu" 
                  value={jetonIdentification} 
                  onChange={(e) => setJetonIdentification(e.target.value.replace(/\D/g, ""))}
                  className="h-12 text-center bg-white text-lg tracking-widest font-mono border-gray-700 focus-visible:ring-blue-400"
                  autoFocus 
                />
              </div>
              <Button onClick={handleFinalSubmit} disabled={loading || !jetonIdentification} className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white h-12 rounded-xl text-lg font-semibold transition-all">
                {loading ? "Validation en cours..." : "Confirmer l'inscription"}
              </Button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-full text-xs text-gray-400 hover:text-gray-600 hover:underline"
              >
                Annuler
              </button>
            </div>
          </SpotlightCard>
        </DialogContent>
      </Dialog>
    </>
    );
}