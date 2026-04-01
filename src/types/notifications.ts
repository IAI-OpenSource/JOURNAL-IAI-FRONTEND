export type NotifType = "like" | "comment" | "event";

// si un champ change cote back, on update juste ici et dans adaptNotif()
export interface NotificationDTO {
  id: number;
  type: NotifType;
  auteur: string;
  avatarUrl?: string;
  message: string;
  date: string; // le back formate ou on formate ici
  lue: boolean;
}