import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type Role} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

interface StructureController {
  id?: number;
  code: string;
  libelle: string;
}

export const useStructureController = defineStore("StructureController",{
    
    state:()=>{
        return {
            stateStructureController: [] as StructureController[]
        }
    },
    getters: {
            getterStructureController: (state) => state.stateStructureController,
    },
    actions:{
        
        //Role de recupération des structures cadres logiques
        async getStructureController () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/structure_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateStructureController = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des Structures.");
                    }
            },
        
        async AjouterStructureController (structure: StructureController) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/structure_store`, structure, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getStructureController();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async modifierStructure(structure: StructureController){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/structure_update/${structure.id}`, structure, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateStructureController.findIndex((t) => t.id === structure.id);
                this.stateStructureController[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getStructureController();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerStructure(id: number){

            try {
                await apiUrl.delete(`/structure_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateStructureController = this.stateStructureController.filter((item) => item.id !== id);
                this.getStructureController();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});