import { Button } from "@/components/ui/button"
import { IoMdPerson } from "react-icons/io";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Connexion() {
  return (
    <Card className="w-full max-w-sm ">
      <CardHeader>
        <CardTitle><IoMdPerson /></CardTitle>
        {/* <CardDescription>
          Enter your email below to login to your account
        </CardDescription> */}
        <CardTitle>
          <Button variant="link">Se connecter</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
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
              <Input id="password" type="password" placeholder="Entrez votre mots de passe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Code D'identification </Label>
              <Input
                id="code"
                type="password"
                placeholder="Saisir le code de d'identification"
                required
              />
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
  )
}
