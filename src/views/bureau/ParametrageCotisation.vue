<template>
  <div class="cotisations-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-piggy-bank me-2 text-primary"></i>
            Gestion des cotisations
          </h3>
          <p class="text-muted mb-0">Gérez les cotisations par trimestre</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ cotisationStore.getterCotisation.length }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- Barre de recherche et bouton d'ajout -->
    <div class="row align-items-center mb-4 g-3">
      <div class="col-md-5">
        <div class="search-wrapper">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search-input"
            placeholder="Rechercher par année ou trimestre..."
          />
        </div>
      </div>
      <div class="col-md-7 text-end">
        <button type="button" class="btn btn-primary btn-add" @click="showModal">
          <i class="bi bi-plus-lg me-2"></i>
          Nouvelle cotisation
        </button>
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
              <span class="card-label"> Cotisations</span>
              <span class="card-value">{{ formatageMontant(totalCotisations) }} FCFA</span>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="summary-card exceptionnelle">
            <div class="card-icon">
              <i class="bi bi-star"></i>
            </div>
            <div class="card-content">
              <span class="card-label">Total exceptionnel</span>
              <span class="card-value">{{ formatageMontant(cotisationExceptionnelle) }} FCFA</span>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="summary-card global">
            <div class="card-icon">
              <i class="bi bi-piggy-bank"></i>
            </div>
            <div class="card-content">
              <span class="card-label">Total général</span>
              <span class="card-value">{{ formatageMontant(totalGeneral) }} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des cotisations -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead class="table-header-custom">
            <tr>
              <th class="text-center">N°</th>
              <th>Année</th>
              <th>Trimestre</th>
              <th class="text-end">Cotisation</th>
              <th class="text-end">Exceptionnelle</th>
              <th class="text-center">Nbre <br> retraite</th>
              <th class="text-center">Nbre <br> décès</th>
              <th class="text-end">Total</th>
              <th class="text-center">Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredCotisation.length > 0">
            <tr v-for="(item, index) in filteredCotisation" :key="item.id" class="hover-effect">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td>
                <span class="annee-badge">{{ item.annee }}</span>
              </td>
              <td>
                <span class="trimestre-badge">{{ item.trimestre }}</span>
              </td>
              <td class="text-end montant">{{ formatageMontant(item.cotisation) }}</td>
              <td class="text-end exceptionnel">{{ formatageMontant(item.montant) }}</td>
              <td class="text-center">
                <span class="badge-count">{{ item.nbre_retraite }}</span>
              </td>
              <td class="text-center">
                <span class="badge-count">{{ item.nbre_deces }}</span>
              </td>
              <td class="text-end total">{{ formatageMontant(item.total) }}</td>
              <td class="text-center">
                <span v-if="item.encours == 1" class="status-badge active">
                  <i class="bi bi-check-circle-fill me-1"></i> En cours
                </span>
                <span v-else class="status-badge inactive">
                  <i class="bi bi-x-circle-fill me-1"></i> Clôturé
                </span>
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button @click="showEditModal(item.id)" class="btn-action info" title="Modifier">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button @click="supprimer(item.id)" class="btn-action danger" title="Supprimer">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10" class="empty-state">
                <i class="bi bi-piggy-bank"></i>
                <p>Aucune cotisation trouvée</p>
              </td>
            </tr>
          </tbody>
          <tfoot class="table-footer" v-if="filteredCotisation.length > 0">
            <tr>
              <td colspan="3" class="text-end fw-bold">TOTAUX</td>
              <td class="text-end montant fw-bold">{{ formatageMontant(totalCotisations) }}</td>
              <td class="text-end exceptionnel fw-bold">{{ formatageMontant(totalExceptionnel) }}</td>
              <td class="text-center fw-bold">{{ totalRetraites }}</td>
              <td class="text-center fw-bold">{{ totalDeces }}</td>
              <td class="text-end total fw-bold">{{ formatageMontant(totalGeneral) }}</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Modal d'ajout amélioré -->
    <div
      class="modal fade"
      id="addModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="bi bi-plus-circle"></i>
              </div>
              <div>
                <h5 class="modal-title">Nouvelle cotisation</h5>
                <p class="modal-subtitle">Ajoutez une cotisation trimestrielle</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Année -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-calendar me-2"></i>Année
                </label>
                <select class="form-select" v-model="form.annee_id">
                  <option value="">Sélectionnez une année</option>
                  <option v-for="item in exerciceStore.getterExerciceBudgetaire" :key="item.id" :value="item.id">
                    {{ item.annee }}
                  </option>
                </select>
              </div>

              <!-- Trimestre -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-layout-three-columns me-2"></i>Trimestre
                </label>
                <select class="form-select" v-model="form.trimestre_id">
                  <option value="">Sélectionnez un trimestre</option>
                  <option v-for="item in trimestreParAnnee" :key="item.id" :value="item.id">
                    Trimestre {{ item.trimestre }} - {{ item.annee }}
                  </option>
                </select>
              </div>

              <!-- Cotisation ordinaire -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-cash me-2"></i>Cotisation ordinaire
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">FCFA</span>
                  <input
                    type="text"
                    class="form-control bg-light"
                    :value="formatageMontant(form.cotisation)"
                    readonly
                  />
                </div>
                <small class="text-muted">Montant fixe: 10 000 FCFA</small>
              </div>

              <!-- Nbre retraités -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-person-standing"></i>
                  Nombre de retraités
                </label>
                <input
                  type="number"
                  class="form-control"
                  v-model="form.nbre_retraite"
                  min="0"
                  placeholder="Ex: 5"
                />
              </div>

              <!-- Nbre décès -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-person-fill-x"></i>
                  Nombre de décès
                </label>
                <input
                  type="number"
                  class="form-control"
                  v-model="form.nbre_deces"
                  min="0"
                  placeholder="Ex: 2"
                />
              </div>

              <!-- Aperçu total -->
              <div class="preview-card">
                <div class="preview-row">
                  <span>Cotisation ordinaire:</span>
                  <span>{{ formatageMontant(form.cotisation) }} FCFA</span>
                </div>
                <div class="preview-row">
                  <span>Part exceptionnelle:</span>
                  <span>{{ formatageMontant(form.nbre_retraite * 5000 + form.nbre_deces * 5000) }} FCFA</span>
                </div>
                <div class="preview-row total">
                  <span>Total à prévoir:</span>
                  <span>{{ formatageMontant(form.cotisation + (form.nbre_retraite + form.nbre_deces) * 5000) }} FCFA</span>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-2"></i>Annuler
            </button>
            <button type="button" class="btn btn-primary" @click="ajouterExercice">
              <i class="bi bi-check-lg me-2"></i>Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de modification amélioré -->
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEdit"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="bi bi-pencil-square"></i>
              </div>
              <div>
                <h5 class="modal-title">Modifier la cotisation</h5>
                <p class="modal-subtitle">Modifiez les informations de la cotisation</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Année -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-calendar me-2"></i>Année
                </label>
                <select class="form-select" v-model="formData.annee_id">
                  <option value="">Sélectionnez une année</option>
                  <option v-for="item in exerciceStore.getterExerciceBudgetaire" :key="item.id" :value="item.id">
                    {{ item.annee }}
                  </option>
                </select>
              </div>

              <!-- Trimestre -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-layout-three-columns me-2"></i>Trimestre
                </label>
                <select class="form-select" v-model="formData.trimestre_id">
                  <option value="">Sélectionnez un trimestre</option>
                  <option v-for="item in trimestreParAnneeEdit" :key="item.id" :value="item.id">
                    Trimestre {{ item.trimestre }} - {{ item.annee }}
                  </option>
                </select>
              </div>

              <!-- Cotisation ordinaire -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-cash me-2"></i>Cotisation ordinaire
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">FCFA</span>
                  <input
                    type="text"
                    class="form-control bg-light"
                    :value="formatageMontant(formData.cotisation)"
                    readonly
                  />
                </div>
              </div>

              <!-- Nbre retraités -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-person-standing"></i>
                  Nombre de retraités
                </label>
                <input
                  type="number"
                  class="form-control"
                  v-model="formData.nbre_retraite"
                  min="0"
                />
              </div>

              <!-- Nbre décès -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-person-fill-x"></i>
                  Nombre de décès
                </label>
                <input
                  type="number"
                  class="form-control"
                  v-model="formData.nbre_deces"
                  min="0"
                />
              </div>

              <!-- Aperçu total -->
              <div class="preview-card">
                <div class="preview-row">
                  <span>Cotisation ordinaire:</span>
                  <span>{{ formatageMontant(formData.cotisation) }} FCFA</span>
                </div>
                <div class="preview-row">
                  <span>Part exceptionnelle:</span>
                  <span>{{ formatageMontant(formData.nbre_retraite * 5000 + formData.nbre_deces * 5000) }} FCFA</span>
                </div>
                <div class="preview-row total">
                  <span>Total:</span>
                  <span>{{ formatageMontant(formData.cotisation + (formData.nbre_retraite + formData.nbre_deces) * 5000) }} FCFA</span>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-2"></i>Annuler
            </button>
            <button type="button" class="btn btn-success" @click="modifierExercice">
              <i class="bi bi-check-lg me-2"></i>Modifier
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
import { useExerciceBudgetaireStore } from '../../stores/parametrage/exerciceBudgetaire'
import { useTrimestreStore } from '../../stores/parametrage/trimestre'
import { useCotisation } from '../../stores/bureau/cotisation'
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'
import { formatageMontant } from '../../config/utils'

