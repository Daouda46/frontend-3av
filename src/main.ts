import './assets/main.css'
//  import '../assets/scss/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap';
import '@iconify/iconify' 
import 'sweetalert2/dist/sweetalert2.min.css'
import 'vue-search-select/dist/VueSearchSelect.css';
import VueApexCharts from "vue3-apexcharts";
// import Vuelidate from "@vuelidate/core";
import moment from "moment";
import {useAuth} from './config/lifeCycleOfToken'
import { useAuthStore } from '../src/stores/auth/user'


const app = createApp(App)
const pinia = createPinia();
app.use(pinia);
// app.use(Vuelidate);
app.use(VueApexCharts);
app.use(router)
useAuth(router)

// 🔹 Restaure l'état utilisateur avant le mount
const authStore = useAuthStore();
authStore.initializeAuth();
app.mount('#app')
