import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Connexion } from "../components/ui/Auth/Connexion";
import { Inscription } from "../components/ui/Auth/Inscription";

/**
 * le composant ci permet de centraliser l'état d'affichage de la page d'auth sans changer de page.
 */
type AuthMode = "login" | "register";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="flex flex-row bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="hidden md:block w-1/2">
        <img
          src="src/assets/ImageAuth.jpg"
          alt="Image d'authentification"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Zone de contenu à droite */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        {/* AnimatePresence gère les animations d'entrée/sortie
            lors du changement de composant */}
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {/* Le parent ici va  garder le contrôle du switch de vue */}
              <Connexion onSwitch={() => setMode("register")} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <Inscription onSwitch={() => setMode("login")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}