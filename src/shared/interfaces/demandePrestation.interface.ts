interface DemandePrestation {
  id: number;
  type_prestation_id: string;
  fichier: File|string;
  statut: number;
}
export type {DemandePrestation};