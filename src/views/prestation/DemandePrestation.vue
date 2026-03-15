<template>
  <div class="demande-prestation-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-file-text me-2 text-primary"></i>
            Demandes de prestations
          </h3>
          <p class="text-muted mb-0">Gérez les demandes de prestations des membres</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ demandePrestationStore.getterDemandePrestation.length }}
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
            placeholder="Rechercher par nom ou prénom..."
          />
        </div>
      </div>
      <div class="col-md-7">
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-primary btn-add" @click="showModal">
            <i class="bi bi-plus-lg me-2"></i>
            Nouvelle demande
          </button>
        </div>
      </div>
    </div>

    <!-- Onglets de statut -->
    <div class="tab-container mb-4">
      <div class="tab-buttons">
        <button
          class="tab-btn"
          :class="activeTab === 1 ? 'active warning' : ''"
          @click="activeTab = 1"
        >
          <i class="bi bi-clock-history me-2"></i>
          En cours
          <span class="tab-badge">{{ encoursTaile }}</span>
        </button>
        <button
          class="tab-btn"
          :class="activeTab === 2 ? 'active success' : ''"
          @click="activeTab = 2"
        >
          <i class="bi bi-check-circle me-2"></i>
          Acceptées
          <span class="tab-badge">{{ accepterTaile }}</span>
        </button>
        <button
          class="tab-btn"
          :class="activeTab === 3 ? 'active danger' : ''"
          @click="activeTab = 3"
        >
          <i class="bi bi-x-circle me-2"></i>
          Refusées
          <span class="tab-badge">{{ refuserTaile }}</span>
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
              <span class="card-label">Montant total (onglet)</span>
              <span class="card-value">{{ formatageMontant(totalMontant) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des demandes -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead class="table-header-custom">
            <tr>
              <th class="text-center">N°</th>
              <th>Bénéficiaire</th>
              <th>Contact</th>
              <th>Prestation</th>
              <th class="text-end">Montant</th>
              <th>Date demande</th>
              <th class="text-center">Fichier</th>
              <th class="text-center">Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredByTab.length > 0">
            <tr v-for="(item, index) in filteredByTab" :key="item.id" class="hover-effect">
              <td class="text-center">
                <span class="row-number">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
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
                  <span>{{ item.telephone || 'N/D' }}</span>
                </div>
              </td>
              <td>
                <span class="prestation-badge">{{ item.libelle || 'N/D' }}</span>
              </td>
              <td class="text-end montant">{{ formatageMontant(item.montant) }}</td>
              <td>{{ formatDate(item.date_demande) }}</td>
              <td class="text-center">
                <a
                  v-if="item.fichier"
                  :href="`${file_url}/${item.fichier}`"
                  target="_blank"
                  class="file-link"
                  :title="getFileName(item.fichier)"
                >
                  <i class="bi bi-file-earmark"></i>
                  <span>Fichier</span>
                </a>
                <span v-else class="text-muted">-</span>
              </td>
              <td class="text-center">
                <span 
                  v-if="item.statut == 1" 
                  class="status-badge pending"
                >
                  <i class="bi bi-clock-fill me-1"></i> En cours
                </span>
                <span 
                  v-else-if="item.statut == 2" 
                  class="status-badge success"
                >
                  <i class="bi bi-check-circle-fill me-1"></i> Accepté
                </span>
                <span 
                  v-else-if="item.statut == 3" 
                  class="status-badge rejected"
                >
                  <i class="bi bi-x-circle-fill me-1"></i> Refusé
                </span>
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button 
                    @click="showEditModalDecision(item.id)" 
                    class="btn-action warning" 
                    title="Prendre une décision"
                    v-if="item.statut == 1"
                  >
                    <i class="bi bi-check2-circle"></i>
                  </button>
                  <span v-else class="text-muted">-</span>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="9" class="empty-state">
                <i class="bi bi-file-text"></i>
                <p>Aucune demande de prestation trouvée</p>
              </td>
            </tr>
          </tbody>
          <tfoot class="table-footer" v-if="filteredByTab.length > 0">
            <tr>
              <td colspan="4" class="text-end fw-bold">TOTAL</td>
              <td class="text-end montant fw-bold">{{ formatageMontant(totalMontant) }}</td>
              <td colspan="4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Pagination centrée -->
      <div class="pagination-wrapper" v-if="demandePrestationList.length > itemsPerPage">
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
                <i class="bi bi-file-plus"></i>
              </div>
              <div>
                <h5 class="modal-title">Nouvelle demande</h5>
                <p class="modal-subtitle">Ajoutez une nouvelle demande de prestation</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Type de prestation -->
              <div class="form-group mb-4">
                <label class="form-label">
                  <i class="bi bi-grid-3x3-gap-fill me-2"></i>Type de prestation <span class="text-danger">*</span>
                </label>
                <select 
                  class="form-select" 
                  :class="{ 'is-invalid': $v.type_prestation_id.$error }" 
                  v-model="form.type_prestation_id"
                >
                  <option value="">Sélectionnez un type</option>
                  <option 
                    v-for="item in typePrestationStore.getterTypePrestation" 
                    :key="item.id" 
                    :value="item.id"
                  >
                    {{ item.libelle }} - {{ formatageMontant(item.montant) }} FCFA
                  </option>
                </select>
                <div class="invalid-feedback" v-if="$v.type_prestation_id.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Fichier -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-file-earmark me-2"></i>Document justificatif
                </label>
                <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
                  <input
                    type="file"
                    ref="fileInput"
                    class="file-input"
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    @change="onFileChange"
                  />
                  <div class="upload-placeholder" v-if="!previewfichier">
                    <i class="bi bi-cloud-arrow-up"></i>
                    <p>Glissez-déposez ou <span>cliquez</span> pour ajouter un fichier</p>
                    <small>Formats: PDF, PNG, JPG (max 5 Mo)</small>
                  </div>
                  <div class="upload-preview" v-else>
                    <i class="bi bi-file-check"></i>
                    <span>{{ form.fichier instanceof File ? form.fichier.name : 'Fichier sélectionné' }}</span>
                    <button type="button" class="remove-image" @click="removeImage">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
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

    <!-- Modal de décision amélioré -->
    <div
      class="modal fade"
      id="decisionModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefDecision"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon warning">
                <i class="bi bi-check2-circle"></i>
              </div>
              <div>
                <h5 class="modal-title">Décision sur la demande</h5>
                <p class="modal-subtitle">Prenez une décision sur cette demande</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Décision -->
              <div class="form-group mb-4">
                <label class="form-label">
                  <i class="bi bi-check-circle me-2"></i>Décision <span class="text-danger">*</span>
                </label>
                <div class="decision-buttons">
                  <button 
                    type="button"
                    class="decision-btn success"
                    :class="{ active: formEdit.statut == 2 }"
                    @click="formEdit.statut = 2"
                  >
                    <i class="bi bi-check-circle"></i>
                    Accepter
                  </button>
                  <button 
                    type="button"
                    class="decision-btn danger"
                    :class="{ active: formEdit.statut == 3 }"
                    @click="formEdit.statut = 3"
                  >
                    <i class="bi bi-x-circle"></i>
                    Refuser
                  </button>
                </div>
              </div>

              <!-- Motif (visible seulement si refus) -->
              <div class="form-group mb-3" v-if="formEdit.statut == 3">
                <label class="form-label">
                  <i class="bi bi-chat-left-text me-2"></i>Motif du refus
                </label>
                <textarea 
                  class="form-control" 
                  v-model="formEdit.observation"
                  rows="4"
                  placeholder="Veuillez indiquer la raison du refus..."
                ></textarea>
              </div>

              <!-- Récapitulatif -->
              <div class="info-card" v-if="selectedDemande">
                <div class="info-row">
                  <span class="info-label">Bénéficiaire</span>
                  <span class="info-value">{{ selectedDemande.nom }} {{ selectedDemande.prenom }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Prestation</span>
                  <span class="info-value">{{ selectedDemande.libelle }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Montant</span>
                  <span class="info-value montant">{{ formatageMontant(selectedDemande.montant) }} FCFA</span>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-2"></i>Annuler
            </button>
            <button 
              type="button" 
              class="btn btn-success" 
              @click="prestationDecision"
              :disabled="!formEdit.statut"
            >
              <i class="bi bi-check-lg me-2"></i>Valider la décision
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
import { useDemandePrestation } from '../../stores/prestation/demandePrestation'
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'
import { formatageMontant } from '../../config/utils'
import { toast } from 'vue3-toastify'
import { useTypePrestation } from '../../stores/prestation/typePrestation'

const demandePrestationStore = useDemandePrestation()
const typePrestationStore = useTypePrestation()
const searchTerm = ref('')
const activeTab = ref(1)

const file_url = import.meta.env.VITE_FILE_URL

const previewfichier = ref<string | null>(null)
const modalRef = ref<HTMLDivElement | null>(null)
const modalRefDecision = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const itemsPerPage = 10
const currentPage = ref(1)
const selectedDemande = ref<any>(null)

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

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const getFileName = (filePath: string) => {
  return filePath?.split('/').pop() || ''
}

interface DemandePrestation {
  id: number
  type_prestation_id: string
  libelle?: string
  fichier: File | string
  statut: number
  montant?: number
  observation?: string
}

const form = reactive<DemandePrestation>({
  id: 0,
  type_prestation_id: '',
  fichier: '',
  statut: 0,
  montant: 0
})

const formEdit = reactive<DemandePrestation>({
  id: 0,
  type_prestation_id: '',
  fichier: '',
  statut: 0,
  montant: 0,
  observation: ''
})

// Liste des demandes
const demandePrestationList = computed(() => demandePrestationStore.getterDemandePrestation || [])

// Pagination
const totalPages = computed(() => Math.ceil(demandePrestationList.value.length / itemsPerPage))

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

const paginatedDemandePrestation = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return demandePrestationList.value.slice(start, end)
})

const filteredDemande = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return paginatedDemandePrestation.value
  return paginatedDemandePrestation.value.filter(demande =>
    [demande.libelle, demande.nom, demande.prenom].some(field =>
      field?.toLowerCase().includes(q)
    )
  )
})

