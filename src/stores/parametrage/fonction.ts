import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import {type Fonction } from "../../shared/interfaces/fonction.interface";
import { authHeader } from "@/config/authHeader";

interface Fonction {
  id?: number;
  code: string;
  libelle: string;
}

export const useFonction = defineStore("fonction",{
    
    state:()=>{
        return {
            stateFonction: [] as Fonction[]
        }
    },
    getters: {
            getterFonction: (state) => state.stateFonction,
    },
    actions:{
        
        //fonction de recupération des structures cadres logiques
        async getFonction () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/fonction_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateFonction = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des fonctions.");
                    }
            },
        
        async AjouterFonction (fonction: Fonction) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/fonction_store`, fonction, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getFonction();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async modifierFonction(fonction: Fonction){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/fonction_update/${fonction.id}`, fonction, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateFonction.findIndex((t) => t.id === fonction.id);
                this.stateFonction[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getFonction();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerFonction(id: number){

            try {
                await apiUrl.delete(`/fonction_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateFonction = this.stateFonction.filter((item) => item.id !== id);
                this.getFonction();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});