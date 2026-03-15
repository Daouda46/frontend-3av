<template>
  <div>
    <!-- Affiche le layout complet si authentifié -->
    <div  class="page-wrapper" id="main-wrapper" 
         data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
         data-sidebar-position="fixed" data-header-position="fixed">
      <TheHeader/>
      <TheSidebar/>
      <TheMain/>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import TheMain from "./TheMain.vue"
import TheSidebar from './TheSidebar.vue'
import TheHeader from './TheHeader.vue'
import LoginView from '../views/auth/Login.vue' // Importez votre composant de login
import { useAuthStore } from '../stores/auth/user'

const router = useRouter()
// const isAuthenticated = ref(false)

const authStore = useAuthStore()

// Surveiller les changements d'authentification

</script>