const filteredByTab = computed(() => {
  return filteredDemande.value.filter(item => item.statut === activeTab.value)
})

const encoursTaile = computed(() => {
  return demandePrestationList.value.filter(item => item.statut === 1).length
})

const accepterTaile = computed(() => {
  return demandePrestationList.value.filter(item => item.statut === 2).length
})

const refuserTaile = computed(() => {
  return demandePrestationList.value.filter(item => item.statut === 3).length
})

const totalMontant = computed(() => {
  return filteredByTab.value.reduce((sum, item) => sum + (item.montant || 0), 0)
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
    form.type_prestation_id = ''
    form.fichier = ''
    previewfichier.value = null
    $v.value.$reset()
    const modalInstance = new Modal(modalRef.value)
    modalInstance.show()
  }
}

const closeModal = () => {
  const modal = Modal.getInstance(modalRef.value)
  if (modal) modal.hide()
}

const closeModalDecision = () => {
  const modal = Modal.getInstance(modalRefDecision.value)
  if (modal) modal.hide()
}

const removeImage = () => {
  previewfichier.value = null
  form.fichier = ''
}

const AjouterFonctionLocal = async () => {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      isLoading.value = true
      const formData = new FormData()
      formData.append('type_prestation_id', form.type_prestation_id)
      formData.append('statut', '1')
      if (form.fichier && form.fichier instanceof File) {
        formData.append('fichier', form.fichier)
      }
      await demandePrestationStore.AjouterDemandePrestation(formData)
      isLoading.value = false
      closeModal()
      toast.success("Demande ajoutée avec succès")
    } catch (error) {
      console.error("Echec d'enregistrement:", error)
      isLoading.value = false
      toast.error("Erreur lors de l'ajout")
    }
  }
}

