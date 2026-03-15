<template>
<Loader :isLoading="isLoading" />
  <div class="container mt-5">
    <!-- En-tête avec bouton Ajouter -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Mes emprunts</h2>
      <button @click="openModal" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>Ajouter
      </button>
    </div>

    <!-- Liste des emprunts -->
    <div class="table-responsive" style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
      <table class="table table-hover align-middle">
      <thead class="table-dark" style="background-color: #3a7bd5; color: white;">
       <tr>
          <th class="p-1 border" style="text-align:center">N°</th>
          <th class="p-1 border" style="text-align:center">Nom</th>
          <th class="p-1 border" style="text-align:center">Prénom</th>
          <th class="p-1 border" style="text-align:center">Montant (FCFA)</th>
          <th class="p-1 border" style="text-align:center">Montant Total (FCFA)</th>
          <th class="p-1 border" style="text-align:center">Contact</th>
          <th class="p-1 border" style="text-align:center">Mode de Paiement</th>
          <th class="p-1 border" style="text-align:center">Date emprunt</th>
          <th class="p-1 border" style="text-align:center">Durée</th>
          <th class="p-1 border" style="text-align:center">Statut</th>
          <th class="p-1 border" style="text-align:center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in pretStore.getterPret" :key="item.id">
          <td class="fw-semibold">{{ index + 1 }}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <span>{{ item.nom }}</span>
            </div>
          </td>
          <td>
            <span class="d-flex" style="margin-left:20%" >
              {{ item.prenom }}
            </span>
          </td>
          <td>
            <span class="d-flex" style="margin-left:40%" >
              {{ formatageMontant(item.montant) }}
            </span>
          </td>
          <td>
            <span class="d-flex" style="margin-left:40%" >
              {{ formatageMontant(item.montant_total) }}
            </span>
          </td>
          <td>
            <span class="d-flex" style="margin-left:20%" >
              {{ item.contact }}
            </span>
          </td>
          <td>
            <span class="d-flex" style="margin-left:30%" >
              {{ item.mode_paiement }}
            </span>
          </td>
          <td>
            <span  style="margin-left:20%" >
              {{ item.date_emprunt }}
            </span>
          </td>
          <td>
            <span  style="margin-left:%" >
              {{calculerDureeFromCustomFormat(item.date_emprunt)}}
            </span>
          </td>
          <td v-if="item.statut ==1" style="background-color:orange;text-align:center;border-radius:5px;color:#fff">
            <span >
            Encours
            </span>
          </td>
          <td v-if="item.statut ==2" style="background-color:green;text-align:center;border-radius:5px;color:#fff">
            <span   >
            Accepter
            </span>
          </td>
          <td v-if="item.statut ==3" style="background-color:red;text-align:center;border-radius:5px;color:#fff">
            <span    >
            Refuser
            </span>
          </td>
          
          <td class="text-center">
            <div class="btn-group btn-group-md">
              
              <button :disabled='item.statut!=1' @click="showEditModal(item.id)" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-pencil-square"></i> Modifier
                </button>
               
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    </div>

    <!-- Modal pour ajouter un emprunt -->
    <div class="modal fade" id="loanModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content ">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" style="padding-left:12%">Formulaire de demande du prêt</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitLoan">
              <!-- Montant maximum (grisé) -->
              <div class="mb-3">
                <label class="form-label">Montant maximum disponible</label>
                <input
                  type="text"
                  class="form-control bg-light"
                  :value="formatNumber(maxAmount)"
                  readonly
                />
              </div>

              <!-- Montant du prêt -->
              <div class="mb-3">
                <label class="form-label">Montant du prêt <span style="color:red">*</span> </label>
                <input
                  type="number"
                  class="form-control"
                  v-model="form.amount"
                  @input="validateAmount"
                  required
                  min="1000"
                  :max="maxAmount"
                />
                <div class="form-text" style="color:red">Vous ne pouvez emprunter au déla de  {{ formatNumber(maxAmount) }} FCFA</div>
              </div>

              <!-- Montant total avec intérêt (grisé) -->
              <div class="mb-3">
                <label class="form-label">Montant total à rembourser (taux 7%)</label>
                <input
                  type="text"
                  class="form-control bg-light"
                  :value="formatNumber(form.totalAmount)"
                  readonly
                />
              </div>

              <!-- Durée -->
              <div class="mb-3">
                <label class="form-label">Durée de remboursement <span style="color:red">*</span></label>
                <div class="d-flex gap-4">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="oneQuarter"
                      value="1"
                      v-model="form.quarters"
                      required
                    />
                    <label class="form-check-label" for="oneQuarter">1 trimestre</label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="twoQuarters"
                      value="2"
                      v-model="form.quarters"
                    />
                    <label class="form-check-label" for="twoQuarters">2 trimestres</label>
                  </div>
                </div>
              </div>

              <!-- Mode de paiement -->
             <div class="mb-3">
    <label class="form-label">Mode de paiement <span style="color:red">*</span></label>
    <div class="d-flex flex-wrap gap-3">
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="orange"
          value="Orange CI"
          v-model="form.paymentMethod"
          @change="updatePhonePrefix"
          required
        />
        <label class="form-check-label" for="orange">
          <i class="bi bi-phone me-1"></i> Orange CI
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="mtn"
          value="MTN CI"
          v-model="form.paymentMethod"
          @change="updatePhonePrefix"
        />
        <label class="form-check-label" for="mtn">
          <i class="bi bi-phone me-1"></i> MTN CI
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="moov"
          value="MOOV CI"
          v-model="form.paymentMethod"
          @change="updatePhonePrefix"
        />
        <label class="form-check-label" for="moov">
          <i class="bi bi-phone me-1"></i> MOOV CI
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="wave"
          value="WAVE CI"
          v-model="form.paymentMethod"
          @change="updatePhonePrefix"
        />
        <label class="form-check-label" for="wave">
          <i class="bi bi-wallet me-1"></i> WAVE CI
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="cash"
          value="CASH"
          v-model="form.paymentMethod"
          @change="updatePhonePrefix"
        />
        <label class="form-check-label" for="cash">
          <i class="bi bi-cash-coin me-1"></i> CASH
        </label>
      </div>
    </div>
  </div>

              <!-- Numéro de téléphone -->
              <div class="mb-3">
                <label class="form-label">Numéro de téléphone *</label>
                <div class="input-group">
                  <span v-if="phonePrefix && form.paymentMethod !== 'CASH'" class="input-group-text">{{ phonePrefix }}</span>
                  <input
                    type="tel"
                    class="form-control"
                    v-model="form.phoneNumber"
                    :disabled="form.paymentMethod === 'CASH'"
                    :class="{ 'bg-light': form.paymentMethod === 'CASH' }"
                    :required="form.paymentMethod !== 'CASH'"
                    :placeholder="form.paymentMethod === 'CASH' ? 'Non requis' : ''"
                  />
                </div>
                <div v-if="form.paymentMethod === 'CASH'" class="form-text">Aucun numéro requis pour paiement en cash</div>
              </div>

              <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Modal } from 'bootstrap'
 import {usePret} from '../../stores/finance/pret'
