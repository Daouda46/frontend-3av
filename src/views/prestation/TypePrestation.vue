<template>
  <div class="type-prestation-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-grid-3x3-gap-fill me-2 text-primary"></i>
            Types de prestations
          </h3>
          <p class="text-muted mb-0">Gérez les différents types de prestations</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ typePrestationStore.getterTypePrestation.length }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche et bouton d'ajout -->
    <div class="row align-items-center mb-4 g-3">
      <div class="col-md-6">
        <div class="search-wrapper">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search-input"
            placeholder="Rechercher par code ou libellé..."
          />
        </div>
      </div>
      <div class="col-md-6 text-end">
        <button type="button" class="btn btn-primary btn-add" @click="showModal">
          <i class="bi bi-plus-lg me-2"></i>
          Nouveau type
        </button>
      </div>
    </div>

    <!-- Tableau des types de prestations -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead class="table-header-custom">
            <tr>
              <th class="text-center">N°</th>
              <th>Code</th>
              <th>Libellé</th>
              <th class="text-end">Montant (FCFA)</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredTypePrestation.length > 0">
            <tr v-for="(item, index) in filteredTypePrestation" :key="item.id" class="hover-effect">
              <td class="text-center">
                <span class="row-number">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
              </td>
              <td>
                <span class="code-badge">{{ item.code }}</span>
              </td>
              <td>
                <span class="libelle-text">{{ item.libelle }}</span>
              </td>
              <td class="text-end">
                <span class="montant-badge">{{ formatageMontant(item.montant) }}</span>
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
              <td colspan="5" class="empty-state">
                <i class="bi bi-grid-3x3-gap"></i>
                <p>Aucun type de prestation trouvé</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination centrée -->
      <div class="pagination-wrapper" v-if="typePrestationList.length > itemsPerPage">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="prevPage" aria-label="Précédent">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li 
              v-for="page in displayedPages" 
              :key="page" 
              class="page-item" 
              :class="{ active: currentPage === page }"
            >
              <a 
                v-if="page !== '...'" 
                class="page-link" 
                href="#" 
                @click.prevent="goToPage(page)"
              >
                {{ page }}
              </a>
              <span v-else class="page-link dots">...</span>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="nextPage" aria-label="Suivant">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
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
                <h5 class="modal-title">Nouveau type de prestation</h5>
                <p class="modal-subtitle">Ajoutez un nouveau type de prestation</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Code (généré automatiquement) -->
              <div class="form-group mb-4">
                <label class="form-label">
                  <i class="bi bi-code-slash me-2"></i>Code
                </label>
                <div class="code-display">
                  <span class="generated-code">{{ generatedCode || '________' }}</span>
                  <span class="code-hint">Généré automatiquement</span>
                </div>
              </div>

              <!-- Libellé -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-type me-2"></i>Libellé <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v.libelle.$error }"
                  type="text"
                  placeholder="Ex: Consultation, Hospitalisation, etc."
                  v-model="form.libelle"
                />
                <div class="invalid-feedback" v-if="$v.libelle.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Montant -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-cash me-2"></i>Montant (FCFA)
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">FCFA</span>
                  <input
                    class="form-control"
                    type="number"
                    placeholder="Ex: 50000"
                    v-model="form.montant"
                    min="0"
                    step="1000"
                  />
                </div>
                <small class="text-muted">Laissez vide si aucun montant fixe</small>
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
                <h5 class="modal-title">Modifier le type de prestation</h5>
                <p class="modal-subtitle">Modifiez les informations du type</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Code (lecture seule) -->
              <div class="form-group mb-4">
                <label class="form-label">
                  <i class="bi bi-code-slash me-2"></i>Code
                </label>
                <div class="code-display">
                  <span class="generated-code">{{ formEdit.code }}</span>
                  <span class="code-hint">Code unique</span>
                </div>
              </div>

              <!-- Libellé -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-type me-2"></i>Libellé <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.libelle.$error }"
                  type="text"
                  placeholder="Ex: Consultation, Hospitalisation, etc."
                  v-model="formEdit.libelle"
                />
                <div class="invalid-feedback" v-if="$v_edit.libelle.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Montant -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-cash me-2"></i>Montant (FCFA)
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">FCFA</span>
                  <input
                    class="form-control"
                    type="number"
                    placeholder="Ex: 50000"
                    v-model="formEdit.montant"
                    min="0"
                    step="1000"
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useTypePrestation } from '../../stores/prestation/typePrestation'
import Swal from 'sweetalert2'
import { formatageMontant } from '../../config/utils'
import Loader from '../../components/Loader.vue'

const searchTerm = ref('')
const typePrestationStore = useTypePrestation()

interface TypePrestation {
  id?: number
  montant?: number
  code: string
  libelle: string
}

const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const itemsPerPage = 10
const currentPage = ref(1)

