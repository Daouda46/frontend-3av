 interface Pret {
  id?: number;
  montant?: number;
  encours?: number;
  trimestre?: number;
  montant_total?: number;
  montant?: number;
  statut?: number;
  mode_paiement?: string;
  nom_prenom?: string;
  date_emprunt?: Date;
  contact?: string;
  nom?: string;
  prenom?: string;
}
export interface VisaPret {
  id?: number;
  statut: string;
  mode_paiement?: string;
}
export interface SuiviPret {
  id?: number;
  statut: string;
  nom_prenom: string;
  position: number; 
  encours: number; 
  date_adherent: Date;
  date_president: Date;
  date_tresorie: Date;
}
export { Pret };