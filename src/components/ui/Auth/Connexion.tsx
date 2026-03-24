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

/**
 *  ca c le callback  de  authpage qui va permettre de gerer la vue 
 */
type ConnexionProps = {
  onSwitch: () => void;
};

export function Connexion({ onSwitch }: ConnexionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);

  return (
    <Card className="w-full max-w-sm border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex justify-center w-full">
          <IoPersonOutline size={80} />
        </CardTitle>

        <CardTitle className="text-3xl">
          <h1>Se connecter</h1>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email || Nom d'utilisateur</Label>
              <Input
                id="email"
                type="email"
                placeholder="iaitogo@gmail.com"
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

            <div className="grid gap-2">
              <Label htmlFor="code">Code d'identification</Label>
              <div className="relative">
                <Input
                  className="pr-10"
                  id="code"
                  type={showCode ? "text" : "password"}
                  placeholder="Saisir le code d'identification"
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                </button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full text-white bg-blue-500">
          Connexion
        </Button>

        <p>
          Pas de compte{" "}
          {/* Déclenche simplement le switch de vue géré par le parent */}
          <button type="button" onClick={onSwitch} className="text-blue-400">
            S'inscrire
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}