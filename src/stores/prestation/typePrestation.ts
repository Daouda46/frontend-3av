import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type TypePrestation} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

 interface TypePrestation {
  id?: number;
  montant?: number;
  code: string;
  libelle: string;
}

export const useTypePrestation = defineStore("typePrestation",{
    
    state:()=>{
        return {
            stateTypePrestation: [] as TypePrestation[]
        }
    },
    getters: {
            getterTypePrestation: (state) => state.stateTypePrestation,
    },
    actions:{
        
        //TypePrestation de recupération des structures cadres logiques
        async getTypePrestation () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/type_prestation_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateTypePrestation = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des TypePrestations.");
                    }
            },
        
        async AjouterTypePrestation (typePrestation: TypePrestation) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/type_prestation_store`, typePrestation, { headers: authHeader() });
                // on recupère le getter avec les datas ajoutées
                this.getTypePrestation();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
        async modifierTypePrestation(typePrestation: TypePrestation){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/type_prestation_update/${typePrestation.id}`, typePrestation, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateTypePrestation.findIndex((t) => t.id === typePrestation.id);
                this.stateTypePrestation[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getTypePrestation();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerTypePrestation(id: number){

            try {
                await apiUrl.delete(`/type_prestation_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateTypePrestation = this.stateTypePrestation.filter((item) => item.id !== id);
                this.getTypePrestation();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});