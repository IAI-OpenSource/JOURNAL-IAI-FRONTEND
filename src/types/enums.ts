export type UserRole =
  | "STUDENT"  
  | "CLUB_LEADER"
  | "DELEGATE"
  | "MODERATOR"
  | "ADMIN"
  | "SPECTATOR"
  | "EXECUTIVE_MEMBER";

export type ClubMembersType =
  | "LEAD"
  | "CO_LEAD"
  | "EXECUTIVE_MEMBER"
  | "SIMPLE_MEMBER";

export type SexeType = "F" | "M";

export type ExecutiveRoleType =
  | "DELEGUE_GENERAL"
  | "DELEGUE_GENERAL_ADJOINT"
  | "SECRETAIRE_GENERAL"
  | "SECRETAIRE_GENERAL_ADJOINT"
  | "CACA"
  | "VICE_CACA"
  | "TRESORIER_GENERAL"
  | "VICE_TRESORIER_GENERAL"
  | "CONSEILLER";

export type ClasseType = "TC1" | "TC2" | "GLSI_3" | "ASR_3" | "MTWI_3";

export type EventStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";