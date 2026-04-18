import { useState } from "react";
import { Users, CheckCircle2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { memberService } from "@/services/memberServices"; 
import type { ClubDTO } from "@/types/club";

interface ClubCardProps extends ClubDTO {}

export function ClubCard({ 
  id, 
  nom, 
  description, 
  nbMembres, 
  avatarUrl, 
  suivi, 
  role 
}: ClubCardProps) {
  const queryClient = useQueryClient();
  const [isFollowed, setIsFollowed] = useState(suivi);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const currentUserId = "votre-auth-user-id"; 
      
      if (isFollowed) {
        // Implémenter memberService.remove si besoin
        return null; 
      } else {
        return memberService.addMember(id, currentUserId, "SIMPLE_MEMBER");
      }
    },
    onSuccess: () => {
      setIsFollowed(!isFollowed);
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      queryClient.invalidateQueries({ queryKey: ["members", id] });
    },
    onError: (error) => {
      console.error("Erreur action membre:", error);
    }
  });

  return (
    <Card className="overflow-hidden border-zinc-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12 rounded-lg border border-zinc-100 shadow-sm">
              <AvatarImage src={avatarUrl || ""} alt={nom} className="object-cover" />
              <AvatarFallback className="rounded-lg bg-zinc-50 text-zinc-400 font-bold">
                {nom.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-zinc-900 leading-tight">{nom}</h3>
              <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mt-1">
                <Users size={12} />
                <span>{nbMembres} membres</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => mutate()}
            disabled={isPending}
            variant={isFollowed ? "outline" : "default"} 
            size="sm" 
            className={`h-7 px-3 text-[10px] font-semibold transition-all ${
              isFollowed 
                ? "border-zinc-200 text-zinc-600 bg-zinc-50 hover:bg-zinc-100" 
                : "bg-zinc-950 text-white hover:bg-zinc-800"
            }`}
          >
            {isPending ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <>
                {isFollowed && <CheckCircle2 size={10} className="mr-1" />}
                {isFollowed ? "Suivi" : "Suivre"}
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed h-[32px]">
          {description || "Passion, innovation et excellence à l'IAI-Togo."}
        </p>

        <div className="pt-3 border-t border-zinc-50">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">Comité</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="h-6 gap-1.5 px-2 font-medium text-[10px] bg-zinc-50 text-zinc-600 border-none">
              <Avatar className="h-4 w-4">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="text-[6px]">{role?.substring(0,1) || 'P'}</AvatarFallback>
              </Avatar>
              {/* On affiche le rôle s'il existe, sinon "Membre" par défaut */}
              {role ? role.replace('_', ' ') : "Président"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}