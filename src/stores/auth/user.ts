import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import apiUrl from "@/config/axios";
import { authHeader } from "@/config/authHeader";
import { useRouter } from "vue-router";

interface User {
  id: number
  role_id?: number
  name: string
  email: string
  // ajoutez d'autres propriétés utilisateur au besoin
}

interface LoginCredentials {
  matricule: string;
  password: string;
  remember: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    token: null as string | null,
    error_message: '' as string,
    user_active: [] as any[],
  }),

  getters: {
    errorMessage(): string {
      return this.error_message
    },
    UserActive(state) {
      return state.user_active
    },
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    // 🔹 Initialiser l'état au démarrage
    initializeAuth() {
      const storedToken = localStorage.getItem('accessToken')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          this.token = JSON.parse(storedToken)
          this.user = JSON.parse(storedUser)
          this.isAuthenticated = true
        } catch (e) {
          console.error('Erreur parsing localStorage :', e)
          this.logout() // nettoyer si corrompu
        }
      }
    },
    async login(credentials: LoginCredentials) {
      try {
        const response = await apiUrl.post('/login', credentials)
        if (response.data.status === 200) {
          this.isAuthenticated = true
          this.user = response.data.user
          this.token = response.data.access_token

          console.log(localStorage.getItem('user'))
          // Stocker les informations
          localStorage.setItem('authToken', response.data.access_token)
          localStorage.setItem('accessToken', JSON.stringify(response.data.access_token))
          localStorage.setItem('user', JSON.stringify(response.data.user))

          // Redirection

          return true
        } else {
          throw new Error(`Unexpected response status: ${response.status}`)
        }
      } catch (error: any) {
        console.error('Login failed:', error)
        this.error_message = 'Email et mot de passe invalides !'
        toast.error('Email et mot de passe invalides !', {
          position: 'top-right',
          autoClose: 8000,
        })
        return false
      }
    },
    // 🔹 Récupérer l'utilisateur depuis le localStorage
    getUserFromStorage(): User | null {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          return JSON.parse(storedUser)
        } catch (e) {
          console.error('Erreur parsing user :', e)
        }
      }
      return null
    },
    async logout() {
      try {
        const response = await apiUrl.post('/logout', null, { headers: authHeader() })

        // Mettre à jour l'état et nettoyer le localStorage
        this.$reset() // Réinitialise tout le state du store
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')

        toast.success('Déconnexion effectuée avec succès.')
        return true // Indique que la déconnexion a réussi
      } catch (error) {
        console.error('Logout failed:', error)
        toast.error('Erreur lors de la déconnexion')
        return false // Indique que la déconnexion a échoué
      }
    },

    async register(user: User) {
      try {
        await apiUrl.post('/register', user)
        toast.success('Enregistrement effectué avec succès.')
        return true
      } catch (error: any) {
        console.error('Registration failed:', error)
        this.error_message = error.response?.data?.message || "Erreur lors de l'enregistrement"
        toast.error(this.error_message)
        return false
      }
    },
  },
})