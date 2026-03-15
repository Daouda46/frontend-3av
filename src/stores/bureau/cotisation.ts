import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import apiUrl from '@/config/axios'
// import { type Role} from '../../shared/interfaces/index'
import { authHeader } from '@/config/authHeader'

interface CotisationCredentiel {
  id?: number
  total?: number
  cotisation?: number
  encours?: number
  trimestre?: string
  trimestre_id: number
  annee_id: number
  nbre_retraite: number
  nbre_deces: number
}


export const useCotisation = defineStore('Cotisation', {
  state: () => {
    return {
      stateCotisation: [] as CotisationCredentiel[],
    }
  },
  getters: {
    getterCotisation: (state) => state.stateCotisation,
  },
  actions: {
    // recupération des données
    async getCotisation() {
      try {
        // on lance l'api de recuperation des données
        const response = await apiUrl.get(`/cotisation_index`, { headers: authHeader() })
        // on stocke les données dans le state
        this.stateCotisation = response.data || []
      } catch (error) {
        //ici on gère les erreurs
        console.log('Erreur survenue', error)
        toast.error('Une erreur est survenue lors de la donnée.')
      }
    },

    async AjouterCotisation(cotisation: CotisationCredentiel) {
      try {
        // on lance l'api d'ajout des données
        await apiUrl.post(`/cotisation_store`, cotisation, { headers: authHeader() })
        // on recupère le getter avec les datas ajoutées
        this.getCotisation()
        //on notifie l'utilisateur du succès de l'opération
        toast.success('Enregistrement effectuée avec succès.')
      } catch (error) {
        //gestion des erreurs et de leur retour à l'utilisateur )
        console.log('Erreur survenue', error)
        toast.error("Une erreur est survenue lors de l'enregistrement.")
      }
    },
    async modifierCotisation(cotisation: CotisationCredentiel) {
      try {
        // on lance l'api de modification des données
        const response = await apiUrl.put(`/cotisation_update/${cotisation.id}`, cotisation, {
          headers: authHeader(),
        })
        //on recherche l'index ou lid = a ce que l'index que que l'user modifié
        const index = this.stateCotisation.findIndex((t) => t.id === cotisation.id)
        this.stateCotisation[index] = response.data //on passe a l'index la modification
        // on recupère le getter avec les datas modifiées
        this.getCotisation()
        // on notifie l'utilisateur du succès de l'opération
        toast.success('Modification effectuée avec succès.')
      } catch (error) {
        //gestion des erreurs et de leur retour à l'utilisateur
        console.log('Erreur survenue', error)
        toast.error('Une erreur est survenue lors de la modification.')
      }
    },
    async supprimerCotisation(id: number) {
      try {
        await apiUrl.delete(`/cotisation_delete/${id}`, {
          headers: authHeader(),
        })
        this.stateCotisation = this.stateCotisation.filter((item) => item.id !== id)
        this.getCotisation()
        toast.success('Suppression effectuée avec succès.')
      } catch (error) {
        console.error('Erreur de suppression: ', error)
        toast.error('Une erreur est survenue lors de la suppression')
      }
    },
  },
})
