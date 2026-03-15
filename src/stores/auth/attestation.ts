import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type Grade} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

interface Attestation {
  id?: number
  montant?: number
  personnel_id: string
  redevance: string
  nom?: string
  date_demande?: Date
  prenom?: string
  matricule?: string
  telephone?: string
  fonction?: string
  emploi?: string
}
export const useAttestation = defineStore("Attestation",{
    
    state:()=>{
        return {
            stateAttestation: [] as Attestation[]
        }
    },
    getters: {
            getterAttestation: (state) => state.stateAttestation,
    },
    actions:{
        
        //Grade de recupération des Attestation
        async getAttestation() {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/attestation_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateAttestation = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des Attestations.");
                    }
            },
        
        async AjouterAttestation(attestation: Attestation) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/attestation_store`, attestation, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getAttestation();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async modifierAttestation(attestation: Attestation){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/attestation_update/${attestation.id}`, attestation, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateAttestation.findIndex((t) => t.id === attestation.id);
                this.stateAttestation[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getAttestation();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerAttestation(id: number){

            try {
                await apiUrl.delete(`/attestation_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateAttestation = this.stateAttestation.filter((item) => item.id !== id);
                this.getAttestation()
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});