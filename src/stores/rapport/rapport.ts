import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import apiUrl from '@/config/axios'
// import { type Role} from '../../shared/interfaces/index'
import { authHeader } from '@/config/authHeader'

interface CotisationRapportCredentiel {
  id?: number
  total?: number
  cotisation?: number
  nom_prenom?: string
  matricule?: string
  section?: string
  telephone: string
  libelle_service: string
  total_montant: number
  montant_total_avec_interet: number
  montant_rembourser: number
  reste_a_payer: number
  montant_trimestre_encours: number
  montant_trimestre_encours_divise: number
  cotisation_trimestre: number
}

export const useRapportCotisation = defineStore('rapportCotisation', {
  state: () => {
    return {
      stateRapportCotisation: [] as CotisationRapportCredentiel[],
    }
  },
  getters: {
    getterRapportRapportCotisation: (state) => state.stateRapportCotisation,
  },
  actions: {
    // recupération des données
    async getRapportCotisation() {
      try {
        // on lance l'api de recuperation des données
        const response = await apiUrl.get(`/rapportCotisation`, { headers: authHeader() })
        // on stocke les données dans le state
        this.stateRapportCotisation = response.data || []
      } catch (error) {
        //ici on gère les erreurs
        console.log('Erreur survenue', error)
        toast.error('Une erreur est survenue lors de la donnée.')
      }
    },

  },
})