const prestationDecision = async () => {
  if (!formEdit.statut) {
    toast.warning("Veuillez sélectionner une décision")
    return
  }

  if (formEdit.statut == 3 && !formEdit.observation) {
    toast.warning("Veuillez indiquer le motif du refus")
    return
  }

  try {
    isLoading.value = true
    await demandePrestationStore.decisionPrestation(formEdit)
    isLoading.value = false
    closeModalDecision()
    toast.success("Décision enregistrée")
  } catch (error) {
    console.error("Erreur:", error)
    isLoading.value = false
    toast.error("Erreur lors de l'enregistrement")
  }
}

const showEditModalDecision = (id: number) => {
  const data = demandePrestationStore.getterDemandePrestation.find((item) => item.id === id)

  if (data) {
    selectedDemande.value = data
    formEdit.id = data.id
    formEdit.type_prestation_id = data.type_prestation_id
    formEdit.fichier = data.fichier
    formEdit.statut = 0
    formEdit.observation = ''

    if (modalRefDecision.value) {
      const modalInstance = new Modal(modalRefDecision.value)
      modalInstance.show()
    }
  }
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
  const maxSizeInMB = 5
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024

  if (!validFileTypes.includes(file.type)) {
    toast.error("Type de fichier non pris en charge")
    return
  }

  if (file.size > maxSizeInBytes) {
    toast.error(`Le fichier ne doit pas dépasser ${maxSizeInMB} Mo`)
    return
  }

  if (previewfichier.value) URL.revokeObjectURL(previewfichier.value)
  previewfichier.value = URL.createObjectURL(file)
  form.fichier = file
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
    if (!validFileTypes.includes(file.type)) {
      toast.error("Type de fichier non pris en charge")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 5 Mo")
      return
    }
    if (previewfichier.value) URL.revokeObjectURL(previewfichier.value)
    previewfichier.value = URL.createObjectURL(file)
    form.fichier = file
  }
}

