import {defineStore} from 'pinia';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
// import { type Role} from '../../shared/interfaces/index'
import { authHeader } from "@/config/authHeader";

interface Caisse {
  id?: number;
  libelle: string;
  montant: number;
  frais: number;
}
interface CaisseForm {
  id?: number
  montant: number
  libelle: string
  frais: number
}

export const useCaisse = defineStore('Caisse', {
  state: () => {
    return {
      stateCaisse: [] as Caisse[],
    }
  },
  getters: {
    getterCaisse: (state) => state.stateCaisse,
  },
  actions: {
    // recupération des données
    async getCaisse() {
      try {
        // on lance l'api de recuperation des données
        const response = await apiUrl.get(`/caisse_index`, { headers: authHeader() })
        // on stocke les données dans le state
        this.stateCaisse = response.data || []
      } catch (error) {
        //ici on gère les erreurs
        console.log('Erreur survenue', error)
        toast.error('Une erreur est survenue lors de la donnée.')
      }
    },

    async AjouterCaisse(caisse: CaisseForm) {
      try {
        // on lance l'api d'ajout des données
        await apiUrl.post(`/caisse_store`, caisse, { headers: authHeader() })
        // on recupère le getter avec les datas ajoutées
        this.getCaisse()
        //on notifie l'utilisateur du succès de l'opération
        toast.success('Enregistrement effectuée avec succès.')
      } catch (error) {
        //gestion des erreurs et de leur retour à l'utilisateur )
        console.log('Erreur survenue', error)
        toast.error("Une erreur est survenue lors de l'enregistrement.")
      }
    },
    async modifierCaisse(caisse: CaisseForm) {
      try {
        // on lance l'api de modification des données
        const response = await apiUrl.put(`/caisse_update/${caisse.id}`, caisse, {
          headers: authHeader(),
        })
        //on recherche l'index ou lid = a ce que l'index que que l'user modifié
        const index = this.stateCaisse.findIndex((t) => t.id === caisse.id)
        this.stateCaisse[index] = response.data //on passe a l'index la modification
        // on recupère le getter avec les datas modifiées
        this.getCaisse()
        // on notifie l'utilisateur du succès de l'opération
        toast.success('Modification effectuée avec succès.')
      } catch (error) {
        //gestion des erreurs et de leur retour à l'utilisateur
        console.log('Erreur survenue', error)
        toast.error('Une erreur est survenue lors de la modification.')
      }
    },
    async supprimerCaisse(id: number) {
      try {
        await apiUrl.delete(`/caisse_delete/${id}`, {
          headers: authHeader(),
        })
        this.stateCaisse = this.stateCaisse.filter((item) => item.id !== id)
        this.getCaisse()
        toast.success('Suppression effectuée avec succès.')
      } catch (error) {
        console.error('Erreur de suppression: ', error)
        toast.error('Une erreur est survenue lors de la suppression')
      }
    },
  },
})