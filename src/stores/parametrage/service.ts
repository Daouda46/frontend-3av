import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type Service} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

interface Service {
  id?: number;
  localite?: number;
  code: string;
  libelle: string;
  couleur: string;
  structure_controlle?: string;
}

export const useService = defineStore("Service",{
    
    state:()=>{
        return {
            stateService: [] as Service[]
        }
    },
    getters: {
            getterService: (state) => state.stateService,
    },
    actions:{
        
        //Service de recupération des structures cadres logiques
        async getService () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/liste_service`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateService = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la récupération des Services.");
                    }
            },
        
        async AjouterService (service: FormData) {
            try {
                // on lance l'api d'ajout des données
                await apiUrl.post(`/service_store`, service, {  headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }});
                // on recupère le getter avec les datas ajoutées
                this.getService();
                //on notifie l'utilisateur du succès de l'opération
                toast.success("Enregistrement effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur )
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de l'enregistrement.");
            }
        },
  async modifierService(id: number, service: FormData) {
  try {
    const response = await apiUrl.put(`/service_update/${id}`, service, {
      headers: {
        ...authHeader()
        // PAS 'Content-Type', Axios va le mettre automatiquement
      }
    })

    const index = this.stateService.findIndex((t) => t.id === id)
    this.stateService[index] = response.data
    this.getService()
    toast.success("Modification effectuée avec succès.")
  } catch (error) {
    console.log("Erreur survenue", error)
    toast.error("Une erreur est survenue lors de la modification.")
  }
},
        async modifierService1(service: FormData){
            try {
                // on lance l'api de modification des données
                const response = await apiUrl.put(`/service_update/${service.id}`, service, { headers: authHeader() });
                //on recherche l'index ou lid = a ce que l'index que que l'user modifié
                const index = this.stateService.findIndex((t) => t.id === service.id);
                this.stateService[index] = response.data; //on passe a l'index la modification
                // on recupère le getter avec les datas modifiées
                this.getService();
                // on notifie l'utilisateur du succès de l'opération
                toast.success("Modification effectuée avec succès.");
            } catch (error) {
                //gestion des erreurs et de leur retour à l'utilisateur
                console.log("Erreur survenue", error);
                toast.error("Une erreur est survenue lors de la modification.");
            }
        },
        async supprimerService(id: number){

            try {
                await apiUrl.delete(`/service_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateService = this.stateService.filter((item) => item.id !== id);
                this.getService();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});