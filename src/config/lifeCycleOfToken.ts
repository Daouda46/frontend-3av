// src/config/useAuth.ts
import apiClient from './axios'
import Swal from 'sweetalert2'
import type { Router } from 'vue-router'

export function useAuth(router: Router) {
  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')

    Swal.fire({
      icon: 'warning',  
      title: 'Session expirée',
    //  text: 'Vous allez être redirigé vers la page de connexion.',
      timer: 1000,
      showConfirmButton: false
    }).then(() => {
      router.replace('/connexion')
    })
  }

  apiClient.interceptors.response.use(
    response => response,
    error => {
      console.log('Erreur interceptée:', error.response?.status)
      if (error.response && error.response.status === 401) {
        logout()
      }
      return Promise.reject(error)
    }
  )
}