const cotisationStore = useCotisation()
const trimestreStore = useTrimestreStore()
const exerciceStore = useExerciceBudgetaireStore()
const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const searchTerm = ref('')

const form = reactive({
  annee_id: 0,
  trimestre_id: 0,
  cotisation: 10000,
  nbre_deces: 0,
  nbre_retraite: 0,
})

const formData = reactive({
  annee_id: 0,
  trimestre_id: 0,
  cotisation: 10000,
  nbre_deces: 0,
  nbre_retraite: 0,
  id: 0,
})

const cotisationExceptionnelle = computed(() => {
  return cotisationStore.getterCotisation
    .filter(item => item.encours === 1)
    .reduce((total, item) => {
      return total + ((item.nbre_retraite + item.nbre_deces) * item.montant)
    }, 0)
})
// Totaux calculés
const totalCotisations = computed(() => 
  cotisationStore.getterCotisation.filter(item =>item.encours ==1).reduce((sum, item) => sum + (item.cotisation || 0), 0)
)

const totalExceptionnel = computed(() => 
  cotisationStore.getterCotisation.reduce((sum, item) => sum + (item.montant || 0), 0)
)

const totalGeneral = computed(() => 
  cotisationExceptionnelle.value + totalCotisations.value
)

const totalRetraites = computed(() => 
  cotisationStore.getterCotisation.reduce((sum, item) => sum + (item.nbre_retraite || 0), 0)
)

