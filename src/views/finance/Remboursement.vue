<template>
  <div class="remboursements-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-arrow-repeat me-2 text-primary"></i>
            Gestion des remboursements
          </h3>
          <p class="text-muted mb-0">Suivez l'état des remboursements de prêts</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ pretStore.getterRemboursement.length }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="row align-items-center mb-4 g-3">
      <div class="col-md-5">
        <div class="search-wrapper">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search-input"
            placeholder="Rechercher par nom, prénom ou contact..."
          />
        </div>
      </div>
      <div class="col-md-7">
        <div class="tab-buttons">
          <button
            class="tab-btn"
            :class="activeTab === 0 ? 'active warning' : ''"
            @click="activeTab = 0"
          >
            <i class="bi bi-clock-history me-2"></i>
            En cours
            <span class="tab-badge">{{ tailleRembEncours }}</span>
          </button>
          <button
            class="tab-btn"
            :class="activeTab === 1 ? 'active success' : ''"
            @click="activeTab = 1"
          >
            <i class="bi bi-check-circle me-2"></i>
            Payés
            <span class="tab-badge">{{ tailleDejaRemb }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Cartes de résumé -->
    <div class="summary-cards mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <div class="summary-card total">
            <div class="card-icon">
              <i class="bi bi-cash-stack"></i>
            </div>
            <div class="card-content">
              <span class="card-label">Montant total</span>
              <span class="card-value">{{ formatageMontant(totalMontant) }}</span>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="summary-card rembourse">
            <div class="card-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="card-content">
              <span class="card-label">Déjà remboursé</span>
              <span class="card-value">{{ formatageMontant(totalRembourse) }}</span>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="summary-card restant">
            <div class="card-icon">
              <i class="bi bi-hourglass-split"></i>
            </div>
            <div class="card-content">
              <span class="card-label">Reste à payer</span>
              <span class="card-value">{{ formatageMontant(totalRestant) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des remboursements -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead class="table-header-custom">
            <tr>
              <th class="text-center">N°</th>
              <th>Bénéficiaire</th>
              <th>Contact</th>
              <th>Mode</th>
              <th>Date emprunt</th>
              <th class="text-end">Montant total</th>
              <th class="text-end">Déjà remboursé</th>
              <th class="text-end">Reste</th>
              <th class="text-center">Taux</th>
              <th class="text-center">Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredByTab.length > 0">
            <tr v-for="(item, index) in filteredByTab" :key="item.id" class="hover-effect">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td>
                <div class="user-info">
                  <div class="user-avatar" :style="{ backgroundColor: getAvatarColor(item.nom) }">
                    {{ getInitials(item.nom, item.prenom) }}
                  </div>
                  <div>
                    <div class="user-name">{{ item.nom }} {{ item.prenom }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="contact-info">
                  <i class="bi bi-telephone"></i>
                  <span>{{ item.contact || 'N/D' }}</span>
                </div>
              </td>
              <td>
                <span class="payment-badge">{{ item.mode_paiement || 'N/D' }}</span>
              </td>
              <td>{{ formatDate(item.date_emprunt) }}</td>
              <td class="text-end montant">{{ formatageMontant(item.montant_total) }}</td>
              <td class="text-end montant-rembourse">{{ formatageMontant(item.montant_rembourser) }}</td>
              <td class="text-end montant-restant">{{ formatageMontant(soustraireMontants(item.montant_total, item.montant_rembourser)) }}</td>
              <td class="text-center">
                <div class="progress-indicator">
                  <div class="progress-bar-container">
                    <div 
                      class="progress-bar-fill" 
                      :style="{ width: calculTauxRemb(item.montant_total, item.montant_rembourser) + '%' }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ calculTauxRemb(item.montant_total, item.montant_rembourser) }}%</span>
                </div>
              </td>
              <td class="text-center">
                <span 
                  v-if="soustraireMontants(item.montant_total, item.montant_rembourser) == 0" 
                  class="status-badge success"
                >
                  <i class="bi bi-check-circle-fill me-1"></i> Payé
                </span>
                <span v-else class="status-badge pending">
                  <i class="bi bi-clock-fill me-1"></i> En cours
                </span>
              </td>
              <td class="text-center">
                <button 
                  title="Rembourser"
                  :disabled="soustraireMontants(item.montant_total, item.montant_rembourser) == 0"
                  @click="showEditModalRemb(item.pret_id)"
                  class="btn-action success"
                  :class="{ disabled: soustraireMontants(item.montant_total, item.montant_rembourser) == 0 }"
                >
                  <i class="bi bi-cash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="11" class="empty-state">
                <i class="bi bi-arrow-repeat"></i>
                <p>Aucun remboursement trouvé</p>
              </td>
            </tr>
          </tbody>
          <tfoot class="table-footer" v-if="filteredByTab.length > 0">
            <tr>
              <td colspan="5" class="text-end fw-bold">TOTAL</td>
              <td class="text-end montant fw-bold">{{ formatageMontant(totalMontant) }}</td>
              <td class="text-end montant-rembourse fw-bold">{{ formatageMontant(totalRembourse) }}</td>
              <td class="text-end montant-restant fw-bold">{{ formatageMontant(totalRestant) }}</td>
              <td class="text-center fw-bold">{{ tauxGlobal }}%</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Modal de remboursement amélioré -->
    <div
      class="modal fade"
      id="rembModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefRemb"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon success">
                <i class="bi bi-cash-stack"></i>
              </div>
              <div>
                <h5 class="modal-title">Nouveau remboursement</h5>
                <p class="modal-subtitle">Confirmez les informations de remboursement</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="remboursement-info">
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">
                    <i class="bi bi-person"></i>
                    Bénéficiaire
                  </span>
                  <span class="info-value">{{ formRemboursement.nom }} {{ formRemboursement.prenom }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">
                    <i class="bi bi-calendar"></i>
                    Date d'emprunt
                  </span>
                  <span class="info-value">{{ formatDate(formRemboursement.date_emprunt) }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">
                    <i class="bi bi-phone"></i>
                    Contact
                  </span>
                  <span class="info-value">{{ formRemboursement.contact }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">
                    <i class="bi bi-credit-card"></i>
                    Mode de paiement
                  </span>
                  <span class="info-value">{{ formRemboursement.mode_paiement }}</span>
                </div>
              </div>

              <div class="amount-card">
                <div class="amount-row">
                  <span class="amount-label">Trimestre à rembourser</span>
                  <span class="amount-badge">{{ formRemboursement.etape_remboursement }}</span>
                </div>
                <div class="amount-row highlight">
                  <span class="amount-label">Montant à payer</span>
                  <span class="amount-value">{{ formatageMontant(formRemboursement.montant_a_rembourser) }} FCFA</span>
                </div>
                <div class="amount-row">
                  <span class="amount-label">Date du jour</span>
                  <span class="amount-date">{{ dateDuJour(new Date()) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-2"></i>Annuler
            </button>
            <button type="button" class="btn btn-success" @click="functionRembourser">
              <i class="bi bi-check-lg me-2"></i>Confirmer le remboursement
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Modal } from 'bootstrap'
import { ref, reactive, onMounted, computed } from 'vue'
import { usePret } from '../../stores/finance/pret'
import { formatageMontant } from '../../config/utils'
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'
import { dateDuJour } from '../../config/utils'

const pretStore = usePret()
const searchTerm = ref('')
const modalRefRemb = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const activeTab = ref(0)

const formRemboursement = reactive({
  pret_id: 0,
  trimestre: 0,
  montant_a_rembourser: 0,
  montant_rembourser: 0,
  montant_total: 0,
  montant: 0,
  user_id: 0,
  etape_remboursement: '',
  date_emprunt: new Date(),
  nom: '',
  contact: '',
  mode_paiement: '',
  prenom: '',
})

// Utilitaires
const getInitials = (nom: string, prenom: string) => {
  return ((nom?.charAt(0) || '') + (prenom?.charAt(0) || '')).toUpperCase()
}

const getAvatarColor = (name: string) => {
  const colors = ['#4361ee', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6']
  let hash = 0
  for (let i = 0; i < (name?.length || 0); i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Computed
const tailleRembEncours = computed(() => {
  return filteredRemboursements.value.filter(item => item.statut === 0).length
})

const tailleDejaRemb = computed(() => {
  return filteredRemboursements.value.filter(item => item.statut === 1).length
})

const tauxGlobal = computed(() => {
  if (totalMontant.value === 0) return '0'
  return ((totalRembourse.value / totalMontant.value) * 100).toFixed(1)
})

const totalRembourse = computed(() =>
  filteredByTab.value.reduce((sum, item) => sum + Number(item.montant_rembourser || 0), 0)
)

const totalRestant = computed(() =>
  filteredByTab.value.reduce(
    (sum, item) => sum + soustraireMontants(item.montant_total, item.montant_rembourser),
    0
  )
)

const filteredByTab = computed(() => {
  return filteredRemboursements.value.filter(item => item.statut === activeTab.value)
})

const totalMontant = computed(() => {
  return filteredByTab.value.reduce((sum, item) => sum + item.montant_total, 0)
})

const filteredRemboursements = computed(() => {
  if (!searchTerm.value) return pretStore.getterRemboursement

  const keyword = searchTerm.value.toLowerCase()
  return pretStore.getterRemboursement.filter(
    (item) =>
      item.nom?.toLowerCase().includes(keyword) ||
      item.prenom?.toLowerCase().includes(keyword) ||
      item.contact?.toLowerCase().includes(keyword)
  )
})

// Fonctions utilitaires
function soustraireMontants(montant1: number, montant2: number) {
  const val1 = parseFloat(String(montant1)) || 0
  const val2 = parseFloat(String(montant2)) || 0
  return val1 - val2
}

function calculTauxRemb(montantTotal: number, montantRembourse: number) {
  if (montantTotal === 0) return 0
  return ((montantRembourse / montantTotal) * 100).toFixed(1)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const closeModal = () => {
  const modal = Modal.getInstance(modalRefRemb.value)
  if (modal) modal.hide()
}

function functionRembourser() {
  try {
    isLoading.value = true
    pretStore.AjouterRemboursement(formRemboursement).then(() => {
      isLoading.value = false
      closeModal()
      Swal.fire({
        title: 'Succès!',
        text: 'Le remboursement a été enregistré.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    })
  } catch (error) {
    console.error('Erreur:', error)
    isLoading.value = false
    Swal.fire({
      title: 'Erreur!',
      text: 'Une erreur est survenue.',
      icon: 'error',
      timer: 2000,
      showConfirmButton: false
    })
  }
}

const showEditModalRemb = (id: number) => {
  const data = pretStore.getterRemboursement.find((item) => item.pret_id === id)
  if (data) {
    Object.assign(formRemboursement, {
      pret_id: data.pret_id,
      montant_a_rembourser: data.montant_a_rembourser,
      trimestre: data.trimestre,
      etape_remboursement: data.etape_remboursement,
      nom: data.nom,
      prenom: data.prenom,
      date_emprunt: data.date_emprunt,
      user_id: data.user_id,
      contact: data.contact,
      mode_paiement: data.mode_paiement,
    })

    if (modalRefRemb.value) {
      const modalInstance = new Modal(modalRefRemb.value)
      modalInstance.show()
    }
  }
}

onMounted(async () => {
  try {
    isLoading.value = true
    await pretStore.getPret()
    await pretStore.getListeRemboursement()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.remboursements-page {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

/* Page header */
.page-header {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
}

/* Search bar */
.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 10;
}

.search-input {
  padding-left: 45px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #3a7bd5;
  box-shadow: 0 0 0 4px rgba(58, 123, 213, 0.1);
  outline: none;
}

/* Tab buttons */
.tab-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  background: white;
  color: #475569;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.tab-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.tab-btn.active.warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
}

.tab-btn.active.success {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.tab-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-left: 8px;
}

/* Summary cards */
.summary-cards {
  margin-bottom: 20px;
}

.summary-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

.summary-card.total {
  border-left: 4px solid #3a7bd5;
}

.summary-card.rembourse {
  border-left: 4px solid #10b981;
}

.summary-card.restant {
  border-left: 4px solid #f59e0b;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.summary-card.total .card-icon {
  background: rgba(58, 123, 213, 0.1);
  color: #3a7bd5;
}

.summary-card.rembourse .card-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.summary-card.restant .card-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.card-content {
  flex: 1;
}

.card-label {
  display: block;
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.card-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
}

/* Table wrapper */
.table-wrapper {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

/* En-tête de tableau */
.table-header-custom {
  background: linear-gradient(135deg, #3a7bd5, #2c3e50) !important;
  color: white;
}

.table-header-custom th {
  padding: 15px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: none;
  color: white;
  white-space: nowrap;
}

/* Modern table */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

.modern-table tbody tr {
  background: white;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.modern-table tbody tr.hover-effect:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  background: #f8fafc;
}

.modern-table td {
  padding: 15px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

/* Row number */
.row-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #f1f5f9;
  border-radius: 8px;
  font-weight: 600;
  color: #475569;
  font-size: 0.85rem;
}

/* User info */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: white;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-weight: 600;
  color: #1e293b;
}

/* Contact info */
.contact-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  white-space: nowrap;
}

.contact-info i {
  color: #3a7bd5;
  font-size: 0.9rem;
}

/* Payment badge */
.payment-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
}

/* Montants */
.montant {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #3a7bd5;
}

.montant-rembourse {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #10b981;
}

.montant-restant {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #f59e0b;
}

/* Progress indicator */
.progress-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
}

.progress-bar-container {
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  min-width: 40px;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

/* Action button */
.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action.success {
  background: linear-gradient(135deg, #10b981, #34d399);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

.btn-action:hover:not(.disabled) {
  transform: translateY(-2px);
}

.btn-action.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Table footer */
.table-footer {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
}

.table-footer td {
  color: white !important;
  padding: 15px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px !important;
}

.empty-state i {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 15px;
}

.empty-state p {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

/* Modal styles */
.modal-header {
  border-bottom: none;
  padding: 20px 25px 0;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.modal-icon {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-icon.success {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
}

.modal-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.modal-body {
  padding: 20px 25px;
}

.modal-footer {
  border-top: 1px solid #e2e8f0;
  padding: 20px 25px;
}

/* Info card dans le modal */
.remboursement-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-weight: 500;
}

.info-label i {
  color: #3a7bd5;
}

.info-value {
  font-weight: 600;
  color: #1e293b;
}

.amount-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  padding: 20px;
  color: white;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.amount-row.highlight {
  font-size: 1.2rem;
  font-weight: 700;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin: 10px 0;
  padding: 15px 0;
}

.amount-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.amount-value {
  font-size: 1.4rem;
  font-weight: 700;
}

.amount-date {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .remboursements-page {
    padding: 10px;
  }
  
  .tab-buttons {
    justify-content: flex-start;
  }
  
  .summary-card {
    padding: 15px;
  }
  
  .card-value {
    font-size: 1.2rem;
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .progress-indicator {
    min-width: 80px;
  }
}
</style>