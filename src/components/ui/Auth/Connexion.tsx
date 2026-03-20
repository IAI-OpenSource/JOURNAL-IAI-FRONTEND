import { Button } from "@/components/ui/button"
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";

export function Connexion() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);
  return (
    <div className="flex flex-row bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto ">
      <div className="hidden md:block w-1/2">
        <img 
        src="src/assets/ImageAuth.jpg"
         alt="Image de connexion"
         className="h-full w-full object-cover" />
      </div>
    <Card className="w-full max-w-sm border-none shadow-none ">
      <CardHeader>
        <CardTitle className="flex justify-center w-full"><IoPersonOutline size={80} /></CardTitle>
        {/* <CardDescription>
          Enter your email below to login to your account
        </CardDescription> */}
        <CardTitle className="text-3xl">
          {/* <Button variant="link">Se connecter</Button> */}
          <h1>Se connecter </h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2 ">
              <Label htmlFor="email">Email || Nom d'utilisateur </Label>
              <Input
                id="email"
                type="email"
                placeholder="iaitogo@gmail.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mot de passe </Label>
              </div>
              <div className="relative">
              <Input  className="pr-10"
              id="password"
               type={showPassword? "text": "password"}
               placeholder="Entrez votre mots de passe" 
               required
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                type="button" 
                onClick={()=> setShowPassword(!showPassword)}>
                  {showPassword? <IoMdEyeOff size={20}/> : <IoMdEye size={20}/>}

                </button>
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Code D'identification </Label>
              <div className="relative">
              <Input className="pr-10"
                id="code"
                type={showPassword? "text": "password" }
                placeholder="Saisir le code de d'identification"
                required
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              type="button"
              onClick={()=> {setShowCode(!showCode)}}>
                {showCode? <IoMdEyeOff size={20}/> : <IoMdEye size={20}/>}


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
        <p> Pas de compte 
            <a href="/Inscription" className="text-blue-400"> S'inscrire</a>
        </p>
      </CardFooter>
    </Card>
    </div>
  )
}
