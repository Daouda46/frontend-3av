import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type Emploi} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

interface Emploi {
  id?: number;
  code: string;
  libelle: string;
}
export const useEmploi = defineStore("emploi",{
    
    state:()=>{
        return {
            stateEmploi: [] as Emploi[]
        }
    },
    getters: {
            getterEmploi: (state) => state.stateEmploi,
    },
    actions:{
        
        //Emploi de recupération des structures cadres logiques
        async getEmploi () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/emploi_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateEmploi = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des Emplois.");
                    }
            },
        
        async AjouterEmploi (emploi: Emploi) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/emploi_store`, emploi, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getEmploi();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async modifierEmploi(emploi: Emploi){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/emploi_update/${emploi.id}`, emploi, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateEmploi.findIndex((t) => t.id === emploi.id);
                this.stateEmploi[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getEmploi();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerEmploi(id: number){

            try {
                await apiUrl.delete(`/emploi_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateEmploi = this.stateEmploi.filter((item) => item.id !== id);
                this.getEmploi();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});