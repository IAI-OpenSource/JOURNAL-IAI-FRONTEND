import { MapPin, Calendar, Edit3, Camera } from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { userService } from "@/services/userService";
import type { ReadUser } from "@/types/user";

// label lisible pour le role back  
function getLabelRole(role: ReadUser["role"]): string {
  const map: Record<ReadUser["role"], string> = {
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

export default function UserPage() {
  const [profile,       setProfile]       = useState<ReadUser | null>(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [erreur,        setErreur]        = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerError,   setBannerError]   = useState(false);

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // chargement du profil GTET /user/user-profil-data
  useEffect(() => {
    userService.getCurrentUser()
      .then(data => {
        setProfile(data);
        setAvatarPreview(data.avatar_url ?? null);
      })
      .catch(e => setErreur(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const userColorHex = useMemo(() => {
    const colors = ['#3b82f6', '#a855f7', '#ef4444', '#6366f1', '#f97316', '#22c55e', '#8b5cf6'];
    const hash = (profile?.username ?? "").split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }, [profile?.username]);

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
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    // upload vers storage puis updateCurrentUser({ avatar_url: uploadedUrl })
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerError(false);
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto bg-background min-h-screen border-x border-border pb-10">
        <Skeleton className="h-44 w-full" />
        <div className="mt-16 px-6 space-y-3">
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (erreur || !profile) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-screen">
        <p className="text-sm text-muted-foreground">{erreur ?? "Profil introuvable"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-background min-h-screen border-x border-border font-sans pb-10">

      {/* banniere */}
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

        <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerChange} />

        <div className="absolute -bottom-14 left-6">
          <div className="relative group" style={{ width: '7rem', height: '7rem' }}>
            <Dialog>
              <DialogTrigger asChild>
                <div className="w-full h-full cursor-pointer relative" title="Voir l'avatar">
                  <span
                    className="absolute inset-0 block rounded-[1.25em] transition-all duration-300 group-hover:[transform:translate3d(-0.1em,-0.1em,0.1em)]"
                    style={{ background: avatarPreview ? 'transparent' : colorGradient, boxShadow: '0 0.2em 0.5em rgba(0,0,0,0.15)' }}
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
                  <div className="w-80 h-80 flex items-center justify-center text-7xl font-bold text-white rounded-[2em] shadow-2xl" style={{ background: colorGradient }}>
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
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
      </div>

      {/* infos profil */}
      <div className="mt-16 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl font-extrabold tracking-tight">{profile.username}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground">
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

        <div className="mt-6 text-left space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {profile.bio ?? "Aucune bio pour l'instant."}
          </p>
          <div className="flex gap-5 text-[11px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-primary/60" />
              Togo
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-primary/60" />
              Inscrit en {new Date(profile.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}