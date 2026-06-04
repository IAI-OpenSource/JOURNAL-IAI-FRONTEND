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
  ArrowLeft,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { postService } from "@/services/postServices";
import type { ReadUser } from "../types/user";
import { clubService } from "@/services/clubService";
import { eventService } from "@/services/eventServices";
import type { ClubResponse } from "../types/club";
import type { EventData } from "../types/event";

type PostContextType = "GENERAL" | "CLUB" | "EVENT";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<ReadUser | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [postContext, setPostContext] = useState<PostContextType>("GENERAL");
  
  const [clubs, setClubs] = useState<ClubResponse[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  //utilisateur acteur
  useEffect(() => {
    userService.getCurrentUser()
      .then(setUser)
      .catch(() => toast.error("Impossible de charger votre profil"));
  }, []);

  useEffect(() => {
    if (user && !user.can_post) {
      toast.error("Vous n'avez pas l'autorisation de publier sur cette plateforme.");
      navigate("/");
    }
  }, [user, navigate]);

  
  useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [selectedImages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  //chargement club et event
  useEffect(() => {
  // On ne charge les contextes que si l'utilisateur est bien défini
    if (!user) return;

    const loadContexts = async () => {
      try {
        const [clubListRes, eventList] = await Promise.all([
          clubService.getAllClubs(1, 100),
          eventService.getEventsByStatus("PUBLISHED")
        ]);

        setClubs(clubListRes.clubs || []);
        setEvents(eventList);
      } catch (e) {
        toast.error("Impossible de charger les options.");
      }
    };

    loadContexts();
  }, [user]);

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
    if (!user) {
      toast.error("Vous devez être connecté pour publier.");
      return;
    }
    if (!user.can_post) {
      toast.error("Vous n'avez pas l'autorisation de publier sur cette plateforme.");
      return;
    }
    if (!content.trim() && selectedImages.length === 0) {
      toast.error("Votre publication ne peut pas être vide.");
      return;
    }

    setIsSubmitting(true);

    if (postContext === "CLUB") {
      if (user.role !== "CLUB_LEADER" && user.role !== "ADMIN") {
        toast.error("Seul un club leader ou un administrateur peut poster dans un club.");
        setIsSubmitting(false);
        return;
      }
      if (!selectedClubId) {
        toast.error("Veuillez sélectionner un club pour votre publication.");
        setIsSubmitting(false);
        return;
      }
    }
    if (postContext === "EVENT" && !selectedEventId) {
      toast.error("Veuillez sélectionner un événement pour votre publication.");
      setIsSubmitting(false);
      return;
    }

    const basePayload = {
      content: content.trim(),
      club_id: postContext === "CLUB" ? selectedClubId : null,
      event_id: postContext === "EVENT" ? selectedEventId : null,
      for_current_academic_year: true, 
      only_for_a_class: false
    };

    try {
      if (selectedImages.length === 0) {
        // Post textuel seulement
        await postService.createSimplePost(basePayload);
        toast.success("Publication partagée avec succès !");
        navigate("/");
      } else {
        // Post avec médias
        const filesPayload = selectedImages.map(img => ({
          filename: img.file.name,
          content_type: img.file.type,
          size: img.file.size
        }));

        const intentRes = await postService.getUploadIntent({
          ...basePayload,
          files: filesPayload
        });

        const { intent_id, files: backendFiles } = intentRes;

        // Upload physique 
        const uploadPromises = selectedImages.map((img, index) => {
          const targetUrl = backendFiles[index]?.upload_url;
          if (!targetUrl) throw new Error(`Pas d'URL d'upload générée pour l'image ${index + 1}`);

          return fetch(targetUrl, {
            method: "PUT",
            body: img.file,
            headers: { "Content-Type": img.file.type }
          }).then(res => {
            if (!res.ok) throw new Error(`Échec de l'upload de l'image ${index + 1}`);
            return res;
          });
        });

        await Promise.all(uploadPromises);

        
        await postService.completeMediaPost(intent_id);
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
      {/* Header */}
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
          {/* Sélecteur de Contexte */}
          <div className="flex gap-2 flex-wrap">
            <button 
              type="button"
              onClick={() => setPostContext("GENERAL")}
              className={`text-[11px] px-3 py-1 rounded-full border transition-colors font-medium ${postContext === "GENERAL" ? "bg-primary-default/10 border-primary-default text-primary-default" : "border-border text-neutral-text-muted hover:bg-muted"}`}
            >
              Tout le monde
            </button>
            {(user.role === "CLUB_LEADER" || user.role === "ADMIN") && (
              <button 
                type="button"
                onClick={() => setPostContext("CLUB")}
                className={`text-[11px] px-3 py-1 rounded-full border transition-colors font-medium ${postContext === "CLUB" ? "bg-secondary-default/10 border-secondary-default text-secondary-default" : "border-border text-neutral-text-muted hover:bg-muted"}`}
              >
                <Users className="w-3 h-3 inline mr-1" /> Club
              </button>
            )}
            <button 
              type="button"
              onClick={() => setPostContext("EVENT")}
              className={`text-[11px] px-3 py-1 rounded-full border transition-colors font-medium ${postContext === "EVENT" ? "bg-accent-foreground/10 border-accent-foreground text-accent-foreground" : "border-border text-neutral-text-muted hover:bg-muted"}`}
            >
              <Calendar className="w-3 h-3 inline mr-1" /> Événement
            </button>
          </div>

          {/* Listes de sélection dynamiques */}
          {postContext === "CLUB" && clubs.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="club-select" className="text-xs font-semibold text-neutral-text-muted">Publier dans le club :</label>
              <select
                id="club-select"
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                className="w-full max-w-xs bg-background border border-border rounded-md px-3 py-1.5 text-sm text-neutral-text outline-none focus:border-primary-default transition-colors"
              >
                <option value="">-- Choisir un club --</option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {postContext === "EVENT" && events.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="event-select" className="text-xs font-semibold text-neutral-text-muted">Associer à l'événement :</label>
              <select
                id="event-select"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full max-w-xs bg-background border border-border rounded-md px-3 py-1.5 text-sm text-neutral-text outline-none focus:border-primary-default transition-colors"
              >
                <option value="">-- Choisir un événement --</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Éditeur */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
            placeholder="Quoi de neuf à l'IAI ?"
            className="w-full bg-transparent border-none focus:ring-0 text-lg text-neutral-text placeholder:text-neutral-text-muted resize-none min-h-[120px] outline-none"
          />

          {/* Prévisualisations */}
          {selectedImages.length > 0 && (
            <div className={`grid gap-2 ${selectedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {selectedImages.map((img, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-muted">
                  <img src={img.preview} alt="Prévisualisation" className="w-full h-full object-cover" />
                  <button
                    type="button"
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

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-primary-default hover:bg-primary-default/10 rounded-full transition-colors"
                title="Ajouter des images"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-primary-default hover:bg-primary-default/10 rounded-full transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-primary-default hover:bg-primary-default/10 rounded-full transition-colors">
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-xs font-medium ${content.length >= 280 ? 'text-danger' : content.length > 250 ? 'text-accent-foreground' : 'text-neutral-text-muted'}`}>
                {content.length}/280
              </span>
              <div className="h-8 w-[1px] bg-border" />
              <button 
                type="button"
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

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        multiple
        onChange={handleImageChange}
      />
    </div>
  );
}