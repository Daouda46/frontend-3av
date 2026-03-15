<template>
  <div>
    <!-- Sidebar Start -->
    <aside class="left-sidebar d-flex flex-column" style="padding-bottom:80px">
      <!-- Brand / logo -->
      <div class="brand-logo d-flex align-items-center justify-content-between">
        <a href="./index.html" class="text-nowrap logo-img">
          <!-- <img src="../../assets/images/logos/logo.svg" alt="" /> -->
        </a>
        <div class="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
          <i class="ti ti-x fs-8"></i>
        </div>
      </div>

      <!-- Sidebar scrollable content -->
      <nav class="sidebar-nav scroll-sidebar flex-grow-1" data-simplebar="">
        <ul id="sidebarnav">
          
          <!-- TABLEAU DE BORD -->
          <li class="nav-small-cap" @click="toggleMenu('tableauBord')">
            <iconify-icon 
              :icon="menusOuverts.tableauBord ? 'solar:alt-arrow-down-bold-duotone' : 'solar:menu-dots-linear'" 
              class="nav-small-cap-icon fs-4"
            ></iconify-icon>
            <span class="hide-menu">Tableau de bord</span>
            <iconify-icon 
              :icon="menusOuverts.tableauBord ? 'solar:alt-arrow-down-bold-duotone' : 'solar:alt-arrow-right-bold-duotone'"
              class="ms-auto"
            ></iconify-icon>
          </li>
          <transition name="slide-fade">
            <ul v-if="menusOuverts.tableauBord" class="submenu">
              <li class="sidebar-item">
                <router-link :to="{ name: 'Dashbord' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:layers-minimalistic-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Dashbord</span>
                </router-link>
              </li>
            </ul>
          </transition>

          <li><span class="sidebar-divider lg"></span></li>

          <!-- PARAMETRAGE -->
          <li class="nav-small-cap" @click="toggleMenu('parametrage')">
            <iconify-icon 
              :icon="menusOuverts.parametrage ? 'solar:alt-arrow-down-bold-duotone' : 'solar:menu-dots-linear'" 
              class="nav-small-cap-icon fs-4"
            ></iconify-icon>
            <span class="hide-menu">Paramètrage</span>
            <iconify-icon 
              :icon="menusOuverts.parametrage ? 'solar:alt-arrow-down-bold-duotone' : 'solar:alt-arrow-right-bold-duotone'"
              class="ms-auto"
            ></iconify-icon>
          </li>
          <transition name="slide-fade">
            <ul v-if="menusOuverts.parametrage" class="submenu">
              <li class="sidebar-item">
                <router-link :to="{ name: 'exerciceBudgetaire' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:calendar-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Exercice Budgétaire</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Trimestre' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:calendar-mark-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Trimestre</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Actualite' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:notes-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Actualité</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Imagerie' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:gallery-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Imagérie</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Role' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:user-id-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Rôle</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Service' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:users-group-rounded-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Service</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'TheFonction' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:user-speaker-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Fonction</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Emploi' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:briefcase-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Emploi</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Grade' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:star-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Grade</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'StructureControlle' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:structure-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Structures</span>
                </router-link>
              </li>
            </ul>
          </transition>

          <!-- MEMBRES -->
          <li class="nav-small-cap" @click="toggleMenu('membres')">
            <iconify-icon 
              :icon="menusOuverts.membres ? 'solar:alt-arrow-down-bold-duotone' : 'solar:menu-dots-linear'" 
              class="nav-small-cap-icon fs-4"
            ></iconify-icon>
            <span class="hide-menu">Membres</span>
            <iconify-icon 
              :icon="menusOuverts.membres ? 'solar:alt-arrow-down-bold-duotone' : 'solar:alt-arrow-right-bold-duotone'"
              class="ms-auto"
            ></iconify-icon>
          </li>
          <transition name="slide-fade">
            <ul v-if="menusOuverts.membres" class="submenu">
              <li class="sidebar-item">
                <router-link :to="{ name: 'Accueil' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:home-smile-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Accueil</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Personnel' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:users-group-rounded-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Membres</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Attestation' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:bill-list-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Attestation</span>
                </router-link>
              </li>
            </ul>
          </transition>

          <!-- FINANCE -->
          <li class="nav-small-cap" @click="toggleMenu('finance')">
            <iconify-icon 
              :icon="menusOuverts.finance ? 'solar:alt-arrow-down-bold-duotone' : 'solar:menu-dots-linear'" 
              class="nav-small-cap-icon fs-4"
            ></iconify-icon>
            <span class="hide-menu">Finance</span>
            <iconify-icon 
              :icon="menusOuverts.finance ? 'solar:alt-arrow-down-bold-duotone' : 'solar:alt-arrow-right-bold-duotone'"
              class="ms-auto"
            ></iconify-icon>
          </li>
          <transition name="slide-fade">
            <ul v-if="menusOuverts.finance" class="submenu">
              <li class="sidebar-item">
                <router-link :to="{ name: 'Pret' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:hand-money-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Validation de prêt</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'Remboursement' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:card-recive-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Remboursement prêt</span>
                </router-link>
              </li>
            </ul>
          </transition>

          <!-- PRESTATION DE SERVICE -->
          <li class="nav-small-cap" @click="toggleMenu('prestation')">
            <iconify-icon 
              :icon="menusOuverts.prestation ? 'solar:alt-arrow-down-bold-duotone' : 'solar:menu-dots-linear'" 
              class="nav-small-cap-icon fs-4"
            ></iconify-icon>
            <span class="hide-menu">Prestation de service</span>
            <iconify-icon 
              :icon="menusOuverts.prestation ? 'solar:alt-arrow-down-bold-duotone' : 'solar:alt-arrow-right-bold-duotone'"
              class="ms-auto"
            ></iconify-icon>
          </li>
          <transition name="slide-fade">
            <ul v-if="menusOuverts.prestation" class="submenu">
              <li class="sidebar-item">
                <router-link :to="{ name: 'TypePrestation' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:document-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Type prestation</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'DemandePrestation' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:checklist-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Valider prestation</span>
                </router-link>
              </li>
            </ul>
          </transition>

          <!-- FONCTIONNEMENT -->
          <li class="nav-small-cap" @click="toggleMenu('fonctionnement')">
            <iconify-icon 
              :icon="menusOuverts.fonctionnement ? 'solar:alt-arrow-down-bold-duotone' : 'solar:menu-dots-linear'" 
              class="nav-small-cap-icon fs-4"
            ></iconify-icon>
            <span class="hide-menu">Fonctionnement</span>
            <iconify-icon 
              :icon="menusOuverts.fonctionnement ? 'solar:alt-arrow-down-bold-duotone' : 'solar:alt-arrow-right-bold-duotone'"
              class="ms-auto"
            ></iconify-icon>
          </li>
          <transition name="slide-fade">
            <ul v-if="menusOuverts.fonctionnement" class="submenu">
              <li class="sidebar-item">
                <router-link :to="{ name: 'Caisse' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:wallet-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Caisse du bureau</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'ParametrageCotisation' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:chart-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Cotisation trimestrielle</span>
                </router-link>
              </li>
            </ul>
          </transition>

          <!-- LISTES DES ETATS -->
          <li class="nav-small-cap" @click="toggleMenu('etats')">
            <iconify-icon 
              :icon="menusOuverts.etats ? 'solar:alt-arrow-down-bold-duotone' : 'solar:menu-dots-linear'" 
              class="nav-small-cap-icon fs-4"
            ></iconify-icon>
            <span class="hide-menu">Listes des etats</span>
            <iconify-icon 
              :icon="menusOuverts.etats ? 'solar:alt-arrow-down-bold-duotone' : 'solar:alt-arrow-right-bold-duotone'"
              class="ms-auto"
            ></iconify-icon>
          </li>
          <transition name="slide-fade">
            <ul v-if="menusOuverts.etats" class="submenu">
              <li class="sidebar-item">
                <router-link :to="{ name: 'rapportPrestation' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:file-text-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Etats des assistances</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'rapportTrimestriel' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:chart-square-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Rapport trimestriel</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link :to="{ name: 'rapportCotisation' }" class="sidebar-link" active-class="active">
                  <iconify-icon icon="solar:chart-2-bold-duotone"></iconify-icon>
                  <span class="hide-menu">Rapport détaillé</span>
                </router-link>
              </li>
            </ul>
          </transition>

        </ul>
      </nav>
    </aside>
    <!-- Sidebar End -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// État pour gérer l'ouverture/fermeture de tous les menus
