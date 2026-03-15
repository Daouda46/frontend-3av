<template>
  <div class="loan-timeline">
    <Loader :isLoading="isLoading" />
    <h1 class="title">Suivi de votre prêt</h1>
    <div class="timeline-container">
      <!-- Ligne de la timeline -->
      <div class="timeline-line"></div>
      
      <!-- Étape 1 - Accepté -->
      <div class="timeline-step accepted">
        <div class="step-indicator">
          <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="step-content">
          <span class="status-badge current" v-if="pretEncours.statut ==1">Encours</span>
          <span class="status-badge accepted" v-if="pretEncours.statut ==2">Accepté</span>
          <span class="status-badge" style="color:red" v-if="pretEncours.statut ==3">Réjeter</span>
          <h3>Président</h3>
          <p v-if="pretEncours.statut ==1">Votre demande de prêt est encours de traitement</p>
          <p v-if="pretEncours.statut ==2">Votre demande de prêt a été validée</p>
          <p v-if="pretEncours.statut ==3">Votre demande de prêt a été refusée</p>
          <div v-if="pretEncours.date_president" class="step-date"> {{pretEncours.date_president}} </div>
          <div v-else class="step-date"> En traitement </div>
        </div>
      </div>
      
      <!-- Étape 2 - En cours -->
      <div class="timeline-step current">
        <div class="step-indicator">2</div>
        <div class="step-content">
          <span class="status-badge accepted" v-if="pretEncours.position ==2">Validé</span>
          <span v-if="pretEncours.position ==1" class="status-badge current">En attente</span>
          <h3>{{pretEncours.nom_prenom}}</h3>
          <p v-if="pretEncours.position ==2">Transfert des fonds vers votre compte effectué</p>
          <p v-else>Transfert des fonds vers votre compte</p>
           <div v-if="pretEncours.position ==2" class="step-date"> {{pretEncours.date_adherent}} </div>
          <div v-else-if="pretEncours.position ==1" class="step-date"> En attente</div>
          <!-- <div v-else class="step-date"> En traitement </div> -->
        </div>
      </div>
      
      <!-- Étape 3 - En attente -->
      <div class="timeline-step pending">
        <div class="step-indicator">3</div>
        <div class="step-content">
          <span class="status-badge pending" v-if="pretEncours.position ==1">A venir</span>
          <span class="status-badge pending" v-if="pretEncours.position ==2">En cours</span>
          <span class="status-badge pending" v-if="pretEncours.position ==3">Accepté</span>
          <h3>Trésorier</h3>
          <p>Début des échéances de Décaissement</p>
          <div class="step-date" v-if="pretEncours.position ==1">À venir</div>
          <div class="step-date" v-if="pretEncours.position ==2">En attente</div>
          <div class="step-date" v-if="pretEncours.position ==3">{{pretEncours.date_tresorie}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted,computed } from 'vue';
import {usePret} from '../../stores/finance/pret'
import Loader from "../../components/Loader.vue";

const pretStore = usePret();

const isLoading = ref(false);


const pretEncours = computed(() => {
  let data = pretStore.getterSuiviPret.find(item => item.encours === 1);
  if (data) {
    return data;
  }
  return [];
});

onMounted(async () => {
  try {
    isLoading.value = true;
    await pretStore.getSuiviPret();
  } catch (error) {
    console.error('Erreur lors du chargement des fonctions:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.loan-timeline {
  font-family: 'Segoe UI', system-ui, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  text-align: center;
  color: #2d3748;
  margin-bottom: 2.0rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.timeline-container {
  position: relative;
  padding-left: 3rem;
}

.timeline-line {
  position: absolute;
  left: 1.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e2e8f0;
  transform: translateX(-50%);
}

.timeline-step {
  position: relative;
  margin-bottom: 2.5rem;
}

.timeline-step:last-child {
  margin-bottom: 0;
}

.step-indicator {
  position: absolute;
  left: -3rem;
  top: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  z-index: 2;
}

.timeline-step.accepted .step-indicator {
  background-color: #10b981; /* Vert */
}

.timeline-step.current .step-indicator {
  background-color: #3b82f6; /* Bleu */
}

.timeline-step.pending .step-indicator {
  background-color: #94a3b8; /* Gris */
}

.step-content {
  padding: 1.25rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-left: 4px solid transparent;
}

.timeline-step.accepted .step-content {
  border-left-color: #10b981;
}

.timeline-step.current .step-content {
  border-left-color: #3b82f6;
}

.timeline-step.pending .step-content {
  border-left-color: #94a3b8;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.status-badge.accepted {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.current {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge.pending {
  background-color: #f1f5f9;
  color: #475569;
}

.step-content h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
}

.step-content p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.step-date {
  margin-top: 0.75rem;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
}

.check-icon {
  width: 1rem;
  height: 1rem;
}
</style>