const totalDeces = computed(() => 
  cotisationStore.getterCotisation.reduce((sum, item) => sum + (item.nbre_deces || 0), 0)
)

// Filtres
const trimestreParAnnee = computed(() => {
  return trimestreStore.getterTrimestre.filter(
    item => String(item.annee) === String(trouveAnnee.value)
  )
})

const trimestreParAnneeEdit = computed(() => {
  return trimestreStore.getterTrimestre.filter(
    item => String(item.annee) === String(trouveAnneeEdit.value)
  )
})

const trouveAnneeEdit = computed(() => {
  const year = exerciceStore.getterExerciceBudgetaire.find(
    item => String(item.id) === String(formData.annee_id)
  )
  return year?.annee || 0
})

const trouveAnnee = computed(() => {
  const year = exerciceStore.getterExerciceBudgetaire.find(
    item => String(item.id) === String(form.annee_id)
  )
  return year?.annee || 0
})

const filteredCotisation = computed(() => {
  if (!searchTerm.value) return cotisationStore.getterCotisation

  const keyword = searchTerm.value.toLowerCase()
  return cotisationStore.getterCotisation.filter(item =>
    item.annee?.toString().includes(keyword) ||
    item.trimestre?.toString().includes(keyword)
  )
})

const showModal = () => {
  if (modalRef.value) {
    form.annee_id = 0
    form.trimestre_id = 0
    form.nbre_deces = 0
    form.nbre_retraite = 0
    const modalInstance = new Modal(modalRef.value)
    modalInstance.show()
  }
}

