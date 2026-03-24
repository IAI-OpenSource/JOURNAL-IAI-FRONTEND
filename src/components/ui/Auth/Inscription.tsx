import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";

/**
 * Callback de authpage i ci  aussi.
 */
type InscriptionProps = {
  onSwitch: () => void;
};

interface FormData {
        //sera surement changé
        nomUtilisateur: string;
        nom: string;
        prenoms: string;
        email: string;
        //ya pas de champ mdp sur la maquette
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
        jetonIdentification: "",
    });

    const [showToken, setShowToken] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<MessageState | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            //la route sera changée et le payload aussi surement
            //const response = await registerUser(formData);
            const success = true;
            if (success) {
                setMessage({ type: "success", text: "Inscription réussie !" });

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
        <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-2xl shadow-sm border relative mx-auto">
            {/*icône*/}
            <div className="absolute top-6 right-8">
            <IoPersonOutline size={40} className="text-black" />
            </div>

            <div className="w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">S'inscrire</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {message && (
                <div className={`p-3 text-sm rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {message.text}
                </div>
                )}

                {/*nom utilisateur*/}
                <div className="space-y-1.5">
                <Label htmlFor="nomUtilisateur" className="text-gray-600">Nom d'utilisateur</Label>
                <Input 
                    id="nomUtilisateur" 
                    name="nomUtilisateur" 
                    value={formData.nomUtilisateur} 
                    onChange={handleChange} 
                    className="border-gray-200 focus-visible:ring-blue-400 h-11" 
                    placeholder="Ex: coderakb" 
                    required 
                />
                </div>

                    {/*nom prénoms*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="nom" className="text-gray-600">Nom</Label>
                    <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} className="border-gray-200 h-11" placeholder="Nom" required />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="prenoms" className="text-gray-600">Prénom</Label>
                    <Input id="prenoms" name="prenoms" value={formData.prenoms} onChange={handleChange} className="border-gray-200 h-11" placeholder="Prénom" required />
                </div>
                </div>

                {/*email */}
                <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-600">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="border-gray-200 h-11" placeholder="exemple@mail.com" required />
                </div>

                {/*jeton d'identification*/}
                <div className="space-y-1.5">
                <Label htmlFor="jetonIdentification" className="text-gray-600">Jeton d'identification</Label>
                <div className="relative">
                    <Input 
                    id="jetonIdentification" 
                    name="jetonIdentification" 
                    type={showToken ? "text" : "password"} 
                    value={formData.jetonIdentification} 
                    onChange={handleChange} 
                    className="border-gray-200 pr-10 h-11" 
                    placeholder="Votre jeton" 
                    required 
                    />
                    <button 
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                    {showToken ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
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
            </form>
            
            {/*Redirection si compte existant, ou possède un compte*/}
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
            </div>
        </div>
    );
}