const menusOuverts = ref({
  tableauBord: false,
  parametrage: false,
  membres: false,
  finance: false,
  prestation: false,
  fonctionnement: false,
  etats: false
})

// Fonction pour toggle un menu spécifique
const toggleMenu = (menu: keyof typeof menusOuverts.value) => {
  menusOuverts.value[menu] = !menusOuverts.value[menu]
}
</script>

<style scoped>
.left-sidebar {
  background: linear-gradient(135deg, #f5f9ff 0%, #e6f0ff 100%);
  box-shadow: 4px 0 15px rgba(58, 123, 213, 0.1);
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid rgba(58, 123, 213, 0.15);
  width: 290px;
  display: flex;
  flex-direction: column;
}

.brand-logo {
  padding: 20px 25px;
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(58, 123, 213, 0.1);
}

.scroll-sidebar {
  overflow-y: auto;
  flex-grow: 1;
}

/* Style scrollbar */
.scroll-sidebar::-webkit-scrollbar {
  width: 5px;
}
.scroll-sidebar::-webkit-scrollbar-track {
  background: rgba(58, 123, 213, 0.05);
}
.scroll-sidebar::-webkit-scrollbar-thumb {
  background: rgba(58, 123, 213, 0.2);
  border-radius: 10px;
}
.scroll-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(58, 123, 213, 0.4);
}