const closeModal = () => {
  const modal = Modal.getInstance(modalRef.value)
  const modalEdit = Modal.getInstance(modalRefEdit.value)
  if (modal) modal.hide()
  if (modalEdit) modalEdit.hide()
}

function supprimer(id: number) {
  Swal.fire({
    title: 'Confirmation de suppression',
    text: 'Êtes-vous sûr de vouloir supprimer cette cotisation ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      cotisationStore.supprimerCotisation(id)
      Swal.fire({
        title: 'Supprimé!',
        text: 'La cotisation a été supprimée.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

const showEditModal = (id: number) => {
  const d_data = cotisationStore.getterCotisation.find((item) => item.id === id)

  if (d_data) {
    formData.annee_id = d_data.annee_id
    formData.trimestre_id = d_data.trimestre_id
    formData.cotisation = d_data.cotisation
    formData.nbre_deces = d_data.nbre_deces
    formData.nbre_retraite = d_data.nbre_retraite
    formData.id = d_data.id

    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    }
  }
}

function ajouterExercice() {
  try {
    isLoading.value = true
    cotisationStore.AjouterCotisation(form).then(() => {
      isLoading.value = false
      closeModal()
      Swal.fire({
        title: 'Succès!',
        text: 'La cotisation a été ajoutée.',
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

function modifierExercice() {
  try {
    isLoading.value = true
    cotisationStore.modifierCotisation(formData).then(() => {
      isLoading.value = false
      closeModal()
      Swal.fire({
        title: 'Succès!',
        text: 'La cotisation a été modifiée.',
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

onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      cotisationStore.getCotisation(),
      trimestreStore.getTrimestre(),
      exerciceStore.getExerciceBudgetaire()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.cotisations-page {
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
  border-color: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
  outline: none;
}

/* Add button */
.btn-add {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border: none;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
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
  border-left: 4px solid #8b5cf6;
}

.summary-card.exceptionnelle {
  border-left: 4px solid #f59e0b;
}

.summary-card.global {
  border-left: 4px solid #10b981;
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
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.summary-card.exceptionnelle .card-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.summary-card.global .card-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
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

/* En-tête de tableau - CONSERVÉ */
.table-header-custom {
  background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
  color: white;
}

.table-header-custom th {
  padding: 15px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: none;
  color: #000;
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

/* Badges */
.annee-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.trimestre-badge {
  display: inline-block;
  padding: 4px 12px;
  width: 140px;
  background: #8b5cf6;
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-count {
  display: inline-block;
  padding: 2px 10px;
  background: #e2e8f0;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

/* Montants */
.montant {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #8b5cf6;
}

.exceptionnel {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #f59e0b;
}

.total {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #10b981;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action:hover {
  transform: translateY(-2px);
}

.btn-action.info {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.btn-action.danger {
  background: linear-gradient(135deg, #ef4444, #f87171);
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
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
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
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

/* Preview card */
.preview-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 15px;
  margin-top: 20px;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.preview-row.total {
  border-bottom: none;
  font-weight: 700;
  color: #8b5cf6;
  font-size: 1.1rem;
}

/* Input group */
.input-group-text {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-right: none;
  border-radius: 12px 0 0 12px;
  color: #64748b;
  font-weight: 500;
}

.input-group .form-control {
  border-left: none;
  border-radius: 0 12px 12px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .cotisations-page {
    padding: 10px;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  .card-value {
    font-size: 1.2rem;
  }
  
  .modal-dialog {
    margin: 10px;
  }
}
</style>