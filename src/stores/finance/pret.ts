import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type Pret,type SuiviPret} from '../../shared/interfaces/pret.interface'
import { authHeader } from "@/config/authHeader";

 interface Pret {
  id?: number;
  montant?: number;
  encours?: number;
  trimestre?: number;
  position?: number;
  positionPret?: number;
  montant_total?: number;
  statut?: number;
  payer?: string;
  mode_paiement?: string;
  nom_prenom?: string;
  date_emprunt?: Date;
  date_tresorie?: string;
  contact?: string;
  nom?: string;
  prenom?: string;
}
interface SuiviPret {
  id?: number;
  statut: number;
  nom_prenom: string;
  position: number; 
  encours: number; 
  date_adherent: Date;
  date_president: Date;
  date_tresorie: Date;
}
interface Remboursement {
//   id?: number;
  user_id?: number;
  pret_id?: number;
  etape_remboursement?: string;
   date_emprunt?: Date();
  contact?: string;
  nom?: string;
mode_paiement?: string;
  prenom?: string;
  montant?: number; 
  statut?: number; 
  montant_rembourser?: number; 
  trimestre?: number; 
  montant_total?: number; 
  montant_a_rembourser?: number; 
  
}
export const usePret = defineStore("pret",{
    
    state:()=>{
        return {
            statePret: [] as Pret[],
            stateRemboursement: [] as Remboursement[],
            stateSuiviPret: [] as SuiviPret[],
        }
    },
    getters: {
            getterRemboursement: (state) => state.stateRemboursement,
            getterPret: (state) => state.statePret,
            getterSuiviPret: (state) => state.stateSuiviPret,
    },
    actions:{
        
        async getListeRemboursement () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/listeRemboursement`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateRemboursement = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des données.");
                    }
            },
        //fonction de recupération des structures cadres logiques
        async getSuiviPret () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/suivi_pret`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateSuiviPret = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des données.");
                    }
            },
        //fonction de recupération des structures cadres logiques
        async getPret () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/pret_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.statePret = response.data.pret || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                // toast.error("Une erreur est survenue lors de la récupération des données.");
                    }
            },
        
        async AjouterRemboursement (rembourse: Remboursement) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/rembouserPret`, rembourse, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getPret();
                this.getListeRemboursement()
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async AjouterPret (pret: Pret) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/pret_store`, pret, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getPret();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async visePret(pret: Pret){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/pret_vise/${pret.id}`, pret, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.statePret.findIndex((t) => t.id === pret.id);
                this.statePret[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getPret();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Visa effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async visePretTresorie(pret: Pret){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/pret_vise_tresorie/${pret.id}`, pret, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.statePret.findIndex((t) => t.id === pret.id);
                this.statePret[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getPret();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Visa effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async paiementPret(pret: Pret){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/paiement_pret/${pret.id}`, pret, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.statePret.findIndex((t) => t.id === pret.id);
                this.statePret[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getPret();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Visa effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async activationPret(pret: Pret){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/activation_pret/${pret.id}`, pret, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.statePret.findIndex((t) => t.id === pret.id);
                this.statePret[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getPret();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Visa effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerPret(id: number){

            try {
                await apiUrl.delete(`/pret_delete/${id}`,{
                    headers: authHeader()
                });
                this.statePret = this.statePret.filter((item) => item.id !== id);
                this.getPret();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});