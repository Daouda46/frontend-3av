import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import apiUrl from '@/config/axios'
import { authHeader } from '@/config/authHeader'
import { ref } from 'vue'

export interface ExerciceCredentials {
  annee: number
  date_debut: Date | string
  date_fin: Date | string
  id: number
  encours: number
}

export const useExerciceBudgetaireStore = defineStore('exercice_budgetaire', {
  state: () => ({
    ListeExerciceBudgetaire: [] as ExerciceCredentials[],
    showLoader: ref<boolean>(false),
  }),
  getters: {
    getterExerciceBudgetaire: (state) => state.ListeExerciceBudgetaire,
   
  },
  actions: {
    async getExerciceBudgetaire() {
      try {
        const response = await apiUrl.get('/anneebugetaire_index', {
          headers: authHeader(),
        })
        this.ListeExerciceBudgetaire = response.data || []
      } catch (error) {
        console.error('Failed to retrieve budgetary exercises:', error)
        toast.error('Echec! une erreure est survenue lors du chargement des données')
      }
    },

    async supprimerExerciceBudgetaire(id: number) {
      try {
        await apiUrl.delete(`/anneebugetaire_delete/${id}`, {
          headers: authHeader(),
        })
        this.ListeExerciceBudgetaire = this.ListeExerciceBudgetaire.filter((item) => item.id !== id)
        toast.success('Exercice budgetaire supprimé avec succès')
      } catch (error) {
        console.error('Erreur de suppression: ', error)
        toast.error("Échec de la suppression de l'exercice budgetaire")
      }
    },

    async activer_anner(id: number) {
      try {
        const response = await apiUrl.put(
          `/activer_anner/${id}`,
          {},
          {
            headers: authHeader(),
          },
        )
        const index = this.ListeExerciceBudgetaire.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.ListeExerciceBudgetaire[index] = response.data
        }
        toast.success('Année activé avec succès')
        this.getExerciceBudgetaire()
      } catch (error) {
        console.error("Erreur d'activation: ", error)
        toast.error("Échec  d'activation de l'année, verifiez si une année est déjà en cours")
      }
    },

    async desactiver_anner(id: number) {
      try {
        const response = await apiUrl.put(
          `/desactiver_anner/${id}`,
          {},
          {
            headers: authHeader(),
          },
        )
        const index = this.ListeExerciceBudgetaire.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.ListeExerciceBudgetaire[index] = response.data
        }
        toast.success('Année activé avec succès')
        this.getExerciceBudgetaire()
      } catch (error) {
        console.error("Erreur d'activation: ", error)
        toast.error('Échec  ')
      }
    },

    async ajouterExerciceBudgetaire(credentials: {
      annee: number
      date_debut: string
      date_fin: string
    }) {
      try {
        const response = await apiUrl.post('/anneebugetaire_store', credentials, {
          headers: authHeader(),
        })
        this.ListeExerciceBudgetaire.push(response.data)
        toast.success('Exercice budgetaire enregistré avec succès')
      } catch (error) {
        toast.error("Un problème est survenu lors de l'enregistrement")
        console.error('Erreur ', error)
      }
    },

    async modifierExerciceBudgetaire(credentials: {
      annee: number
      date_debut: string
      date_fin: string
      id: number
    }) {
      try {
        const response = await apiUrl.put(`/anneebugetaire_update/${credentials.id}`, credentials, {
          headers: authHeader(),
        })
        const index = this.ListeExerciceBudgetaire.findIndex((item) => item.id === credentials.id)
        if (index !== -1) {
          this.ListeExerciceBudgetaire[index] = response.data
        }
        this.getExerciceBudgetaire()
        toast.success('Exercice budgetaire mis à jour avec succès')
      } catch (error) {
        console.error('Erreur de mise à jour: ', error)
        toast.error("Échec de la mise à jour de l'exercice budgetaire")
      }
    },
  },
})
