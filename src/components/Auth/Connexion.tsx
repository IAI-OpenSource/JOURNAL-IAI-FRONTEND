import { Button } from "@/components/ui/button";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
// importation  du service d'auth
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

/**
 *  ca c le callback  de  authpage qui va permettre de gerer la vue 
 */
type ConnexionProps = {
  onSwitch: () => void;
};

export function Connexion({ onSwitch }: ConnexionProps) {
  const [showPassword, setShowPassword] = useState(false);
  //ajout des champs du formulaire
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //fonction de soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // On ici suppose que l'utilisateur mett son email vu que c'est ce que le bk attend 
      const response = await authService.login({ email: login, password });
      localStorage.setItem("access_token", response.access_token);
      // Redirection vers la page d'accueil
      navigate("/accueil");
    } catch (err: any) {
      setError(err.response?.data?.detail ?? err.message ?? "Échec de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex justify-center w-full">
          <IoPersonOutline size={80} />
        </CardTitle>

        <CardTitle className="text-3xl text-center">
          <h1>Se connecter</h1>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              {/* pour la lisibilité 'login' serait mieux */}
              <Label htmlFor="email">Login</Label>
              <Input
                id="login"
                type="text"
                placeholder="Entre votre email ou nom d'utilisateur"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  className="pr-10"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <Button type="submit" className="w-full mt-4 text-white bg-blue-500" disabled={loading}>
            {loading ? "Connexion..." : "Connexion"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <p>
          Pas de compte{" "}
          <button type="button" onClick={onSwitch} className="text-blue-400">
            S'inscrire
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}