const rules = {
  type_prestation_id: { required },
}
const $v = useVuelidate(rules, form)

onMounted(async () => {
  try {
    isLoading.value = true
    await typePrestationStore.getTypePrestation()
    await demandePrestationStore.getDemandePrestation()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.demande-prestation-page {
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
  border-color: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
  outline: none;
}

/* Add button */
.btn-add {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  border: none;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

/* Tab container */
.tab-container {
  background: white;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.tab-buttons {
  display: flex;
  gap: 10px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.tab-btn.active.warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
}

.tab-btn.active.success {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.tab-btn.active.danger {
  background: linear-gradient(135deg, #ef4444, #f87171);
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
  background: linear-gradient(135deg, #f59e0b, #fbbf24) !important;
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
  color: #f59e0b;
  font-size: 0.9rem;
}

/* Prestation badge */
.prestation-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

/* Montant */
.montant {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #f59e0b;
}

/* File link */
.file-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  color: #475569;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.file-link:hover {
  background: #f59e0b;
  color: white;
}

.file-link i {
  font-size: 1rem;
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

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-badge.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.rejected {
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

.btn-action.warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
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
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
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
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-icon.warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
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

/* Decision buttons */
.decision-buttons {
  display: flex;
  gap: 15px;
}

.decision-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.decision-btn.success:hover,
.decision-btn.success.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.decision-btn.danger:hover,
.decision-btn.danger.active {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.decision-btn.active {
  border-width: 2px;
}

/* Info card */
.info-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 15px;
  margin-top: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #64748b;
  font-weight: 500;
}

.info-value {
  font-weight: 600;
  color: #1e293b;
}

.info-value.montant {
  color: #f59e0b;
}

/* Upload area */
.upload-area {
  position: relative;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #f59e0b;
  background: #f1f5f9;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  color: #64748b;
}

.upload-placeholder i {
  font-size: 2.5rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.upload-placeholder p {
  margin: 0 0 5px;
  font-size: 0.95rem;
}

.upload-placeholder p span {
  color: #f59e0b;
  font-weight: 600;
}

.upload-placeholder small {
  font-size: 0.8rem;
  color: #94a3b8;
}

.upload-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #e2e8f0;
  padding: 10px 15px;
  border-radius: 8px;
}

.upload-preview i {
  font-size: 1.5rem;
  color: #f59e0b;
}

.remove-image {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image:hover {
  transform: scale(1.1);
  background: #dc2626;
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
  .demande-prestation-page {
    padding: 10px;
  }
  
  .tab-buttons {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    flex: 1;
    justify-content: center;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .decision-buttons {
    flex-direction: column;
  }
}
</style>