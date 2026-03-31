export type RoleClub = "president" | "vice_president" | "chef_de_club" | "membre" | null;

// un membre du comité avec son avatar vient de GET /clubs/:id/membres/roles, on va ajuster en fonction de l'endpoint precis 
export interface MembreComiteDTO {
  id: number;
  username: string;
  avatarUrl?: string;
  role: Exclude<RoleClub, null>;
}

export interface ClubDTO {
  id: number;
  nom: string;
  description: string;
  nbMembres: number;     
  avatarUrl?: string;
  suivi: boolean;        
  role: RoleClub;        
}