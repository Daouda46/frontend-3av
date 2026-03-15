<template>
  <div class="services-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-building me-2 text-primary"></i>
            Gestion des services
          </h3>
          <p class="text-muted mb-0">Gérez les services et leurs informations</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ serviceStore.getterService.length }}
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
          Nouveau service
        </button>
      </div>
    </div>

    <!-- Tableau des services -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead>
            <tr>
              <th class="text-center">N°</th>
              <th>Libellé</th>
              <th>Structure contrôlée</th>
              <th class="text-center">Image</th>
              <th class="text-center">Couleur</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredServices.length > 0">
            <tr v-for="(item, index) in filteredServices" :key="item.id" class="hover-effect">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td>
                <div class="service-info">
                  <span class="service-code">{{ item.code }}</span>
                  <span class="service-libelle">{{ item.libelle }}</span>
                </div>
              </td>
              <td>
                <span class="structure-badge">
                  {{ (item.structure_controlle) || 'Non renseigné' }}
                </span>
              </td>
              <td class="text-center">
                <div class="logo-preview-container">
                  <img
                    :src="item.image ? `${file_url}/${item.image}` : '/assets/images/avatar1.jpg'"
                    :alt="item.libelle"
                    class="logo-preview"
                    @click="previewImage(item.image ? `${file_url}/${item.image}` : '/assets/images/avatar1.jpg')"
                  />
                  <span class="image-zoom-hint">
                    <i class="bi bi-zoom-in"></i>
                  </span>
                </div>
              </td>
              <td class="text-center">
                <div class="color-indicator" :style="{ backgroundColor: item.couleur }">
                  <span class="color-code">{{ item.couleur }}</span>
                </div>
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
              <td colspan="6" class="empty-state">
                <i class="bi bi-building"></i>
                <p>Aucun service trouvé</p>
              </td>
            </tr>
          </tbody>
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
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="bi bi-building-add"></i>
              </div>
              <div>
                <h5 class="modal-title">Nouveau service</h5>
                <p class="modal-subtitle">Ajoutez un nouveau service</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <div class="row">
                <!-- Code (généré automatiquement) -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-code-slash me-2"></i>Code
                  </label>
                  <div class="code-display">
                    <span class="generated-code">{{ generatedCode || '________' }}</span>
                    <span class="code-hint">Auto-généré</span>
                  </div>
                </div>

                <!-- Libellé -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-type me-2"></i>Libellé <span class="text-danger">*</span>
                  </label>
                  <input
                    class="form-control"
                    :class="{ 'is-invalid': $v.libelle.$error }"
                    type="text"
                    placeholder="Ex: Service financier"
                    v-model="form.libelle"
                  />
                  <div class="invalid-feedback" v-if="$v.libelle.$error">
                    Ce champ est requis
                  </div>
                </div>
              </div>

              <div class="row">
                <!-- Localité -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-geo-alt me-2"></i>Localité
                  </label>
                  <select class="form-select" v-model="form.localite">
                    <option value="">Sélectionnez une localité</option>
                    <option v-for="(item, index) in categories" :key="index" :value="item.id">
                      {{ item.libelle }}
                    </option>
                  </select>
                </div>

                <!-- Structure contrôlée -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-diagram-3 me-2"></i>Structure contrôlée
                  </label>
                  <model-list-select
                    :list="structureControllerStore.getterStructureController"
                    v-model="form.structure_controllers_id"
                    option-value="id"
                    option-text="libelle"
                    placeholder="Sélectionnez une structure"
                    class="form-select"
                  >
                  </model-list-select>
                </div>
              </div>

              <div class="row">
                <!-- Couleur -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-palette me-2"></i>Couleur <span class="text-danger">*</span>
                  </label>
                  <div class="color-picker-wrapper">
                    <input
                      class="form-control form-control-color"
                      type="color"
                      v-model="form.couleur"
                      title="Choisissez une couleur"
                    />
                    <span class="selected-color" :style="{ backgroundColor: form.couleur }"></span>
                  </div>
                  <div class="invalid-feedback" v-if="$v.couleur.$error">
                    Ce champ est requis
                  </div>
                </div>

                <!-- Upload logo -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-image me-2"></i>Logo
                  </label>
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
                      <p>Glissez-déposez ou <span>cliquez</span> pour ajouter un logo</p>
                    </div>
                    <div class="upload-preview" v-else>
                      <img :src="previewfichier" alt="Aperçu">
                      <button type="button" class="remove-image" @click="removeImage">
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
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

    <!-- Modal de modification amélioré -->
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEdit"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="bi bi-pencil-square"></i>
              </div>
              <div>
                <h5 class="modal-title">Modifier le service</h5>
                <p class="modal-subtitle">Modifiez les informations du service</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <div class="row">
                <!-- Code (lecture seule) -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-code-slash me-2"></i>Code
                  </label>
                  <div class="code-display">
                    <span class="generated-code">{{ formEdit.code }}</span>
                    <span class="code-hint">Code unique</span>
                  </div>
                </div>

                <!-- Libellé -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-type me-2"></i>Libellé <span class="text-danger">*</span>
                  </label>
                  <input
                    class="form-control"
                    :class="{ 'is-invalid': $v_edit.libelle.$error }"
                    type="text"
                    placeholder="Ex: Service financier"
                    v-model="formEdit.libelle"
                  />
                  <div class="invalid-feedback" v-if="$v_edit.libelle.$error">
                    Ce champ est requis
                  </div>
                </div>
              </div>

              <div class="row">
                <!-- Localité -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-geo-alt me-2"></i>Localité
                  </label>
                  <select class="form-select" v-model="formEdit.localite">
                    <option value="">Sélectionnez une localité</option>
                    <option v-for="(item, index) in categories" :key="index" :value="item.id">
                      {{ item.libelle }}
                    </option>
                  </select>
                </div>

                <!-- Structure contrôlée -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-diagram-3 me-2"></i>Structure contrôlée
                  </label>
                  <model-list-select
                    :list="structureControllerStore.getterStructureController"
                    v-model="formEdit.structure_controllers_id"
                    option-value="id"
                    option-text="libelle"
                    placeholder="Sélectionnez une structure"
                    class="form-select"
                  >
                  </model-list-select>
                </div>
              </div>

              <div class="row">
                <!-- Couleur -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-palette me-2"></i>Couleur
                  </label>
                  <div class="color-picker-wrapper">
                    <input
                      class="form-control form-control-color"
                      type="color"
                      v-model="formEdit.couleur"
                      title="Choisissez une couleur"
                    />
                    <span class="selected-color" :style="{ backgroundColor: formEdit.couleur }"></span>
                  </div>
                </div>

                <!-- Upload logo -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">
                    <i class="bi bi-image me-2"></i>Logo
                  </label>
                  <div class="upload-area" @dragover.prevent @drop.prevent="handleDropEdit">
                    <input
                      type="file"
                      ref="fileInputEdit"
                      class="file-input"
                      accept="image/png, image/jpeg, image/jpg"
                      @change="onFileChangeEdit"
                    />
                    <div class="upload-placeholder" v-if="!previewfichierEdit">
                      <i class="bi bi-cloud-arrow-up"></i>
                      <p>Cliquez pour changer le logo</p>
                    </div>
                    <div class="upload-preview" v-else>
                      <img :src="previewfichierEdit" alt="Aperçu">
                      <button type="button" class="remove-image" @click="removeImageEdit">
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                  <div v-if="!previewfichierEdit && formEdit.fichier" class="current-logo">
                    <small>Logo actuel:</small>
                    <img :src="`${file_url}/${formEdit.fichier}`" alt="Logo actuel">
                  </div>
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

    <!-- Modal de prévisualisation d'image -->
    <div
      class="modal fade"
      id="previewModal"
      tabindex="-1"
      ref="previewModalRef"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-body text-center">
            <img :src="previewImageUrl" class="preview-full-image" alt="Aperçu">
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
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
import { useService } from '../../stores/parametrage/service'
import { useStructureController } from '../../stores/parametrage/structureController'
import Swal from 'sweetalert2'
import { toast } from 'vue3-toastify'
import Loader from '../../components/Loader.vue'
import { ModelListSelect } from "vue-search-select"

