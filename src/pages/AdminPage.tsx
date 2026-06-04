import { MapPin, Calendar, Edit3, Camera } from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react"; 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import OnePost from "@/components/OnePost";
import { userService } from "@/services/userService";
import { postService } from "@/services/postServices";
import type { ReadUser } from "../types/user";
import type { PostData } from "@/types/post";

// Fonction pour afficher un rôle lisible
function getLabelRole(role: string): string {
  const map: Record<string, string> = {
    STUDENT: "Étudiant",
    CLUB_LEADER: "Chef de club",
    DELEGATE: "Délégué",
    MODERATOR: "Modérateur",
    ADMIN: "Administrateur",
    SPECTATOR: "Spectateur",
    EXECUTIVE_MEMBER: "Membre exécutif",
  };
  return map[role] ?? role;
}

export default function AdminPage() {
  const [profile, setProfile] = useState<ReadUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Remplacement du mock par l'état réel des posts
  const [adminPosts, setAdminPosts] = useState<PostData[]>([]);

  // Gestion des aperçus image, avatar, bannières et erreur de chargement
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Appel API pour récupérer le profil de l'admin et ses posts
  useEffect(() => {
    userService.getCurrentUser()
      .then(async (data: ReadUser) => {
        setProfile(data);
        setAvatarPreview(data.avatar_url || "");
        
        // Récupération des posts réels et filtrage local pour cet utilisateur
        try {
          const feed = await postService.getFeed();
          const userPosts = feed.items.filter(p => p.author_id === data.id);
          setAdminPosts(userPosts);
        } catch (postErr) {
          console.error("Erreur lors de la récupération des posts", postErr);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Mémorisation des couleurs
  const userColorHex = useMemo(() => {
    if (!profile) return '#3b82f6';
    const colors = ['#3b82f6', '#a855f7', '#ef4444', '#6366f1', '#f97316', '#22c55e', '#8b5cf6'];
    const hash = profile.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  }, [profile?.username]);

  // Gradient style GlassIcons pour l'avatar du profil 
  const colorGradient = useMemo(() => {
    const gradientMap: Record<string, string> = {
      '#3b82f6': 'linear-gradient(hsl(223,90%,50%),hsl(208,90%,50%))',
      '#a855f7': 'linear-gradient(hsl(283,90%,50%),hsl(268,90%,50%))',
      '#ef4444': 'linear-gradient(hsl(3,90%,50%),hsl(348,90%,50%))',
      '#6366f1': 'linear-gradient(hsl(253,90%,50%),hsl(238,90%,50%))',
      '#f97316': 'linear-gradient(hsl(43,90%,50%),hsl(28,90%,50%))',
      '#22c55e': 'linear-gradient(hsl(123,90%,40%),hsl(108,90%,40%))',
      '#8b5cf6': 'linear-gradient(to bottom right,#9333ea,#7c3aed)',
    };
    return gradientMap[userColorHex] ?? `linear-gradient(135deg, ${userColorHex}, ${userColorHex}cc)`;
  }, [userColorHex]);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleBannerClick = () => bannerInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerError(false); 
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto p-10 text-center">Chargement du profil admin...</div>;
  if (error) return <div className="max-w-3xl mx-auto p-10 text-red-500">Erreur : {error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto bg-background min-h-screen border-x border-border font-sans pb-10">
      {/* Bannière Encapsulée */}
      <div className="relative w-full group/banner">
        <div
          className="relative h-44 w-full overflow-hidden cursor-pointer"
          onClick={handleBannerClick}
          title="Modifier la photo de couverture"
        >
          {bannerPreview && !bannerError ? (
            <img
              src={bannerPreview}
              alt="Bannière"
              className="w-full h-full object-cover transition-all duration-300 group-hover/banner:brightness-75"
              onError={() => setBannerError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-violet-200 to-fuchsia-100 transition-all duration-300 group-hover/banner:brightness-75" />
          )}

          <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover/banner:opacity-100 transition-opacity">
            <div className="flex items-center gap-1.5 bg-black/50 text-white text-[11px] font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Camera className="w-3.5 h-3.5" />
              <span>Modifier la couverture</span>
            </div>
          </div>
        </div>
        
        <input
          type="file"
          ref={bannerInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleBannerChange}
        />

        {/* Avatar Section */}
        <div className="absolute -bottom-14 left-6">
          <div className="relative group" style={{ width: '7rem', height: '7rem' }}>
            <Dialog>
              <DialogTrigger asChild>
                <div className="w-full h-full cursor-pointer relative" title="Voir l'avatar">
                  <span
                    className="absolute inset-0 block rounded-[1.25em] transition-all duration-300 group-hover:[transform:translate3d(-0.1em,-0.1em,0.1em)]"
                    style={{
                      background: avatarPreview ? 'transparent' : colorGradient,
                      boxShadow: '0 0.2em 0.5em rgba(0,0,0,0.15)'
                    }}
                  />
                  <span
                    className="absolute inset-0 bg-white/20 rounded-[1.25em] flex backdrop-blur-[4px] border border-white/40 overflow-hidden transition-all duration-300 group-hover:[transform:translate3d(0.1em,0.1em,0.5em)]"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)' }}
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="m-auto text-4xl font-bold text-white">
                        {profile.username.substring(0, 1).toUpperCase()}
                      </span>
                    )}
                  </span>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none flex justify-center items-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar en grand" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
                ) : (
                  <div
                    className="w-80 h-80 flex items-center justify-center text-7xl font-bold text-white rounded-[2em] shadow-2xl"
                    style={{ background: colorGradient }}
                  >
                    {profile.username.substring(0, 1).toUpperCase()}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-2 -right-2 bg-muted hover:bg-muted/80 text-foreground w-8 h-8 rounded-full flex items-center justify-center border-2 border-background shadow-md transition-transform hover:scale-105"
              title="Modifier l'avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Profil Info */}
      <div className="mt-16 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl font-extrabold tracking-tight">{profile.username}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-neutral-text-muted">
                {profile.classe?.name ?? "Classe non renseignée"}
              </span>
              <Badge className="bg-yellow-600 hover:bg-yellow-600 text-[10px] h-5 rounded-full px-2 border-none">
                {getLabelRole(profile.role)}
              </Badge>
              {profile.executive_role && (
                <Badge className="bg-violet-600 hover:bg-violet-600 text-[10px] h-5 rounded-full px-2 border-none">
                  {profile.executive_role.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[11px] text-blue-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50">
              <Edit3 size={14} className="mr-1.5" /> Modifier
            </Button>
          </div>
        </div>

        {/* Bio et Données */}
        <div className="mt-6 text-left space-y-3">
          <p className="text-sm text-neutral-text leading-relaxed max-w-2xl">
            {profile.bio ?? "Aucune bio pour l'instant."}
          </p>
          <div className="flex gap-5 text-[11px] text-neutral-text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-primary/60" /> Togo
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-primary/60" /> Inscrit en {new Date(profile.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Tableau des Posts */}
      <Tabs defaultValue="publications" className="w-full mt-8">
        <TabsList className="w-full justify-start rounded-none bg-transparent h-11 border-y border-border px-6 gap-8">
          <TabsTrigger
            value="publications"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none h-full shadow-none font-bold text-xs px-0"
          >
            Publications ({adminPosts.length})
          </TabsTrigger>
          <TabsTrigger value="clubs" className="rounded-none h-full font-bold text-xs text-neutral-text-muted hover:text-neutral-text bg-transparent shadow-none px-0">
            Clubs
          </TabsTrigger>
          <TabsTrigger value="evenements" className="rounded-none h-full font-bold text-xs text-neutral-text-muted hover:text-neutral-text bg-transparent shadow-none px-0">
            Événements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="publications" className="bg-muted/5 m-0 p-4 md:p-6 min-h-[400px]">
          <div className="flex flex-col gap-6">
            {adminPosts.length > 0 ? (
              adminPosts.map((post) => (
                <OnePost key={post.id} post={post} avatarUrl={avatarPreview || undefined} />
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-muted rounded-xl">
                <p className="text-sm text-neutral-text-muted italic">Aucun post publié pour le moment.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}