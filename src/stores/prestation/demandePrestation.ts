import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { DemandePrestation} from '../../shared/interfaces/demandePrestation.interface'
import { authHeader } from "@/config/authHeader";

interface DemandePrestation {
  id: number;
  type_prestation_id: string;
  libelle?: string;
  fichier: File|string;
  statut: number;
  montant?: number;
  code?: string;
  telephone?: string;
  nom?: string;
  prenom?: string;
  date_demande?: Date;
}
export const useDemandePrestation = defineStore("demandePrestation",{
    
    state:()=>{
        return {
            stateDemandePrestation: [] as DemandePrestation[]
        }
    },
    getters: {
            getterDemandePrestation: (state) => state.stateDemandePrestation,
    },
    actions:{
        
        //DemandePrestation de recupération des structures cadres logiques
        async getDemandePrestation () {
            try {
                // on lance l'api de recuperation des données
                const response = await apiUrl.get(`/demande_prestation_index`, { headers: authHeader() }); 
                // on stocke les données dans le state
                this.stateDemandePrestation = response.data || []; 
            } catch (error) {
                //ici on gère les erreurs
                console.log("Erreur survenue", error);
                // toast.error("Une erreur est survenue lors de la récupération des DemandePrestations.");
                    }
            },
        
      async AjouterDemandePrestation (demandePrestation: FormData) {
  try {
    await apiUrl.post(`/demande_prestation_store`, demandePrestation, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    await this.getDemandePrestation();
    toast.success("Enregistrement effectué avec succès.");
  } catch (error) {
    console.error("Erreur survenue", error);
    toast.error("Une erreur est survenue lors de l'enregistrement.");
  }
},
 async decisionPrestation (demandePrestation: DemandePrestation) {
  try {
    await apiUrl.put(`/demande_prestation_decision/${demandePrestation.id}`, demandePrestation,{ headers: authHeader() });
    await this.getDemandePrestation();
    toast.success("Enregistrement effectué avec succès.");
  } catch (error) {
    console.error("Erreur survenue", error);
    toast.error("Une erreur est survenue lors de l'enregistrement.");
  }
},
async modifierDemandePrestation(demandePrestation: FormData) {
  try {
    // Extraction de l'ID depuis le FormData
    const id = demandePrestation.get('id');
        const data = {
         type_prestation_id : demandePrestation.get('type_prestation_id')
        }
    if (!id) {
      throw new Error("ID manquant pour la modification");
    }

    await apiUrl.put(`/demande_prestation_update/${id}`, data, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    await this.getDemandePrestation();
    toast.success("Enregistrement effectué avec succès.");
  } catch (error) {
    console.error("Erreur survenue", error);
    toast.error("Une erreur est survenue lors de l'enregistrement.");
    throw error; // Important pour que l'appelant puisse gérer l'erreur
  }
},

        async supprimerDemandePrestation(id: number){

            try {
                await apiUrl.delete(`/demande_prestation_delete/${id}`,{
                    headers: authHeader()
                });
                this.stateDemandePrestation = this.stateDemandePrestation.filter((item) => item.id !== id);
                this.getDemandePrestation();
                toast.success("Suppression effectuée avec succès.");
            } catch (error) {
                console.error("Erreur de suppression: ", error);
                toast.error("Une erreur est survenue lors de la suppression");
            }
        },
    }
});