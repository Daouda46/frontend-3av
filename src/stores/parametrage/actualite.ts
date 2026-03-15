import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
import { type ListeActualite} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

 interface Actualite {
  id?: number;
  title: string;
  description: string;
  statut: number;
}

export const useActualite = defineStore("actualite",{
    
    state:()=>{
        return {
            stateActualite: [] as Actualite[],
            stateListeActualite: [] as ListeActualite[]
        }
    },
    getters: {
            getterActualite: (state) => state.stateActualite,
            getterListeActualite: (state) => state.stateListeActualite,
    },
    actions:{
        
        //Actualite de recupération des structures cadres logiques
        async getActualite () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/actualite_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateActualite = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des actualites.");
                    }
            },
        //Actualite de recupération des structures cadres logiques
        async getListeActualite () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/liste_actualites`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateListeActualite = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des actualites.");
                    }
            },
        
        async AjouterActualite (actualite: Actualite) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/actualite_store`, actualite, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getActualite();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async modifierActualite(actualite: Actualite){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/actualite_update/${actualite.id}`, actualite, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateActualite.findIndex((t) => t.id === actualite.id);
                this.stateActualite[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getActualite();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerActualite(id: number){

            try {
                await apiUrl.delete(`/actualite_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateActualite = this.stateActualite.filter((item) => item.id !== id);
                this.getActualite();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});