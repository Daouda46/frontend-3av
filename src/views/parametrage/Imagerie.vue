<template>
  <div class="imagerie-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-images me-2 text-primary"></i>
            Gestion des images
          </h3>
          <p class="text-muted mb-0">Gérez les images illustrant les actualités</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ imagerieStore.getterImagerie.length }}
            </span>
            <span class="badge bg-success">
              <i class="bi bi-check-circle"></i> Actives: {{ imagerieStore.getterImagerie.filter(i => i.statut == 1).length }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche et bouton d'ajout -->
    <div class="row align-items-center mb-4 g-3">
      <div class="col-md-8">
        <!-- Espace pour éventuelle recherche future -->
      </div>
      <div class="col-md-4 text-end">
        <button type="button" class="btn btn-primary btn-add" @click="showModal">
          <i class="bi bi-plus-lg me-2"></i>
          Nouvelle image
        </button>
      </div>
    </div>

    <!-- Tableau des images -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead>
            <tr>
              <th class="text-center">N°</th>
              <th>Titre de l'actualité</th>
              <th class="text-center">Aperçu</th>
              <th class="text-center">Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="imagerieStore.getterImagerie.length > 0">
            <tr v-for="(item, index) in imagerieStore.getterImagerie" :key="item.id" class="hover-effect">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td>
                <div class="actualite-info">
                  <span class="actualite-titre">{{ getActualiteTitre(item.actualite_id) }}</span>
                </div>
              </td>
              <td class="text-center">
                <div class="image-preview-container">
                  <img 
                    :src="`${file_url}/${item.fichier}`" 
                    :alt="getActualiteTitre(item.actualite_id)"
                    class="image-preview"
                    @click="previewImage(`${file_url}/${item.fichier}`)"
                  >
                  <span class="image-zoom-hint">
                    <i class="bi bi-zoom-in"></i>
                  </span>
                </div>
              </td>
              <td class="text-center">
                <span v-if="item.statut == 1" class="status-badge active">
                  <i class="bi bi-check-circle-fill me-1"></i> Activé
                </span>
                <span v-if="item.statut == 0" class="status-badge inactive">
                  <i class="bi bi-x-circle-fill me-1"></i> Désactivé
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
              <td colspan="5" class="empty-state">
                <i class="bi bi-image"></i>
                <p>Aucune image trouvée</p>
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
                <i class="bi bi-image"></i>
              </div>
              <div>
                <h5 class="modal-title">Ajouter une image</h5>
                <p class="modal-subtitle">Associez une image à une actualité</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Actualité -->
              <div class="form-group mb-4">
                <label class="form-label">
                  <i class="bi bi-newspaper me-2"></i>Actualité <span class="text-danger">*</span>
                </label>
                <select 
                  class="form-select" 
                  :class="{ 'is-invalid': $v.actualite_id.$error }" 
                  v-model="form.actualite_id"
                >
                  <option value="">Sélectionnez une actualité</option>
                  <option 
                    v-for="(item, index) in actualiteStore.getterActualite" 
                    :key="index" 
                    :value="item.id"
                  >
                    {{ item.title }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="$v.actualite_id.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Upload d'image -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-cloud-upload me-2"></i>Image <span class="text-danger">*</span>
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
                    <p>Glissez-déposez votre image ici ou <span>cliquez pour parcourir</span></p>
                    <small>Formats acceptés : PNG, JPG, JPEG (max 50 Mo)</small>
                  </div>
                  <div class="upload-preview" v-else>
                    <img :src="previewfichier" alt="Aperçu">
                    <button type="button" class="remove-image" @click="removeImage">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
                <div class="form-error" v-if="$v.fichier?.$error">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  Ce champ est requis
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
                <h5 class="modal-title">Modifier l'image</h5>
                <p class="modal-subtitle">Modifiez l'association de l'image</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Actualité -->
              <div class="form-group mb-4">
                <label class="form-label">
                  <i class="bi bi-newspaper me-2"></i>Actualité <span class="text-danger">*</span>
                </label>
                <select 
                  class="form-select" 
                  :class="{ 'is-invalid': $v_edit.actualite_id.$error }" 
                  v-model="formEdit.actualite_id"
                >
                  <option value="">Sélectionnez une actualité</option>
                  <option 
                    v-for="(item, index) in actualiteStore.getterActualite" 
                    :key="index" 
                    :value="item.id"
                  >
                    {{ item.title }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="$v_edit.actualite_id.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Image actuelle -->
              <div class="form-group mb-3" v-if="!previewfichier && formEdit.fichier">
                <label class="form-label">
                  <i class="bi bi-image me-2"></i>Image actuelle
                </label>
                <div class="current-image">
                  <img :src="`${file_url}/${formEdit.fichier}`" alt="Image actuelle">
                </div>
              </div>

              <!-- Upload d'image -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-cloud-upload me-2"></i>Nouvelle image (optionnel)
                </label>
                <div class="upload-area" @dragover.prevent @drop.prevent="handleDropEdit">
                  <input
                    type="file"
                    ref="fileInputEdit"
                    class="file-input"
                    accept="image/png, image/jpeg, image/jpg"
                    @change="onFileChangeEdit"
                  />
                  <div class="upload-placeholder" v-if="!previewfichier">
                    <i class="bi bi-cloud-arrow-up"></i>
                    <p>Glissez-déposez ou <span>cliquez</span> pour changer l'image</p>
                  </div>
                  <div class="upload-preview" v-else>
                    <img :src="previewfichier" alt="Aperçu">
                    <button type="button" class="remove-image" @click="removeImageEdit">
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
import { ref, reactive, onMounted } from 'vue'
import { useImagerie } from '../../stores/parametrage/imagerie'
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'
import { toast } from "vue3-toastify"
import { useActualite } from '../../stores/parametrage/actualite'

const imagerieStore = useImagerie()
const actualiteStore = useActualite()

const file_url = import.meta.env.VITE_FILE_URL

const previewfichier = ref<string | null>(null)
const previewImageUrl = ref<string>('')
const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const previewModalRef = ref<HTMLDivElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const fileInputEdit = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)

interface Imagerie {
  id?: number
  actualite_id: string
  fichier: File | string
  statut: number
}

const form = reactive<Imagerie>({
  id: 0,
  actualite_id: '',
  fichier: '',
  statut: 0,
})

const formEdit = reactive<Imagerie>({
  id: 0,
  actualite_id: '',
  fichier: '',
  statut: 0,
})

// Récupérer le titre d'une actualité
const getActualiteTitre = (id: string) => {
  const actualite = actualiteStore.getterActualite.find(a => a.id == id)
  return actualite ? actualite.title : 'Actualité inconnue'
}

// Prévisualiser une image
const previewImage = (url: string) => {
  previewImageUrl.value = url
  if (previewModalRef.value) {
    const modalInstance = new Modal(previewModalRef.value)
    modalInstance.show()
  }
}

const showModal = () => {
  if (modalRef.value) {
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
  form.actualite_id = ''
  form.fichier = ''
  previewfichier.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function annulerChampEdit() {
  $v_edit.value.$reset()
  formEdit.actualite_id = ''
  previewfichier.value = null
  if (fileInputEdit.value) fileInputEdit.value.value = ''
}

const AjouterFonctionLocal = async () => {
  $v.value.$touch()
  if (!$v.value.$invalid && form.fichier) {
    try {
      isLoading.value = true
      const formDataSendToBackend = new FormData()
      formDataSendToBackend.append("actualite_id", form.actualite_id)
      formDataSendToBackend.append("statut", "0")
      if (form.fichier && form.fichier instanceof File) {
        formDataSendToBackend.append("fichier", form.fichier)
      }
      await imagerieStore.AjouterImagerie(formDataSendToBackend)
      isLoading.value = false
      closeModal()
      annulerChamp()
      toast.success("Image ajoutée avec succès")
    } catch (error) {
      console.error("Echec d'enregistrement:", error)
      isLoading.value = false
      toast.error("Erreur lors de l'ajout")
    }
  } else if (!form.fichier) {
    toast.warning("Veuillez sélectionner une image")
  }
}

const ModifierFonctionLocal = async () => {
  $v_edit.value.$touch()
  if (!$v_edit.value.$invalid) {
    try {
      isLoading.value = true
      const formDataSendToBackendEdit = new FormData()
      formDataSendToBackendEdit.append("id", formEdit.id.toString())
      formDataSendToBackendEdit.append("actualite_id", formEdit.actualite_id)
      formDataSendToBackendEdit.append("statut", formEdit.statut.toString())

      if (formEdit.fichier instanceof File) {
        formDataSendToBackendEdit.append("fichier", formEdit.fichier)
      }

      await imagerieStore.modifierImagerie(formDataSendToBackendEdit, formEdit.id)
      isLoading.value = false
      closeModal()
      annulerChampEdit()
      toast.success("Image modifiée avec succès")
    } catch (error) {
      console.error('Modification failed:', error)
      isLoading.value = false
      toast.error("Erreur lors de la modification")
    }
  }
}

const showEditModal = (id: number) => {
  const data = imagerieStore.getterImagerie.find((item) => item.id === id)

  if (data) {
    formEdit.id = data.id
    formEdit.actualite_id = data.actualite_id
    formEdit.fichier = data.fichier
    formEdit.statut = data.statut
    previewfichier.value = null

    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    }
  }
}

function supprimer(id: number) {
  Swal.fire({
    title: 'Confirmation de suppression',
    text: 'Êtes-vous sûr de vouloir supprimer cette image ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      imagerieStore.supprimerImagerie(id)
      Swal.fire({
        title: 'Supprimé!',
        text: 'L\'image a été supprimée.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

const removeImage = () => {
  previewfichier.value = null
  form.fichier = ''
  if (fileInput.value) fileInput.value.value = ''
}

const removeImageEdit = () => {
  previewfichier.value = null
  if (fileInputEdit.value) fileInputEdit.value.value = ''
}

const onFileChangeEdit = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null

  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error("Veuillez sélectionner une image valide")
    return
  }

  if (file.size > 50 * 1024 * 1024) {
    toast.error("L'image ne doit pas dépasser 50 Mo")
    return
  }

  if (previewfichier.value) {
    URL.revokeObjectURL(previewfichier.value)
  }

  previewfichier.value = URL.createObjectURL(file)
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

  if (file.size > 50 * 1024 * 1024) {
    toast.error("L'image ne doit pas dépasser 50 Mo")
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
    if (file.size > 50 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 50 Mo")
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
    if (file.size > 50 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 50 Mo")
      return
    }
    if (previewfichier.value) URL.revokeObjectURL(previewfichier.value)
    previewfichier.value = URL.createObjectURL(file)
    formEdit.fichier = file
  }
}

const rules = {
  actualite_id: { required },
}

const $v = useVuelidate(rules, form)

const rules_edit = {
  actualite_id: { required },
}

const $v_edit = useVuelidate(rules_edit, formEdit)

onMounted(async () => {
  try {
    isLoading.value = true
    await actualiteStore.getActualite()
    await imagerieStore.getImagerie()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.imagerie-page {
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

/* Actualité info */
.actualite-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.actualite-titre {
  font-weight: 500;
  color: #1e293b;
}

/* Image preview */
.image-preview-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.image-preview {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.image-preview:hover {
  transform: scale(1.05);
  border-color: #3a7bd5;
  box-shadow: 0 4px 10px rgba(58, 123, 213, 0.2);
}

.image-zoom-hint {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview-container:hover .image-zoom-hint {
  opacity: 1;
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
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

/* Upload area */
.upload-area {
  position: relative;
  border: 2px dashed #cbd5e1;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
  min-height: 200px;
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
  font-size: 3rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.upload-placeholder p {
  margin-bottom: 5px;
  font-size: 1rem;
}

.upload-placeholder p span {
  color: #3a7bd5;
  font-weight: 600;
}

.upload-placeholder small {
  font-size: 0.85rem;
  color: #94a3b8;
}

.upload-preview {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.upload-preview img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #3a7bd5;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
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

/* Current image */
.current-image {
  max-width: 200px;
  margin: 10px 0;
}

.current-image img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
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

/* Form errors */
.form-error {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.form-error i {
  font-size: 1rem;
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
  .imagerie-page {
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
  
  .upload-area {
    padding: 20px;
  }
}
</style>