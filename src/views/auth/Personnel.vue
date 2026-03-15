<template>
  <div class="membres-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-people-fill me-2 text-primary"></i>
            Gestion des membres
          </h3>
          <p class="text-muted mb-0">Liste complète des membres</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ personnelStore.getterPersonnel.length }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche et boutons d'action -->
    <div class="row align-items-center mb-4 g-3">
      <div class="col-md-5">
        <div class="search-wrapper">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control search-input"
            placeholder="Rechercher par nom, prénom ou matricule..."
          />
        </div>
      </div>
      <div class="col-md-7 text-end">
        <button type="button" class="btn btn-primary btn-add me-2" @click="showModal">
          <i class="bi bi-plus-lg me-2"></i>
          Nouveau membre
        </button>
        <button type="button" class="btn btn-secondary btn-import" @click="importPage">
          <i class="bi bi-file-earmark-excel me-2"></i>
          Importer
        </button>
      </div>
    </div>

    <!-- Tableau des membres -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead class="table-header-custom">
            <tr>
              <th class="text-center">N°</th>
              <th>Nom & Prénom</th>
              <th>Matricule</th>
              <th>Rôle</th>
              <th>Contact</th>
              <th>Service</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredPersonnel.length > 0">
            <tr v-for="(item, index) in filteredPersonnel" :key="item.id" class="hover-effect">
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
                    <div class="user-email">{{ item.email || 'Non renseigné' }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="matricule-badge">{{ item.matricule || 'N/D' }}</span>
              </td>
              <td>
                <span class="role-badge">{{ item.libelle_role || 'N/D' }}</span>
              </td>
              <td>
                <div class="contact-info">
                  <i class="bi bi-telephone-fill"></i>
                  <span>{{ item.telephone || 'N/D' }}</span>
                </div>
              </td>
              <td>
                <span class="service-badge">{{ item.libelle_service || 'N/D' }}</span>
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
              <td colspan="7" class="empty-state">
                <i class="bi bi-people"></i>
                <p>Aucun membre trouvé</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination centrée corrigée -->
      <div class="pagination-wrapper" v-if="!searchQuery.trim() && totalPages > 1">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <!-- Bouton Précédent -->
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="prevPage" aria-label="Précédent">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>

            <!-- Pages numérotées -->
            <li 
              v-for="(page, idx) in displayedPages" 
              :key="idx" 
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

            <!-- Bouton Suivant -->
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="nextPage" aria-label="Suivant">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modal d'ajout -->
    <div
      class="modal fade"
      id="addModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRef"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="bi bi-person-plus"></i>
              </div>
              <div>
                <h5 class="modal-title">Nouveau membre</h5>
                <p class="modal-subtitle">Ajoutez un nouveau membre à l'association</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="row g-4">
              <!-- Identité -->
              <div class="col-12">
                <h6 class="section-title">
                  <i class="bi bi-person-badge me-2"></i>Identité
                </h6>
                <hr class="mt-1 mb-3">
              </div>
              <div class="col-md-4">
                <label class="form-label">
                  Nom <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v.nom.$error }"
                  type="text"
                  placeholder="Ex: KOUASSI"
                  v-model="form.nom"
                />
                <div class="invalid-feedback" v-if="$v.nom.$error">
                  Ce champ est requis
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label">
                  Prénom <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v.prenom.$error }"
                  type="text"
                  placeholder="Ex: Jean"
                  v-model="form.prenom"
                />
                <div class="invalid-feedback" v-if="$v.prenom.$error">
                  Ce champ est requis
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Matricule <span class="text-danger">*</span></label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v.matricule.$error }"
                  type="text"
                  placeholder="Ex: EMP001"
                  v-model="form.matricule"
                />
                <div class="invalid-feedback" v-if="$v.matricule.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Contact -->
              <div class="col-12 mt-3">
                <h6 class="section-title">
                  <i class="bi bi-envelope me-2"></i>Contact
                </h6>
                <hr class="mt-1 mb-3">
              </div>
              <div class="col-md-4">
                <label class="form-label">Téléphone</label>
                <input
                  class="form-control"
                  type="text"
                  placeholder="Ex: 0708091011"
                  v-model="form.telephone"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Email</label>
                <input
                  class="form-control"
                  type="email"
                  placeholder="Ex: jean.kouassi@email.com"
                  v-model="form.email"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Section</label>
                <input
                  class="form-control"
                  type="text"
                  placeholder="Ex: A, B, C..."
                  v-model="form.section"
                />
              </div>

              <!-- Fonctions -->
              <div class="col-12 mt-3">
                <h6 class="section-title">
                  <i class="bi bi-briefcase me-2"></i>Affectations
                </h6>
                <hr class="mt-1 mb-3">
              </div>
              <div class="col-md-4">
                <label class="form-label">Rôle</label>
                <select class="form-select" v-model="form.role_id">
                  <option value="">Sélectionnez un rôle</option>
                  <option v-for="item in roleStore.getterRole" :key="item.id" :value="item.id">
                    {{ item.libelle }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Service</label>
                <model-list-select
                  :list="serviceStore.getterService"
                  v-model="form.service_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Sélectionnez un service"
                  class="form-select"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Fonction</label>
                <model-list-select
                  :list="fonctionStore.getterFonction"
                  v-model="form.fonction_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Sélectionnez une fonction"
                  class="form-select"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Emploi</label>
                <model-list-select
                  :list="emploiStore.getterEmploi"
                  v-model="form.emploi_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Sélectionnez un emploi"
                  class="form-select"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Grade</label>
                <select class="form-select" v-model="form.grade_id">
                  <option value="">Sélectionnez un grade</option>
                  <option v-for="item in gradeStore.getterGrade" :key="item.id" :value="item.id">
                    {{ item.libelle }}
                  </option>
                </select>
              </div>

              <!-- Photo -->
              <div class="col-12 mt-3">
                <h6 class="section-title">
                  <i class="bi bi-image me-2"></i>Photo
                </h6>
                <hr class="mt-1 mb-3">
              </div>
              <div class="col-md-6">
                <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
                  <input
                    type="file"
                    ref="fileInput"
                    class="file-input"
                    accept="image/png, image/jpeg, image/jpg"
                    @change="onFileChange"
                  />
                  <div class="upload-placeholder" v-if="!previewfichier">
                    <i class="bi bi-cloud-arrow-up"></i>
                    <p>Glissez-déposez ou <span>cliquez</span> pour ajouter une photo</p>
                    <small>Formats: PNG, JPG (max 20 Mo)</small>
                  </div>
                  <div class="upload-preview" v-else>
                    <img :src="previewfichier" alt="Aperçu">
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

    <!-- Modal de modification -->
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEdit"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="bi bi-pencil-square"></i>
              </div>
              <div>
                <h5 class="modal-title">Modifier le membre</h5>
                <p class="modal-subtitle">Modifiez les informations du membre</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="row g-4">
              <!-- Identité -->
              <div class="col-12">
                <h6 class="section-title">
                  <i class="bi bi-person-badge me-2"></i>Identité
                </h6>
                <hr class="mt-1 mb-3">
              </div>
              <div class="col-md-4">
                <label class="form-label">Nom <span class="text-danger">*</span></label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.nom.$error }"
                  type="text"
                  v-model="formEdit.nom"
                />
                <div class="invalid-feedback" v-if="$v_edit.nom.$error">
                  Ce champ est requis
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Prénom <span class="text-danger">*</span></label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.prenom.$error }"
                  type="text"
                  v-model="formEdit.prenom"
                />
                <div class="invalid-feedback" v-if="$v_edit.prenom.$error">
                  Ce champ est requis
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Matricule <span class="text-danger">*</span></label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.matricule.$error }"
                  type="text"
                  v-model="formEdit.matricule"
                />
                <div class="invalid-feedback" v-if="$v_edit.matricule.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Contact -->
              <div class="col-12 mt-3">
                <h6 class="section-title">
                  <i class="bi bi-envelope me-2"></i>Contact
                </h6>
                <hr class="mt-1 mb-3">
              </div>
              <div class="col-md-4">
                <label class="form-label">Téléphone</label>
                <input class="form-control" type="text" v-model="formEdit.telephone" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Email</label>
                <input class="form-control" type="email" v-model="formEdit.email" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Section</label>
                <input class="form-control" type="text" v-model="formEdit.section" />
              </div>

              <!-- Fonctions -->
              <div class="col-12 mt-3">
                <h6 class="section-title">
                  <i class="bi bi-briefcase me-2"></i>Affectations
                </h6>
                <hr class="mt-1 mb-3">
              </div>
              <div class="col-md-4">
                <label class="form-label">Rôle</label>
                <select class="form-select" v-model="formEdit.role_id">
                  <option value="">Sélectionnez un rôle</option>
                  <option v-for="item in roleStore.getterRole" :key="item.id" :value="item.id">
                    {{ item.libelle }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Service</label>
                <model-list-select
                  :list="serviceStore.getterService"
                  v-model="formEdit.service_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Sélectionnez un service"
                  class="form-select"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Fonction</label>
                <model-list-select
                  :list="fonctionStore.getterFonction"
                  v-model="formEdit.fonction_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Sélectionnez une fonction"
                  class="form-select"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Emploi</label>
                <model-list-select
                  :list="emploiStore.getterEmploi"
                  v-model="formEdit.emploi_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Sélectionnez un emploi"
                  class="form-select"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Grade</label>
                <select class="form-select" v-model="formEdit.grade_id">
                  <option value="">Sélectionnez un grade</option>
                  <option v-for="item in gradeStore.getterGrade" :key="item.id" :value="item.id">
                    {{ item.libelle }}
                  </option>
                </select>
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
import { Modal } from "bootstrap"
import useVuelidate from "@vuelidate/core"
import { required } from "@vuelidate/validators"
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { usePersonnel } from '../../stores/auth/personnel'
import { useFonction } from '../../stores/parametrage/fonction'
import Swal from 'sweetalert2'
import Loader from "../../components/Loader.vue"
import { useRole } from '../../stores/parametrage/role'
import { useGrade } from '../../stores/parametrage/grade'
import { useEmploi } from '../../stores/parametrage/emploi'
import { useService } from '../../stores/parametrage/service'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { ModelListSelect } from "vue-search-select"

const router = useRouter()
const personnelStore = usePersonnel()
const roleStore = useRole()
const fonctionStore = useFonction()
const gradeStore = useGrade()
const emploiStore = useEmploi()
const serviceStore = useService()

const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const previewfichier = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const searchQuery = ref('')
const itemsPerPage = 10
const currentPage = ref(1)

// Formulaires
const form = reactive({
  fichier: '' as File | string,
  id: 0,
  fonction_id: 0,
  emploi_id: 0,
  role_id: 0,
  service_id: 0,
  grade_id: 0,
  section: '',
  matricule: '',
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
})

const formEdit = reactive({
  id: 0,
  fonction_id: 0,
  service_id: 0,
  emploi_id: 0,
  role_id: 0,
  grade_id: 0,
  nom: '',
  section: '',
  matricule: '',
  prenom: '',
  email: '',
  telephone: '',
})

// Utilitaires
const getInitials = (nom: string, prenom: string) => {
  return ((nom?.charAt(0) || '') + (prenom?.charAt(0) || '')).toUpperCase()
}

const getAvatarColor = (name: string) => {
  const colors = [
    '#4361ee', '#3b82f6', '#06b6d4', '#10b981', 
    '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
  ]
  let hash = 0
  for (let i = 0; i < (name?.length || 0); i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Pagination et filtrage
const personnelList = computed(() => personnelStore.getterPersonnel || [])

const totalPages = computed(() => {
  return Math.ceil(personnelList.value.length / itemsPerPage)
})

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

const filteredPersonnel = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let filtered = personnelList.value

  if (q) {
    filtered = filtered.filter(person =>
      [person.nom, person.prenom, person.matricule].some(field =>
        (field || '').toLowerCase().includes(q)
      )
    )
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

// Réinitialiser la page quand on recherche
watch(searchQuery, () => {
  currentPage.value = 1
})

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

const importPage = () => {
  router.push({ name: "importMutualiste" })
}

const showModal = () => {
  if (modalRef.value) {
    Object.assign(form, {
      nom: '', prenom: '', matricule: '', telephone: '', email: '', section: '',
      role_id: 0, service_id: 0, fonction_id: 0, emploi_id: 0, grade_id: 0
    })
    previewfichier.value = null
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

const removeImage = () => {
  previewfichier.value = null
  form.fichier = ''
  if (fileInput.value) fileInput.value.value = ''
}

const AjouterFonctionLocal = async () => {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      isLoading.value = true
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'fichier' && value instanceof File) {
          formData.append('fichier', value)
        } else if (key !== 'fichier') {
          formData.append(key, String(value))
        }
      })
      await personnelStore.AjouterPersonnel(formData)
      isLoading.value = false
      closeModal()
      toast.success("Membre ajouté avec succès")
    } catch (error) {
      console.error("Echec d'enregistrement:", error)
      isLoading.value = false
      toast.error("Erreur lors de l'ajout")
    }
  }
}

const ModifierFonctionLocal = () => {
  $v_edit.value.$touch()
  if (!$v_edit.value.$invalid) {
    try {
      isLoading.value = true
      personnelStore.modifierPersonnel(formEdit).then(() => {
        isLoading.value = false
        closeModal()
        toast.success("Membre modifié avec succès")
      })
    } catch (error) {
      console.error("Modification failed:", error)
      isLoading.value = false
      toast.error("Erreur lors de la modification")
    }
  }
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error("Veuillez sélectionner une image valide")
    return
  }

  if (file.size > 20 * 1024 * 1024) {
    toast.error("L'image ne doit pas dépasser 20 Mo")
    return
  }

  if (previewfichier.value) URL.revokeObjectURL(previewfichier.value)
  previewfichier.value = URL.createObjectURL(file)
  form.fichier = file
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez déposer une image valide")
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 20 Mo")
      return
    }
    if (previewfichier.value) URL.revokeObjectURL(previewfichier.value)
    previewfichier.value = URL.createObjectURL(file)
    form.fichier = file
  }
}