const structureControllerStore = useStructureController()
const serviceStore = useService()
const searchTerm = ref('')
const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const previewModalRef = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const previewfichier = ref<string | null>(null)
const previewfichierEdit = ref<string | null>(null)
const previewImageUrl = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const fileInputEdit = ref<HTMLInputElement | null>(null)

interface Service {
  fichier: File | string
  id?: number
  localite?: number
  structure_controllers_id?: number
  code: string
  libelle: string
  couleur: string
}

const file_url = import.meta.env.VITE_FILE_URL

const form = reactive<Service>({
  id: 0,
  localite: 0,
  structure_controllers_id: 0,
  code: '',
  libelle: '',
  couleur: '#3a7bd5',
  fichier: '',
})

const formEdit = reactive<Service>({
  id: 0,
  localite: 0,
  structure_controllers_id: 0,
  code: '',
  libelle: '',
  couleur: '#3a7bd5',
  fichier: '',
})

const categories = [
  { id: 0, libelle: 'Cf central' },
  { id: 1, libelle: 'Cf local' },
  { id: 2, libelle: 'Sous-directeur' },
  { id: 3, libelle: 'Diaspora' },
]

const getStructureLibelle = (id?: number) => {
  if (!id) return 'Non renseigné'
  const structure = structureControllerStore.getterStructureController.find(s => s.id === id)
  return structure ? structure.libelle : 'Non renseigné'
}

