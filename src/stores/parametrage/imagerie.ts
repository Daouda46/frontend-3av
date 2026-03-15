import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type Imagerie} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

interface Imagerie {
  id?: number;
  actualite_id: string;
  fichier: File|string;
  statut: number;
}
export const useImagerie = defineStore("imagerie",{
    
    state:()=>{
        return {
            stateImagerie: [] as Imagerie[]
        }
    },
    getters: {
            getterImagerie: (state) => state.stateImagerie,
    },
    actions:{
        
        //Imagerie de recupération des structures cadres logiques
        async getImagerie () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/imagerie_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateImagerie = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des Imageries.");
                    }
            },
        
      async AjouterImagerie (imagerie: FormData) {
  try {
    await apiUrl.post(`/imagerie_store`, imagerie, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    await this.getImagerie();
    toast.success("Enregistrement effectué avec succès.");
  } catch (error) {
    console.error("Erreur survenue", error);
    toast.error("Une erreur est survenue lors de l'enregistrement.");
  }
},
 async modifierImagerie (imagerie: FormData) {
  try {
    await apiUrl.put(`/imagerie_update/${imagerie.id}`, imagerie, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    await this.getImagerie();
    toast.success("Enregistrement effectué avec succès.");
  } catch (error) {
    console.error("Erreur survenue", error);
    toast.error("Une erreur est survenue lors de l'enregistrement.");
  }
},
        async modifierImagerie4(imagerie: Imagerie){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/imagerie_update/${imagerie.id}`, imagerie, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateImagerie.findIndex((t) => t.id === imagerie.id);
                this.stateImagerie[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getImagerie();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerImagerie(id: number){

            try {
                await apiUrl.delete(`/imagerie_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateImagerie = this.stateImagerie.filter((item) => item.id !== id);
                this.getImagerie();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});