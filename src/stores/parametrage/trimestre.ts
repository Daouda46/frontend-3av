import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import apiUrl from '@/config/axios'
import { authHeader } from '@/config/authHeader'
import { ref } from 'vue'

export interface TrimestreCredential {
  annee: number
  trimestre: string
  date_debut: Date | string
  date_fin: Date | string
  id: number
  encours: number
}

export const useTrimestreStore = defineStore('trimestre', {
  state: () => ({
    stateTrimestre: [] as TrimestreCredential[],
    showLoader: ref<boolean>(false),
  }),
  getters: {
    getterTrimestre: (state) => state.stateTrimestre,
  },
  actions: {
    async getTrimestre() {
      try {
        const response = await apiUrl.get('/trimestre_index', {
          headers: authHeader(),
        })
        this.stateTrimestre = response.data || []
      } catch (error) {
        console.error('Failed to retrieve budgetary exercises:', error)
        toast.error('Echec! une erreure est survenue lors du chargement des données')
      }
    },

    async supprimerTrimestre(id: number) {
      try {
        await apiUrl.delete(`/trimestre_delete/${id}`, {
          headers: authHeader(),
        })
        this.stateTrimestre = this.stateTrimestre.filter((item) => item.id !== id)
        toast.success('Suppression effectué avec succès')
      } catch (error) {
        console.error('Erreur de suppression: ', error)
        toast.error("Échec de la suppression")
      }
    },

    async activer_anner(id: number) {
      try {
        const response = await apiUrl.put(
          `/activer_trimestre/${id}`,
          {},
          {
            headers: authHeader(),
          },
        )
        const index = this.stateTrimestre.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.stateTrimestre[index] = response.data
        }
        toast.success('Année activé avec succès')
        this.getTrimestre()
      } catch (error) {
        console.error("Erreur d'activation: ", error)
        toast.error("Échec  d'activation du trimestre, verifiez si un trimestre est déjà en cours")
      }
    },

    async desactiver_anner(id: number) {
      try {
        const response = await apiUrl.put(
          `/desactiver_trimestre/${id}`,
          {},
          {
            headers: authHeader(),
          },
        )
        const index = this.stateTrimestre.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.stateTrimestre[index] = response.data
        }
        toast.success('Année activé avec succès')
        this.getTrimestre()
      } catch (error) {
        console.error("Erreur d'activation: ", error)
        toast.error('Échec  ')
      }
    },

    async ajouterTrimestre(credentials: {trimestre:string, annee: number; date_debut: string; date_fin: string }) {
      try {
        const response = await apiUrl.post('/trimestre_store', credentials, {
          headers: authHeader(),
        })
        this.stateTrimestre.push(response.data)
        toast.success('Enregistrement effectué avec succès')
      } catch (error) {
        toast.error("Un problème est survenu lors de l'enregistrement")
        console.error('Erreur ', error)
      }
    },

    async modifierTrimestre(credentials: {
      annee: number
      trimestre: string
      date_debut: string
      date_fin: string
      id: number
    }) {
      try {
        const response = await apiUrl.put(`/trimestre_update/${credentials.id}`, credentials, {
          headers: authHeader(),
        })
        const index = this.stateTrimestre.findIndex((item) => item.id === credentials.id)
        if (index !== -1) {
          this.stateTrimestre[index] = response.data
        }
        this.getTrimestre()
        toast.success('Modification effectué avec succès')
      } catch (error) {
        console.error('Erreur de mise à jour: ', error)
        toast.error("Échec de la mise à jour")
      }
    },
  },
})
