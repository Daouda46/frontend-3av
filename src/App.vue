<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheContent from './layout/TheContent.vue'
import { useRouter, useRoute } from 'vue-router'
import LoginView  from "./views/auth/Login.vue"
// import PageExpire  from "./views/auth/PageExpire.vue"
import {useAuth} from './config/lifeCycleOfToken'

const router = useRouter()
const route = useRoute()
useAuth() // active l’intercepteur au lancement de l'app
</script>
<script lang="ts">
export default {
  name: 'TheContent',
}
</script>
<template>
 <div  v-if="route.path !== '/connexion'" >

  <TheContent />
 </div>
  <!-- Page Login si on est sur /connexion -->
    <div v-else>
      <LoginView />
      <!-- <PageExpire />  -->
    </div>
</template>

<style scoped>
/* ton style ici */
</style>
