import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { Personnel} from '../../shared/interfaces'
import { authHeader } from "@/config/authHeader";
 interface Personnel {
   id?: number
   nom: string
   prenom: string
   email?: string
   matricule?: string
   libelle_service?: string
   section?: string
   telephone: string
   fonction_id?: number
   service_id?: number
   role_id?: number
   grade_id?: number
   emploi_id?: number
 }

export const usePersonnel = defineStore("Personnel",{
    
    state:()=>{
        return {
            statePersonnel: [] as Personnel[]
        }
    },
    getters: {
            getterPersonnel: (state) => state.statePersonnel,
    },
    actions:{
        
        //Personnel de recupération des structures cadres logiques
        async getPersonnel () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/personnel_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.statePersonnel = response.data.user || []; 
                console.log(this.statePersonnel)
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération du personnel.");
                    }
            },
        
        async AjouterPersonnel (personnel: FormData) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/register`, personnel, {
                  headers: {
                    ...authHeader(),
                    'Content-Type': 'multipart/form-data',
                  },
                })
                // on recupère le getter avec les datas ajoutées
                this.getPersonnel();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async modifierPersonnel(personnel: Personnel){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/personnel_update/${personnel.id}`, personnel, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.statePersonnel.findIndex((t) => t.id === personnel.id);
                this.statePersonnel[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getPersonnel();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerPersonnel(id: number){

            try {
                await apiUrl.delete(`/personnel_delete/${id}`,{
                    headers: authHeader()
                });
                this.statePersonnel = this.statePersonnel.filter((item) => item.id !== id);
                this.getPersonnel();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});