/* Style pour les menus parents */
.nav-small-cap {
  color: #3a7bd5;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px 16px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 8px;
}

.nav-small-cap:hover {
  background: rgba(58, 123, 213, 0.1);
}

.nav-small-cap-icon {
  margin-right: 15px;
  color: #3a7bd5;
  font-size: 1.2rem;
}

.ms-auto {
  margin-left: auto;
  font-size: 1rem;
  transition: transform 0.3s ease;
}

/* Style pour les sous-menus */
.submenu {
  list-style: none;
  padding-left: 0px;
  margin: 5px 0 10px 0;
}

.submenu .sidebar-item {
  margin: 2px 0;
  border-radius: 8px;
}

.submenu .sidebar-link {
  padding: 8px 15px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.submenu .sidebar-link iconify-icon {
  font-size: 1rem;
  margin-right: 10px;
  color: #3a7bd5;
}

.submenu .sidebar-link:hover {
  color: #3a7bd5;
  background: rgba(58, 123, 213, 0.1);
  transform: translateX(3px);
}

/* Style pour l'item actif */
.active1 {
  background: linear-gradient(90deg, rgba(58, 123, 213, 0.15) 0%, rgba(58, 123, 213, 0.05) 100%);
  color: #3a7bd5 !important;
  font-weight: 500;
  position: relative;
}

.active:before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 4px;
  background: #3a7bd5;
  border-radius: 0 4px 4px 0;
}

.sidebar-divider.lg {
  height: 1px;
  background: rgba(58, 123, 213, 0.1);
  margin: 15px 0;
}

.close-btn {
  color: #3a7bd5;
  transition: all 0.5s ease;
  cursor: pointer;
}

.close-btn:hover {
  transform: rotate(90deg);
}

/* Animation pour le dropdown */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

/* Hover effects */
.sidebar-item:hover iconify-icon {
  transform: scale(1.1);
}

iconify-icon {
  transition: transform 0.3s ease;
}

.hide-menu {
  transition: all 0.3s ease;
}
</style>