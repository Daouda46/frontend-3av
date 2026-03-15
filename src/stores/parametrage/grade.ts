import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type Grade} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

interface Grade {
  id?: number;
  code: string;
  libelle: string;
}
export const useGrade = defineStore("grade",{
    
    state:()=>{
        return {
            stateGrade: [] as Grade[]
        }
    },
    getters: {
            getterGrade: (state) => state.stateGrade,
    },
    actions:{
        
        //Grade de recupération des structures cadres logiques
        async getGrade () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/grade_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateGrade = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des grades.");
                    }
            },
        
        async AjouterGrade (grade: Grade) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/grade_store`, grade, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getGrade();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async modifierGrade(grade: Grade){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/grade_update/${grade.id}`, grade, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateGrade.findIndex((t) => t.id === grade.id);
                this.stateGrade[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getGrade();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerGrade(id: number){

            try {
                await apiUrl.delete(`/grade_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateGrade = this.stateGrade.filter((item) => item.id !== id);
                this.getGrade();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});