const previewImage = (url: string) => {
  previewImageUrl.value = url
  if (previewModalRef.value) {
    const modalInstance = new Modal(previewModalRef.value)
    modalInstance.show()
  }
}

const generatedCode = computed(() => {
  if (form.libelle) {
    const firstThree = form.libelle.trim().substring(0, 4).toUpperCase()
    return firstThree + (serviceStore.getterService.length + 1)
  }
  return ''
})

const showModal = () => {
  if (modalRef.value) {
    form.libelle = ''
    form.couleur = '#3a7bd5'
    form.localite = 0
    form.structure_controllers_id = 0
    form.fichier = ''
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

const filteredServices = computed(() => {
  if (!searchTerm.value) return serviceStore.getterService

  const keyword = searchTerm.value.toLowerCase()
  return serviceStore.getterService.filter(
    (item) =>
      item.code?.toLowerCase().includes(keyword) || 
      item.libelle?.toLowerCase().includes(keyword)
  )
})

const removeImage = () => {
  previewfichier.value = null
  form.fichier = ''
  if (fileInput.value) fileInput.value.value = ''
}

const removeImageEdit = () => {
  previewfichierEdit.value = null
  formEdit.fichier = ''
  if (fileInputEdit.value) fileInputEdit.value.value = ''
}

const AjouterFonctionLocal = async () => {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      isLoading.value = true
      const formDataSendToBackend = new FormData()
      formDataSendToBackend.append('code', generatedCode.value)
      formDataSendToBackend.append('libelle', form.libelle)
      formDataSendToBackend.append('couleur', form.couleur)
      formDataSendToBackend.append('structure_controllers_id', (form.structure_controllers_id || 0).toString())
      formDataSendToBackend.append('localite', (form.localite || 0).toString())
      if (form.fichier && form.fichier instanceof File) {
        formDataSendToBackend.append('fichier', form.fichier)
      }
      await serviceStore.AjouterService(formDataSendToBackend)
      isLoading.value = false
      closeModal()
      toast.success('Service ajouté avec succès')
    } catch (error) {
      console.error("Echec d'enregistrement:", error)
      isLoading.value = false
      toast.error("Erreur lors de l'ajout")
    }
  }
}

const ModifierFonctionLocal = async () => {
  $v_edit.value.$touch()
  if (!$v_edit.value.$invalid) {
    try {
      isLoading.value = true
      const formDataSendToBackendEdit = new FormData()
      formDataSendToBackendEdit.append('libelle', formEdit.libelle)
      formDataSendToBackendEdit.append('id', (formEdit.id || 0).toString())
      formDataSendToBackendEdit.append('structure_controllers_id', (formEdit.structure_controllers_id || 0).toString())
      formDataSendToBackendEdit.append('couleur', formEdit.couleur)
      formDataSendToBackendEdit.append('code', formEdit.code)
      formDataSendToBackendEdit.append('localite', (formEdit.localite || 0).toString())

      if (formEdit.fichier && formEdit.fichier instanceof File) {
        formDataSendToBackendEdit.append('fichier', formEdit.fichier)
      }

      await serviceStore.modifierService(formEdit.id!, formDataSendToBackendEdit)
      isLoading.value = false
      closeModal()
      toast.success('Service modifié avec succès')
    } catch (error) {
      console.error("Echec de modification:", error)
      isLoading.value = false
      toast.error("Erreur lors de la modification")
    }
  }
}

