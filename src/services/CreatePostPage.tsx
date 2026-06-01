import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Image as ImageIcon, 
  X, 
  Smile, 
  MapPin, 
  Calendar, 
  Users, 
  Loader2, 
  Send,
  ArrowLeft,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { postService } from "@/services/postServices";
import type { ReadUser } from "../types/user";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<ReadUser | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [postType, setPostType] = useState<"GENERAL" | "CLUB" | "EVENT">("GENERAL");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Chargement de l'utilisateur actuel
  useEffect(() => {
    userService.getCurrentUser()
      .then(setUser)
      .catch(() => toast.error("Impossible de charger votre profil"));
  }, []);

  // Nettoyage des URLs de prévisualisation pour éviter les fuites de mémoire
  useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [selectedImages]);

  // Ajuster la hauteur du textarea automatiquement
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 4) {
      toast.error("Vous ne pouvez pas ajouter plus de 4 images.");
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && selectedImages.length === 0) {
      toast.error("Votre publication ne peut pas être vide.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedImages.length === 0) {
        // CAS 1 : Post simple sans média
        await postService.createSimplePost({
          content,
          postType: postType,
        });
        toast.success("Publication partagée avec succès !");
        navigate("/");
      } else {
        // CAS 2 : Post avec médias
        // 1. Obtenir l'intention d'upload
        const intentRes = await postService.getUploadIntent({
          content,
          postType: postType,
          mediasCount: selectedImages.length
        });

        const { intentId, uploadUrls } = intentRes;

        // 2. Upload physique des fichiers vers les URLs fournies (S3/Cloudinary/etc)
        const uploadPromises = selectedImages.map((img, index) => {
          return fetch(uploadUrls[index], {
            method: "PUT", // Généralement PUT pour les URLs signées S3
            body: img.file,
            headers: { "Content-Type": img.file.type }
          }).then(res => {
            if (!res.ok) throw new Error(`Échec de l'upload de l'image ${index + 1}`);
            return res;
          });
        });

        await Promise.all(uploadPromises);

        // 3. Confirmer au backend que l'upload est fini pour créer le post final
        await postService.completeMediaPost(intentId);
        toast.success("Publication avec médias réussie !");
        navigate("/");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-background min-h-screen border-x border-border font-sans">
      {/* Header mobile/desktop */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-neutral-text">Créer un post</h1>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || (!content.trim() && selectedImages.length === 0)}
          className="bg-primary-default hover:bg-primary-default/90 text-white rounded-full px-6 font-bold"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publier"}
        </Button>
      </div>

      <div className="p-4 flex gap-4">
        {/* Avatar */}
        <Avatar className="w-12 h-12 shrink-0">
          <AvatarImage src={user.avatar_url || ""} />
          <AvatarFallback className="bg-primary-default text-white font-bold">
            {user.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          {/* Sélecteur de type de post */}
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setPostType("GENERAL")}
              className={`text-[11px] px-3 py-1 rounded-full border transition-colors font-medium ${postType === "GENERAL" ? "bg-primary-default/10 border-primary-default text-primary-default" : "border-border text-neutral-text-muted hover:bg-muted"}`}
            >
              Tout le monde
            </button>
            <button 
              onClick={() => setPostType("CLUB")}
              className={`text-[11px] px-3 py-1 rounded-full border transition-colors font-medium ${postType === "CLUB" ? "bg-secondary-default/10 border-secondary-default text-secondary-default" : "border-border text-neutral-text-muted hover:bg-muted"}`}
            >
              <Users className="w-3 h-3 inline mr-1" /> Club
            </button>
            <button 
              onClick={() => setPostType("EVENT")}
              className={`text-[11px] px-3 py-1 rounded-full border transition-colors font-medium ${postType === "EVENT" ? "bg-accent-foreground/10 border-accent-foreground text-accent-foreground" : "border-border text-neutral-text-muted hover:bg-muted"}`}
            >
              <Calendar className="w-3 h-3 inline mr-1" /> Événement
            </button>
          </div>

          {/* Zone de texte */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
            placeholder="Quoi de neuf à l'IAI ?"
            className="w-full bg-transparent border-none focus:ring-0 text-lg text-neutral-text placeholder:text-neutral-text-muted resize-none min-h-[120px] outline-none"
          />

          {/* Prévisualisation des images */}
          {selectedImages.length > 0 && (
            <div className={`grid gap-2 ${selectedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {selectedImages.map((img, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-muted">
                  <img src={img.preview} alt="Prévisualisation" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Separator className="bg-border" />

          {/* Barre d'outils */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-primary-default hover:bg-primary-default/10 rounded-full transition-colors"
                title="Ajouter des images"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-primary-default hover:bg-primary-default/10 rounded-full transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2 text-primary-default hover:bg-primary-default/10 rounded-full transition-colors">
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            {/* Indicateur de caractères */}
            <div className="flex items-center gap-4">
              <span className={`text-xs font-medium ${content.length >= 280 ? 'text-danger' : content.length > 250 ? 'text-accent-foreground' : 'text-neutral-text-muted'}`}>
                {content.length}/280
              </span>
              <div className="h-8 w-[1px] bg-border" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-primary-default text-xs font-bold hover:underline"
              >
                <Plus className="w-4 h-4" />
                Média
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Input de fichier caché */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />

      {/* Section d'aide/conseils (optionnel) */}
      <div className="mt-8 px-8 py-6 bg-muted/30 mx-4 rounded-2xl border border-dashed border-border">
        <h3 className="text-sm font-bold text-neutral-text mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary-default" /> Quelques conseils
        </h3>
        <ul className="text-xs text-neutral-text-muted space-y-2 leading-relaxed">
          <li>• Utilisez des images de haute qualité pour vos événements.</li>
          <li>• Mentionnez votre club si la publication concerne une activité spécifique.</li>
          <li>• Respectez la charte de bonne conduite de l'IAI-TOGO.</li>
        </ul>
      </div>
    </div>
  );
}