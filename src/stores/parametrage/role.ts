import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type Role} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

interface Role {
  id?: number;
  code: string;
  libelle: string;
}

export const useRole = defineStore("role",{
    
    state:()=>{
        return {
            stateRole: [] as Role[]
        }
    },
    getters: {
            getterRole: (state) => state.stateRole,
    },
    actions:{
        
        //Role de recupération des structures cadres logiques
        async getRole () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/role_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateRole = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des Roles.");
                    }
            },
        
        async AjouterRole (role: Role) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/role_store`, role, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getRole();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async modifierRole(role: Role){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/role_update/${role.id}`, role, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateRole.findIndex((t) => t.id === role.id);
                this.stateRole[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getRole();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerRole(id: number){

            try {
                await apiUrl.delete(`/role_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateRole = this.stateRole.filter((item) => item.id !== id);
                this.getRole();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});