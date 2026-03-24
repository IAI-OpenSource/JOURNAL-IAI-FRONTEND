/*import { Connexion } from "./components/ui/Auth/Connexion"
export default function TestDesign() {
  return (
    <>
    
    <Connexion/>
    </>
    // <div className="p-8 space-y-12">
    //   <section className="space-y-4">
    //     <h2 className="text-neutral-text-muted border-b pb-2">Typographie (Poppins)</h2>
    //     <h1 className="text-hero font-extrabold text-neutral-text">Ceci est un Hero</h1>
    //     <h2 className="text-title font-bold text-primary-default">Titre de section</h2>
    //     <h3 className="text-subtitle font-semibold text-secondary-default">Sous-titre de carte</h3>
    //     <p className="text-body text-neutral-text">Texte standard de paragraphe pour le journal.</p>
    //     <p className="text-caption text-neutral-text-muted">Légende ou texte secondaire.</p>
    //   </section>
    //   <section className="space-y-4">
    //     <h2 className="text-neutral-text-muted border-b pb-2">Couleurs et États</h2>
    //     <div className="flex gap-4 flex-wrap">
    //       <button className="bg-primary-default text-primary-foreground px-6 py-2 rounded-md">
    //         Primary
    //       </button>
    //       <button className="bg-secondary-default text-secondary-foreground px-6 py-2 rounded-md">
    //         Secondary
    //       </button>
    //       <button className="bg-success text-success-foreground px-4 py-2 rounded-md">
            
    //         Succès
    //       </button>
    //       <button className="bg-danger text-danger-foreground px-4 py-2 rounded-md">
    //         Erreur / Danger
    //       </button>
    //       <button className="bg-warning text-warning-foreground px-4 py-2 rounded-md text-black">
    //         Attention
    //       </button>
    //     </div>
    //   </section>
    //   <section className="space-y-4">
    //     <h2 className="text-neutral-text-muted border-b pb-2">Variantes de Vert</h2>
    //     <div className="flex gap-4">
    //       <div className="p-4 bg-primary-light text-primary-dark font-bold rounded-lg">Light</div>
    //       <div className="p-4 bg-primary-default text-white font-bold rounded-lg">Default</div>
    //       <div className="p-4 bg-primary-dark text-white font-bold rounded-lg">Dark</div>
    //     </div>
    //   </section>
    // </div>
  )
}*/

import { AuthPage } from "@/components/ui/Auth/AuthPage";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <AuthPage />
    </div>
  );
}