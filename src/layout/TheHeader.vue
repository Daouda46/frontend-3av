<template>
  <div>
    <!-- Header fixe -->
    <div class="app-topstrip bg-dark py-3 px-4 w-100 d-flex align-items-center justify-content-between">
      <!-- Marquee avec message de bienvenue personnalisé -->
      <div class="marquee">
        <div class="marquee-content">
          {{ greetingMessage }}
        </div>
      </div>

      <!-- Horloge temps universel -->
      <div class="clock-container">
        <div class="clock">
          <span class="clock-time">{{ currentTime }}</span>
        </div>
      </div>

      <!-- Icône du menu visible uniquement sur mobile/tablette -->
      <div class="menu-icon d-flex align-items-center d-lg-none">
        <i class="fas fa-bars text-white fs-3" @click="toggleMenu"></i>
      </div>
    </div>

    <!-- Modal centré -->
    <div v-if="menuOpen" class="modal-overlay" @click.self="toggleMenu">
      <div class="modal-content">
        <a href="#" @click="AccueilView" class="modal-item">Accueil</a>
        <a href="#" @click="SuiviPretView" class="modal-item">Suivi de prêt</a>
        <a href="#" @click="fonctionView" class="modal-item">Mes Emprunts</a>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menuOpen = ref(false);
const currentTime = ref('');
const user = ref(null);

let timerInterval = null;

// Fonction pour obtenir le temps universel (UTC)
const updateUTCTime = () => {
  const now = new Date();
  
  // Obtenir les heures UTC (0-23)
  const hours = now.getUTCHours().toString().padStart(2, '0');
  
  // Obtenir les minutes UTC
  const minutes = now.getUTCMinutes().toString().padStart(2, '0');
  
  // Obtenir les secondes UTC
  const seconds = now.getUTCSeconds().toString().padStart(2, '0');
  
  // Formater l'heure
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

// Message de bienvenue personnalisé selon l'heure et l'utilisateur
const greetingMessage = computed(() => {
  const now = new Date();
  const hours = now.getUTCHours(); // Heure UTC
  
  let greeting = '';
  
  // Déterminer la salutation selon l'heure UTC
  if (hours >= 5 && hours < 13) {
    greeting = 'Bonjour';
  } else if (hours >= 13 && hours < 18) {
    greeting = 'Bonsoir';
  } else {
    greeting = 'Bonsoir';
  }
  
  // Récupérer le nom de l'utilisateur
  const userName = 'M./Mme '+ user.value?.nom+' '+user.value?.prenom || 'Cher Membre';
  
  return `${greeting} ${userName}, Bienvenue à l'Amicale des Agents Vérificateurs et Assimilés`;
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const fonctionView = () => {
  toggleMenu();
  router.push({ name: "DemandePret" });
};

const AccueilView = () => {
  toggleMenu();
  router.push({ name: "Accueil" });
};

const SuiviPretView = () => {
  toggleMenu();
  router.push({ name: "SuiviPret" });
};

onMounted(() => {
  // Récupérer l'utilisateur depuis localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      console.error('Erreur lors du parsing de l\'utilisateur:', e);
    }
  }
  
  // Mettre à jour l'heure immédiatement
  updateUTCTime();
  
  // Puis toutes les secondes
  timerInterval = setInterval(updateUTCTime, 1000);
});

onUnmounted(() => {
  // Nettoyer l'intervalle quand le composant est détruit
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
.app-topstrip {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  color: white;
  font-weight: 500;
  font-size: 16px;
  z-index: 1000;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.marquee {
  flex: 1;
  overflow: hidden;
  height: 50px;
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.marquee-content {
  font-size: 24px;
  white-space: nowrap;
  will-change: transform;
  animation: scroll-left 25s linear infinite;
  padding-left: 100%;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 600;
}

@keyframes scroll-left {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
}

/* Style de l'horloge */
.clock-container {
  margin-right: 20px;
  min-width: 150px;
}

.clock {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.clock-time {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.clock-timezone {
  font-size: 14px;
  color: #4af;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Effet de pulsation pour les secondes */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.clock-time {
  animation: pulse 2s infinite;
}

/* Overlay sombre derrière le modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex; 
  justify-content: center; 
  align-items: center;
  z-index: 2000;
}

/* Modal blanc centré */
.modal-content {
  background: linear-gradient(135deg, #fff, #f5f5f5);
  border-radius: 20px;
  padding: 40px;
  color: #007BFF;
  text-align: center;
  width: 350px;
  max-width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-item {
  color: #007BFF;
  text-decoration: none;
  font-size: 20px;
  font-weight: 600;
  display: block;
  margin: 15px 0;
  padding: 12px 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(0, 123, 255, 0.05);
}

.modal-item:hover {
  background: #007BFF;
  color: white;
  transform: translateX(5px);
  text-decoration: none;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
}

/* Responsive */
@media (max-width: 992px) {
  .marquee-content {
    font-size: 20px;
  }
  
  .clock-time {
    font-size: 20px;
  }
  
  .clock-container {
    min-width: 130px;
  }
}

@media (max-width: 768px) {
  .app-topstrip {
    padding: 0 10px;
  }
  
  .marquee-content {
    font-size: 16px;
    animation-duration: 15s;
  }
  
  .clock-time {
    font-size: 16px;
  }
  
  .clock-timezone {
    font-size: 12px;
    padding: 2px 6px;
  }
  
  .clock-container {
    min-width: 100px;
    margin-right: 10px;
  }
  
  .clock {
    padding: 6px 12px;
  }
}
</style>