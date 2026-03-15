<template>
  <div class="caisse-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-wallet2 me-2 text-primary"></i>
            Gestion des dépenses
          </h3>
          <p class="text-muted mb-0">Suivez et gérez les dépenses du bureau</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ caisseStore.getterCaisse.length }}
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
            placeholder="Rechercher par libellé ou montant..."
          />
        </div>
      </div>
      <div class="col-md-7 text-end">
        <button type="button" class="btn btn-primary btn-add" @click="showModal">
          <i class="bi bi-plus-lg me-2"></i>
          Nouvelle dépense
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
              <span class="card-label">Montant total</span>
              <span class="card-value">{{ formatMontant(totalMontant) }} FCFA</span>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="summary-card frais">
            <div class="card-icon">
              <i class="bi bi-receipt"></i>
            </div>
            <div class="card-content">
              <span class="card-label">Total frais</span>
              <span class="card-value">{{ formatMontant(totalFrais) }} FCFA</span>
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
              <span class="card-value">{{ formatMontant(totalGlobal) }} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des dépenses -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead class="table-header-custom">
            <tr>
              <th class="text-center">N°</th>
              <th>Libellé</th>
              <th class="text-end">Montant</th>
              <th class="text-end">Frais</th>
              <th class="text-end">Total</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredCaisse.length > 0">
            <tr v-for="(item, index) in filteredCaisse" :key="item.id" class="hover-effect">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td>
                <span class="libelle-text">{{ item.libelle }}</span>
              </td>
              <td class="text-end montant">{{ formatMontant(item.montant) }}</td>
              <td class="text-end frais">{{ formatMontant(item.frais || 0) }}</td>
              <td class="text-end total">{{ formatMontant(totalParDepense(item.id)) }}</td>
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
              <td colspan="6" class="empty-state">
                <i class="bi bi-wallet2"></i>
                <p>Aucune dépense trouvée</p>
              </td>
            </tr>
          </tbody>
          <tfoot class="table-footer" v-if="filteredCaisse.length > 0">
            <tr>
              <td colspan="2" class="text-end fw-bold">TOTAL</td>
              <td class="text-end montant fw-bold">{{ formatMontant(totalMontant) }}</td>
              <td class="text-end frais fw-bold">{{ formatMontant(totalFrais) }}</td>
              <td class="text-end total fw-bold">{{ formatMontant(totalGlobal) }}</td>
              <td></td>
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
                <h5 class="modal-title">Nouvelle dépense</h5>
                <p class="modal-subtitle">Ajoutez une nouvelle dépense</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Libellé -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-tag me-2"></i>Libellé <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v.libelle.$error }"
                  type="text"
                  placeholder="Ex: Fournitures de bureau"
                  v-model="form.libelle"
                />
                <div class="invalid-feedback" v-if="$v.libelle.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Montant -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-cash me-2"></i>Montant <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">FCFA</span>
                  <input
                    class="form-control"
                    :class="{ 'is-invalid': $v.montant.$error }"
                    type="number"
                    placeholder="Ex: 50000"
                    v-model="form.montant"
                    min="0"
                    step="100"
                  />
                </div>
                <div class="invalid-feedback" v-if="$v.montant.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Frais -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-receipt me-2"></i>Frais (optionnel)
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">FCFA</span>
                  <input
                    class="form-control"
                    type="number"
                    placeholder="Ex: 2500"
                    v-model="form.frais"
                    min="0"
                    step="100"
                  />
                </div>
                <small class="text-muted">Laissez vide si aucun frais supplémentaire</small>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-2"></i>Annuler
            </button>
            <button type="button" class="btn btn-primary" @click="AjouterFonctionLocal">
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
                <h5 class="modal-title">Modifier la dépense</h5>
                <p class="modal-subtitle">Modifiez les informations de la dépense</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Libellé -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-tag me-2"></i>Libellé <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.libelle.$error }"
                  type="text"
                  placeholder="Ex: Fournitures de bureau"
                  v-model="formEdit.libelle"
                />
                <div class="invalid-feedback" v-if="$v_edit.libelle.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Montant -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-cash me-2"></i>Montant <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">FCFA</span>
                  <input
                    class="form-control"
                    :class="{ 'is-invalid': $v_edit.montant.$error }"
                    type="number"
                    placeholder="Ex: 50000"
                    v-model="formEdit.montant"
                    min="0"
                  />
                </div>
                <div class="invalid-feedback" v-if="$v_edit.montant.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Frais -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-receipt me-2"></i>Frais
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">FCFA</span>
                  <input
                    class="form-control"
                    type="number"
                    placeholder="Ex: 2500"
                    v-model="formEdit.frais"
                    min="0"
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-2"></i>Annuler
            </button>
            <button type="button" class="btn btn-success" @click="ModifierFonctionLocal">
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
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ref, reactive, onMounted, computed } from 'vue'
import { useCaisse } from '../../stores/bureau/caisse'
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'