const showEditModal = (id: number) => {
  const data = personnelStore.getterPersonnel.find((item) => item.id === id)
  if (data) {
    Object.assign(formEdit, {
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email || '',
      matricule: data.matricule || '',
      fonction_id: data.fonction_id || 0,
      emploi_id: data.emploi_id || 0,
      grade_id: data.grade_id || 0,
      role_id: data.role_id || 0,
      service_id: data.service_id || 0,
      telephone: data.telephone || '',
      section: data.section || ''
    })

    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    }
  }
}

function supprimer(id: number) {
  Swal.fire({
    title: 'Confirmation de suppression',
    text: 'Êtes-vous sûr de vouloir supprimer ce membre ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      personnelStore.supprimerPersonnel(id)
      Swal.fire({
        title: 'Supprimé!',
        text: 'Le membre a été supprimé.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

// Validations
const rules = {
  nom: { required },
  prenom: { required },
  matricule: { required },
}
const $v = useVuelidate(rules, form)

const rules_edit = {
  nom: { required },
  prenom: { required },
  matricule: { required },
}
const $v_edit = useVuelidate(rules_edit, formEdit)

onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      roleStore.getRole(),
      fonctionStore.getFonction(),
      gradeStore.getGrade(),
      emploiStore.getEmploi(),
      serviceStore.getService(),
      personnelStore.getPersonnel()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.membres-page {
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

/* Boutons */
.btn-add, .btn-import {
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.btn-add {
  background: linear-gradient(135deg, #3a7bd5, #2c3e50);
  color: white;
  box-shadow: 0 4px 10px rgba(58, 123, 213, 0.3);
}

.btn-import {
  background: linear-gradient(135deg, #64748b, #475569);
  color: white;
  box-shadow: 0 4px 10px rgba(71, 85, 105, 0.3);
}

.btn-add:hover, .btn-import:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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
  background: linear-gradient(135deg, #10b981, #059669) !important;
  color: #000;
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
  margin-bottom: 4px;
  white-space: nowrap;
}

.user-email {
  font-size: 0.8rem;
  color: #64748b;
  white-space: nowrap;
}

/* Badges */
.matricule-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
  font-family: 'Courier New', monospace;
  white-space: nowrap;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.service-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
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
  color: #3b82f6;
  font-size: 0.9rem;
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

/* Pagination centrée corrigée - NE PAS DÉPASSER */
.pagination-wrapper {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  padding: 5px 0;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  justify-content: center;
  max-width: 100%;
}

.page-item {
  display: inline-flex;
  margin: 2px;
}

.page-item .page-link {
  border: none;
  border-radius: 6px !important;
  padding: 6px 10px;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  font-weight: 500;
  font-size: 0.85rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
  text-decoration: none;
  line-height: 1;
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #3a7bd5, #2c3e50);
  color: white;
  box-shadow: 0 4px 8px rgba(58, 123, 213, 0.3);
}

.page-item:not(.active):not(.disabled) .page-link:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
}

.page-item.disabled .page-link {
  background: #f1f5f9;
  color: #cbd5e1;
  cursor: not-allowed;
  pointer-events: none;
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
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
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

/* Section title */
.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
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
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #10b981;
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
  color: #10b981;
  font-weight: 600;
}

.upload-placeholder small {
  font-size: 0.8rem;
  color: #94a3b8;
}

.upload-preview {
  position: relative;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}

.upload-preview img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #10b981;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
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
  .membres-page {
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
  
  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .user-name, .user-email, .contact-info span {
    white-space: normal;
  }
  
  .page-item .page-link {
    min-width: 32px;
    height: 32px;
    padding: 4px 8px;
    font-size: 0.8rem;
  }
  
  .pagination {
    gap: 2px;
  }
}
</style>