import Swal from 'sweetalert2'
import {formatageMontant} from '../../config/utils'
import Loader from "../../components/Loader.vue";

const isLoading = ref(false);
const pretStore = usePret();
// Données
const maxAmount = ref(500000)
const loans = ref([])
const phonePrefix = ref('')
const form = ref({
  amount: '',
  totalAmount: 0,
  quarters: '1',
  paymentMethod: '',
  phoneNumber: '',
  date: new Date()
})

function calculerDureeFromCustomFormat(dateStr) {
  if (!dateStr || !/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    return "Date invalide (format attendu: DD-MM-YYYY)";
  }

  try {
    // Convertir "DD-MM-YYYY" en "YYYY-MM-DD" pour le parsing correct
    const [day, month, year] = dateStr.split('-');
    const dateISO = `${year}-${month}-${day}`; // Format reconnu par `new Date()`
    const dateDebut = new Date(dateISO);
    const dateFin = new Date();

    // Vérifier si la date est valide
    if (isNaN(dateDebut.getTime())) {
      return "Date invalide";
    }

    // Vérifier si la date est dans le futur
    if (dateDebut > dateFin) {
      return "Date future";
    }

    // Calcul de la durée (années, mois, jours)
    let annees = dateFin.getFullYear() - dateDebut.getFullYear();
    let mois = dateFin.getMonth() - dateDebut.getMonth();
    let jours = dateFin.getDate() - dateDebut.getDate();

    // Ajustement des jours négatifs
    if (jours < 0) {
      const derniersJoursMois = new Date(
        dateFin.getFullYear(),
        dateFin.getMonth(),
        0
      ).getDate();
      jours += derniersJoursMois;
      mois--;
    }

    // Ajustement des mois négatifs
    if (mois < 0) {
      mois += 12;
      annees--;
    }

    // Formatage du résultat
    const parties = [];
    if (annees > 0) parties.push(`${annees} an${annees > 1 ? 's' : ''}`);
    if (mois > 0) parties.push(`${mois} mois`);
    if (jours > 0 || parties.length === 0) {
      parties.push(`${jours} jour${jours > 1 ? 's' : ''}`);
    }

    return parties.join(' ') || '0 jour';
  } catch (error) {
    console.error("Erreur de calcul:", error);
    return "Erreur";
  }
}
let loanModal = null