const form = reactive<TypePrestation>({
  id: 0,
  code: '',
  libelle: '',
  montant: 0,
})

const formEdit = reactive<TypePrestation>({
  id: 0,
  code: '',
  libelle: '',
  montant: 0,
})

// Génération automatique du code
const generatedCode = computed(() => {
  if (form.libelle) {
    const base = form.libelle.trim().substring(0, 4).toUpperCase()
    const existingCodes = typePrestationStore.getterTypePrestation.map(t => t.code)
    let counter = 1
    let uniqueCode = base
    
    while (existingCodes.includes(uniqueCode)) {
      uniqueCode = base + counter
      counter++
    }
    
    return uniqueCode
  }
  return ''
})

// Liste des types
const typePrestationList = computed(() => typePrestationStore.getterTypePrestation || [])

// Nombre total de pages
const totalPages = computed(() => Math.ceil(typePrestationList.value.length / itemsPerPage))

// Pages affichées avec gestion des "..."
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

// Types paginés
const paginatedTypePrestation = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return typePrestationList.value.slice(start, end)
})

// Types filtrés
const filteredTypePrestation = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  let filtered = typePrestationList.value

  if (q) {
    filtered = filtered.filter(item =>
      item.code?.toLowerCase().includes(q) ||
      item.libelle?.toLowerCase().includes(q)
    )
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

// Réinitialiser la page quand on recherche
watch(searchTerm, () => {
  currentPage.value = 1
})

// Fonctions de pagination
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const showModal = () => {
  if (modalRef.value) {
    form.libelle = ''
    form.montant = 0
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
}

function annulerChampEdit() {
  $v_edit.value.$reset()
  formEdit.libelle = ''
  formEdit.montant = 0
}

function AjouterFonctionLocal() {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      let objet = {
        code: generatedCode.value,
        libelle: form.libelle,
        montant: form.montant || 0,
        id: 0
      }
      isLoading.value = true
      typePrestationStore.AjouterTypePrestation(objet).then(() => {
        isLoading.value = false
        closeModal()
        annulerChamp()
        Swal.fire({
          title: 'Succès!',
          text: 'Le type de prestation a été ajouté.',
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
      typePrestationStore.modifierTypePrestation(formEdit).then(() => {
        isLoading.value = false
        closeModal()
        annulerChampEdit()
        Swal.fire({
          title: 'Succès!',
          text: 'Le type de prestation a été modifié.',
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
  const data = typePrestationStore.getterTypePrestation.find((item) => item.id === id)

  if (data) {
    formEdit.id = data.id
    formEdit.code = data.code
    formEdit.libelle = data.libelle
    formEdit.montant = data.montant

    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    }
  }
}

function supprimer(id: number) {
  Swal.fire({
    title: 'Confirmation de suppression',
    text: 'Êtes-vous sûr de vouloir supprimer ce type de prestation ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      typePrestationStore.supprimerTypePrestation(id)
      Swal.fire({
        title: 'Supprimé!',
        text: 'Le type de prestation a été supprimé.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

const rules = {
  libelle: { required },
}
const $v = useVuelidate(rules, form)

const rules_edit = {
  libelle: { required },
}
const $v_edit = useVuelidate(rules_edit, formEdit)

onMounted(async () => {
  try {
    isLoading.value = true
    await typePrestationStore.getTypePrestation()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.type-prestation-page {
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

/* Table wrapper */
.table-wrapper {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

/* En-tête de tableau coloré */
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

/* Code badge */
.code-badge {
  display: inline-block;
  padding: 5px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #8b5cf6;
  font-family: 'Courier New', monospace;
}

/* Libellé text */
.libelle-text {
  font-weight: 500;
  color: #1e293b;
}

/* Montant badge */
.montant-badge {
  display: inline-block;
  padding: 5px 15px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(16, 185, 129, 0.3);
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

/* Pagination */
.pagination-wrapper {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
  justify-content: center;
}

.page-item .page-link {
  border: none;
  border-radius: 8px !important;
  padding: 8px 12px;
  color: #475569;
  font-weight: 500;
  font-size: 0.9rem;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  min-width: 38px;
  text-align: center;
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: white;
  box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3);
}

.page-item:not(.active):not(.disabled) .page-link:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
}

.page-item.disabled .page-link {
  background: #f1f5f9;
  color: #cbd5e1;
  cursor: not-allowed;
}

.page-link.dots {
  background: transparent;
  box-shadow: none;
  cursor: default;
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

/* Code display */
.code-display {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.generated-code {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: #8b5cf6;
  letter-spacing: 1px;
}

.code-hint {
  font-size: 0.8rem;
  color: #64748b;
  font-style: italic;
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
  .type-prestation-page {
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
  
  .modal-dialog {
    margin: 10px;
  }
  
  .code-display {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>