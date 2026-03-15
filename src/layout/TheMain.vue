<template>
  <div>
    <Loader :isLoading="isLoading" />
    
    <template v-if="isAuthenticated">
      <div>
        <div class="main-container">
          <!-- Main wrapper -->
          <div class="body-wrapper">
            <!-- Header Start -->
            <header class="app-header">
              <nav class="navbar navbar-expand-lg navbar-light">
                <div class="navbar-collapse justify-content-end px-0" id="navbarNav">
                  <ul class="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                    
                    <!-- Cloche de notification avec modal personnalisé -->
                    <li class="nav-item dropdown pt-2" style="margin-top: 20px; margin-right: 16px;" ref="notificationRef">
                      <a class="nav-link position-relative" href="javascript:void(0)" @click="toggleNotificationModal">
                        <i class="bi bi-bell" style="font-size: 1.5rem;"></i>
                        <span class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger notification-badge">
                          {{ totalEncours }}
                          <span class="visually-hidden">notifications</span>
                        </span>
                      </a>
                      
                      <!-- Modal de notification personnalisé -->
                      <transition name="modal-fade">
                        <div v-if="showNotificationModal" class="notification-modal-custom">
                          <div class="modal-header-custom">
                            <div class="header-left">
                              <i class="bi bi-bell-fill" style="color: #667eea; font-size: 1.2rem;"></i>
                              <h6 class="mb-0">Notifications</h6>
                            </div>
                            <span class="badge bg-primary">{{ totalEncours }} nouvelle{{ totalEncours > 1 ? 's' : '' }}</span>
                            <button class="btn-close-custom" @click="showNotificationModal = false">
                              <i class="bi bi-x-lg"></i>
                            </button>
                          </div>
                          
                          <div class="modal-body-custom">
                            <div v-if="totalEncours === 0" class="text-center py-4">
                              <i class="bi bi-bell-slash" style="font-size: 2rem; color: #cbd5e1;"></i>
                              <p class="text-muted mt-2 mb-0">Aucune notification</p>
                            </div>
                            
                            <div v-else>
                              <a href="#" class="notification-item-custom" @click="pretView" v-if="nombrePret > 0">
                                <div class="notification-icon bg-gradient-primary">
                                  <i class="bi bi-cash-stack"></i>
                                </div>
                                <div class="notification-content">
                                  <strong>{{ nombrePret }}</strong> demande<span v-if="nombrePret > 1">s</span> de prêt
                                  <small class="text-muted d-block">En attente de validation</small>
                                </div>
                                <span class="badge bg-warning">En cours</span>
                              </a>
                              
                              <a href="#" class="notification-item-custom" @click="prestationView" v-if="nombrePrestation > 0">
                                <div class="notification-icon bg-gradient-secondary">
                                  <i class="bi bi-heart"></i>
                                </div>
                                <div class="notification-content">
                                  <strong>{{ nombrePrestation }}</strong> demande<span v-if="nombrePrestation > 1">s</span> de prestation
                                  <small class="text-muted d-block">En attente de traitement</small>
                                </div>
                                <span class="badge bg-warning">En cours</span>
                              </a>
                            </div>
                          </div>
                          
                          <div class="modal-footer-custom" v-if="totalEncours > 0">
                            <button class="btn btn-primary btn-sm w-100" @click="viewAllNotifications">
                              Voir toutes les notifications
                              <i class="bi bi-arrow-right ms-2"></i>
                            </button>
                          </div>
                        </div>
                      </transition>
                    </li>
                    &nbsp;&nbsp;
                    
                    <!-- Image de profil (Bootstrap d'origine) -->
                    <li class="nav-item dropdown">
                      <a class="nav-link" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="../../public/assets/images/profile/user-1.jpg" alt="" width="50" height="50" class="rounded-circle">
                      </a>
                      <div class="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                        <div class="message-body">
                          <a href="#" @click="logout()" class="btn btn-outline-primary mx-3 mt-2 d-block">Déconnexion</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </nav>
            </header>
            <!-- Header End -->
            
            <div class="body-wrapper-inner">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-12 px-0">
                    <RouterView />
                  </div>
                </div>
                <TheFoother />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <template v-else>
      <Login />
    </template>
  </div>
</template>

<script lang="ts" setup>
import TheFoother from '../layout/TheFoother.vue'
import Login from '../views/auth/Login.vue'
import { RouterView, useRouter } from 'vue-router'
import { useDemandePrestation } from '../stores/prestation/demandePrestation'
import { usePret } from '../stores/finance/pret'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth/user'

const authStore = useAuthStore()
const router = useRouter()
const demandePrestationStore = useDemandePrestation()
const pretStore = usePret()
const isLoading = ref(false)
const isAuthenticated = ref(false)
const showNotificationModal = ref(false)
const notificationRef = ref<HTMLElement | null>(null)

// Computed qui compte les prêts avec statut === 1
const nombrePret = computed(() => {
  return pretStore.getterPret?.filter(pret => pret.statut === 1).length || 0
})

// Computed qui compte les prestation avec statut === 1
const nombrePrestation = computed(() => {
  return demandePrestationStore.getterDemandePrestation?.filter(pret => pret.statut === 1).length || 0
})

// Computed qui fait le cumul des prêts et prestations avec statut === 1
const totalEncours = computed(() => {
  return nombrePret.value + nombrePrestation.value
})

const toggleNotificationModal = () => {
  showNotificationModal.value = !showNotificationModal.value
}

const pretView = () => {
  router.push({ name: "Pret" })
  showNotificationModal.value = false
}

const prestationView = () => {
  router.push({ name: "DemandePrestation" })
  showNotificationModal.value = false
}

const viewAllNotifications = () => {
  // router.push({ name: "Notifications" })
  showNotificationModal.value = false
}

const logout = async () => {
  try {
    const success = await authStore.logout()
    if (success) {
      router.push('/connexion')
    }
  } catch (error) {
    console.error("Error during logout:", error)
  }
}

// Fermer le modal au clic à l'extérieur
const handleClickOutside = (event: MouseEvent) => {
  if (notificationRef.value && !notificationRef.value.contains(event.target as Node)) {
    showNotificationModal.value = false
  }
}

// Vérifie l'authentification
onMounted(async () => {
  isAuthenticated.value = !!localStorage.getItem('authToken')
  
  if (!isAuthenticated.value) {
    router.replace('/connexion')
  }

  try {
    isLoading.value = true
    await pretStore.getPret()
    await demandePrestationStore.getDemandePrestation()
  } catch (error) {
    console.error('Erreur lors du chargement des fonctions:', error)
  } finally {
    isLoading.value = false
  }
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.body-wrapper-inner {
  flex: 1;
}

/* Style du badge de notification original */
.notification-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  border: 2px solid white;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}

/* Modal de notification personnalisé */
.notification-modal-custom {
  position: absolute;
  top: 60px;
  right: -20px;
  width: 350px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  z-index: 1050;
}

.notification-modal-custom::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 30px;
  width: 16px;
  height: 16px;
  background: white;
  transform: rotate(45deg);
  border-left: 1px solid #e2e8f0;
  border-top: 1px solid #e2e8f0;
}

.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-close-custom {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.btn-close-custom:hover {
  background: #ef4444;
  color: white;
}

.modal-body-custom {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.notification-item-custom {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  margin-bottom: 5px;
}

.notification-item-custom:hover {
  background: #f1f5f9;
  transform: translateX(3px);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.notification-content {
  flex: 1;
  font-size: 0.9rem;
}

.notification-content small {
  font-size: 0.75rem;
}

.modal-footer-custom {
  padding: 15px 20px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

/* Animation du modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .notification-modal-custom {
    width: 300px;
    right: -10px;
  }
  
  .notification-modal-custom::before {
    right: 20px;
  }
}

/* Garder les styles Bootstrap intacts */
:deep(.dropdown-menu) {
  z-index: 1060;
}

:deep(.btn-outline-primary) {
  transition: all 0.3s ease;
}

:deep(.btn-outline-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(58, 123, 213, 0.3);
}
</style>