onMounted(async () => {
    // Initialiser le modal Bootstrap
 loanModal = new Modal(document.getElementById('loanModal'))
 
 // Charger les emprunts existants (simulation)
 loadLoans()
  try {
    isLoading.value = true;
    await pretStore.getPret();
  } catch (error) {
    console.error('Erreur lors du chargement des fonctions:', error);
  } finally {
    isLoading.value = false;
  }
});
const getMaxLength = () => {
  return 10 - phonePrefix.value.length
}

const formatPhoneNumber = (event) => {
  // Ne garder que les chiffres
  let value = event.target.value.replace(/\D/g, '')
  
  // Limiter la longueur selon le préfixe
  const maxLength = getMaxLength()
  if (value.length > maxLength) {
    value = value.substring(0, maxLength)
  }
  
  form.value.phoneNumber = value
}
// Charger les emprunts (simulation)
const loadLoans = () => {
  // En réalité, vous feriez une requête API ici
  loans.value = [
    {
      id: 1,
      amount: 100000,
      totalAmount: 107000,
      quarters: 1,
      paymentMethod: 'Orange CI',
      phoneNumber: '07123456',
      date: '2023-05-15'
    },
    {
      id: 2,
      amount: 200000,
      totalAmount: 214000,
      quarters: 2,
      paymentMethod: 'MTN CI',
      phoneNumber: '05123456',
      date: '2023-06-20'
    }
  ]
}

// Ouvrir le modal
const openModal = () => {
  resetForm()
  loanModal.show()
}

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    amount: '',
    totalAmount: 0,
    quarters: '1',
    paymentMethod: '',
    phoneNumber: '',
    date: new Date()
  }
  phonePrefix.value = ''
}

// Calcul du montant total avec intérêt
const calculateTotalAmount = () => {
  if (form.value.amount) {
    const interest = form.value.amount * 0.07
    form.totalAmount.value = Math.round(Number(form.value.amount) + interest)
  } else {
    form.value.totalAmount = 0
  }
}

// Mise à jour du préfixe téléphonique
const updatePhonePrefix = () => {
  switch (form.value.paymentMethod) {
    case 'Orange CI':
      phonePrefix.value = '07'
      break
    case 'MTN CI':
      phonePrefix.value = '05'
      break
    case 'MOOV CI':
      phonePrefix.value = '01'
      break
    case 'WAVE CI':
      phonePrefix.value = ''
      break
    case 'CASH':
      phonePrefix.value = ''
      form.value.phoneNumber = ''
      break
    default:
      phonePrefix.value = ''
  }
}

// Formatage des nombres
const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

// Formatage de la date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

// Soumission du formulaire
const submitLoan = () => {
      try {
        const newLoan = {
    id: loans.value.length > 0 ? Math.max(...loans.value.map(l => l.id)) + 1 : 1,
    montant: Number(form.value.amount),
    montant_total: form.value.totalAmount,
    trimestre: Number(form.value.quarters),
    mode_paiement: form.value.paymentMethod,
    contact: form.value.paymentMethod !== 'CASH' 
      ? `${phonePrefix.value}${form.value.phoneNumber}`
      : null,
  } 
      isLoading.value = true;
      pretStore.AjouterPret(newLoan).then(() => {
          isLoading.value = false;
           closeModal();
        });     
    } catch (error) {
      console.error("Login failed:", error);
      isLoading.value = false;
    }
  

  loanModal.hide()
  
  // Ici vous feriez normalement une requête API pour enregistrer
  console.log('Nouvel emprunt:', newLoan)
}

// Supprimer un emprunt
const deleteLoan = (id) => {
  if (confirm('Voulez-vous vraiment supprimer cet emprunt ?')) {
    loans.value = loans.value.filter(loan => loan.id !== id)
    // Ici vous feriez normalement une requête API pour supprimer
  }
}
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}

.btn-primary {
  padding: 8px 16px;
}

.modal-header {
  border-radius: 0;
}

.form-control:read-only {
  background-color: #f8f9fa;
}

.input-group-text {
  min-width: 40px;
}

.bi {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .d-flex.gap-4 {
    gap: 1rem !important;
  }
  
  .table-responsive {
    font-size: 0.9rem;
  }
}
/* Style de l'en-tête du tableau */
.table-dark {
    --bs-table-bg: #3a7bd5;
    --bs-table-striped-bg: #3a7bd5;
    --bs-table-striped-color: #fff;
    --bs-table-active-bg: #3a7bd5;
    --bs-table-active-color: #fff;
    --bs-table-hover-bg: #3a7bd5;
    --bs-table-hover-color: #fff;
    color: white;
    border-color: #3a7bd5;
}

/* Dégradé pour l'en-tête (optionnel) */
.table-dark {
    background: linear-gradient(to right, #3a7bd5, #00d2ff);
}

/* Style des cellules de l'en-tête */
.table-dark th {
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.85rem;
}

/* Style au survol des cellules de l'en-tête */
.table-dark th:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transition: background-color 0.3s ease;
}
</style>