const caisseStore = useCaisse()

const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const searchTerm = ref('')

interface Caisse {
  id?: number
  montant: number
  libelle: string
  frais: number
}

const form = reactive<Caisse>({
  id: 0,
  montant: 0,
  libelle: '',
  frais: 0,
})

const formEdit = reactive<Caisse>({
  id: 0,
  montant: 0,
  libelle: '',
  frais: 0,
})

// Formatage des montants
const formatMontant = (val: number) => {
  if (!val && val !== 0) return "0"
  return new Intl.NumberFormat("fr-FR").format(val)
}

// Total par dépense
const totalParDepense = (id: number) => {
  const item = filteredCaisse.value.find(c => c.id === id)
  if (!item) return 0
  return (item.montant || 0) + (item.frais || 0)
}

// Totaux calculés
const totalMontant = computed(() =>
  filteredCaisse.value.reduce((sum, item) => sum + (item.montant || 0), 0)
)

const totalFrais = computed(() =>
  filteredCaisse.value.reduce((sum, item) => sum + (item.frais || 0), 0)
)

const totalGlobal = computed(() => totalMontant.value + totalFrais.value)

// Filtrage
const filteredCaisse = computed(() => {
  if (!searchTerm.value) return caisseStore.getterCaisse

  const keyword = searchTerm.value.toLowerCase()
  return caisseStore.getterCaisse.filter(item =>
    item.libelle?.toLowerCase().includes(keyword) ||
    item.montant.toString().includes(keyword)
  )
})

// Modals
const showModal = () => {
  if (modalRef.value) {
    form.libelle = ''
    form.montant = 0
    form.frais = 0
    $v.value.$reset()
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

function annulerChamp() {
  $v.value.$reset()
  form.libelle = ''
  form.montant = 0
  form.frais = 0
}

function AjouterFonctionLocal() {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      isLoading.value = true
      caisseStore.AjouterCaisse(form).then(() => {
        isLoading.value = false
        closeModal()
        annulerChamp()
        Swal.fire({
          title: 'Succès!',
          text: 'La dépense a été ajoutée.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      })
    } catch (error) {
      console.error("Echec d'enregistrement:", error)
      isLoading.value = false
      Swal.fire({
        title: 'Erreur!',
        text: "Une erreur est survenue.",
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }
}

function ModifierFonctionLocal() {
  $v_edit.value.$touch()
  if (!$v_edit.value.$invalid) {
    try {
      isLoading.value = true
      caisseStore.modifierCaisse(formEdit).then(() => {
        isLoading.value = false
        closeModal()
        Swal.fire({
          title: 'Succès!',
          text: 'La dépense a été modifiée.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      })
    } catch (error) {
      console.error('Modification failed:', error)
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
}

const showEditModal = (id: number) => {
  const data = caisseStore.getterCaisse.find((item) => item.id === id)

  if (data) {
    formEdit.id = data.id
    formEdit.montant = data.montant
    formEdit.frais = data.frais || 0
    formEdit.libelle = data.libelle

    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    }
  }
}

function supprimer(id: number) {
  Swal.fire({
    title: 'Confirmation de suppression',
    text: 'Êtes-vous sûr de vouloir supprimer cette dépense ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      caisseStore.supprimerCaisse(id)
      Swal.fire({
        title: 'Supprimé!',
        text: 'La dépense a été supprimée.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

// Validations
const rules = {
  montant: { required },
  libelle: { required },
}
const $v = useVuelidate(rules, form)

const rules_edit = {
  montant: { required },
  libelle: { required },
}
const $v_edit = useVuelidate(rules_edit, formEdit)

onMounted(async () => {
  try {
    isLoading.value = true
    await caisseStore.getCaisse()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.caisse-page {
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

/* Add button */
.btn-add {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #3a7bd5, #2c3e50);
  border: none;
  box-shadow: 0 4px 15px rgba(58, 123, 213, 0.3);
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(58, 123, 213, 0.4);
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

.summary-card.frais {
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
  background: rgba(58, 123, 213, 0.1);
  color: #3a7bd5;
}

.summary-card.frais .card-icon {
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

/* Libellé */
.libelle-text {
  font-weight: 500;
  color: #1e293b;
}

/* Montants */
.montant {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #3a7bd5;
}

.frais {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #f59e0b;
}

.total {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #10b981;
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
  background: linear-gradient(135deg, #3a7bd5, #2c3e50);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 5px 15px rgba(58, 123, 213, 0.4);
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

/* Form validation */
.is-invalid {
  border-color: #ef4444 !important;
}

.invalid-feedback {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* Responsive */
@media (max-width: 768px) {
  .caisse-page {
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