const onFileChangeEdit = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null

  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error("Veuillez sélectionner une image valide")
    return
  }

  if (file.size > 20 * 1024 * 1024) {
    toast.error("L'image ne doit pas dépasser 20 Mo")
    return
  }

  if (previewfichierEdit.value) {
    URL.revokeObjectURL(previewfichierEdit.value)
  }

  previewfichierEdit.value = URL.createObjectURL(file)
  formEdit.fichier = file
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null

  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error("Veuillez sélectionner une image valide")
    return
  }

  if (file.size > 20 * 1024 * 1024) {
    toast.error("L'image ne doit pas dépasser 20 Mo")
    return
  }

  if (previewfichier.value) {
    URL.revokeObjectURL(previewfichier.value)
  }

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

const handleDropEdit = (event: DragEvent) => {
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
    if (previewfichierEdit.value) URL.revokeObjectURL(previewfichierEdit.value)
    previewfichierEdit.value = URL.createObjectURL(file)
    formEdit.fichier = file
  }
}

const showEditModal = (id: number) => {
  const data = serviceStore.getterService.find((item) => item.id === id)

  if (data) {
    formEdit.id = data.id
    formEdit.code = data.code
    formEdit.libelle = data.libelle
    formEdit.localite = data.localite || 0
    formEdit.couleur = data.couleur
    formEdit.structure_controllers_id = data.structure_controllers_id || 0
    formEdit.fichier = data.image || ''
    previewfichierEdit.value = null

    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    }
  }
}

function supprimer(id: number) {
  Swal.fire({
    title: 'Confirmation de suppression',
    text: 'Êtes-vous sûr de vouloir supprimer ce service ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      serviceStore.supprimerService(id)
      Swal.fire({
        title: 'Supprimé!',
        text: 'Le service a été supprimé.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

const rules = {
  libelle: { required },
  couleur: { required },
}
const $v = useVuelidate(rules, form)

const rules_edit = {
  libelle: { required },
}
const $v_edit = useVuelidate(rules_edit, formEdit)

onMounted(async () => {
  try {
    isLoading.value = true
    await serviceStore.getService()
    await structureControllerStore.getStructureController()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.services-page {
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

/* Table wrapper */
.table-wrapper {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

/* Modern table */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

.modern-table thead th {
  padding: 15px;
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
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

/* Service info */
.service-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-code {
  font-size: 0.8rem;
  color: #64748b;
  font-family: 'Courier New', monospace;
}

.service-libelle {
  font-weight: 600;
  color: #1e293b;
}

/* Structure badge */
.structure-badge {
  display: inline-block;
  padding: 5px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #475569;
}

/* Logo preview */
.logo-preview-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.logo-preview {
  width: 50px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.logo-preview:hover {
  transform: scale(1.1);
  border-color: #3a7bd5;
  box-shadow: 0 4px 10px rgba(58, 123, 213, 0.2);
}

.image-zoom-hint {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo-preview-container:hover .image-zoom-hint {
  opacity: 1;
}

/* Color indicator */
.color-indicator {
  width: 80px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.color-code {
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
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
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.generated-code {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #3a7bd5;
  letter-spacing: 1px;
}

.code-hint {
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
}

/* Color picker */
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-control-color {
  width: 60px;
  height: 40px;
  padding: 0;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
}

.selected-color {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

/* Upload area */
.upload-area {
  position: relative;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 20px;
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
  border-color: #3a7bd5;
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
  font-size: 2rem;
  color: #94a3b8;
  margin-bottom: 5px;
}

.upload-placeholder p {
  margin: 0;
  font-size: 0.9rem;
}

.upload-placeholder p span {
  color: #3a7bd5;
  font-weight: 600;
}

.upload-preview {
  position: relative;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}

.upload-preview img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #3a7bd5;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
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

/* Current logo */
.current-logo {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-logo small {
  color: #64748b;
}

.current-logo img {
  width: 40px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

/* Preview full image */
.preview-full-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.btn-close-white {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 10px;
  opacity: 1;
}

.btn-close-white:hover {
  background: rgba(255, 255, 255, 0.3);
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
  .services-page {
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
    gap: 5px;
    text-align: center;
  }
}
</style>