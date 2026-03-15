<template>
  <div class="actualites-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-newspaper me-2 text-primary"></i>
            Gestion des actualités
          </h3>
          <p class="text-muted mb-0">Gérez les actualités et leurs images</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ actualiteStore.getterActualite.length }}
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
          Nouvelle actualité
        </button>
      </div>
    </div>

    <!-- Tableau des actualités -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead class="table-header-custom">
            <tr>
              <th class="text-center">N°</th>
              <th>Titre</th>
              <th>Description</th>
              <th class="text-center">Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="actualiteStore.getterActualite.length > 0">
            <tr v-for="(item, index) in actualiteStore.getterActualite" :key="item.id" class="hover-effect">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td>
                <span class="titre-text">{{ item.title }}</span>
              </td>
              <td>
                <div class="description-cell">
                  <span class="description-text">{{ truncateText(item.description, 100) }}</span>
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
                  <button @click="voirImages(item.id)" class="btn-action info" title="Voir les images">
                    <i class="bi bi-images"></i>
                  </button>
                  <button @click="showEditModal(item.id)" class="btn-action warning" title="Modifier">
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
                <i class="bi bi-newspaper"></i>
                <p>Aucune actualité trouvée</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Lightbox pour les images -->
    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImages"
      :index="lightboxIndex"
      @hide="lightboxVisible = false"
    />

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
                <h5 class="modal-title">Nouvelle actualité</h5>
                <p class="modal-subtitle">Ajoutez une nouvelle actualité</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Titre -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-type me-2"></i>Titre <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v.title.$error }"
                  type="text"
                  placeholder="Ex: Réunion trimestrielle"
                  v-model="form.title"
                />
                <div class="invalid-feedback" v-if="$v.title.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Description -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-text-paragraph me-2"></i>Description <span class="text-danger">*</span>
                </label>
                <textarea
                  v-model="form.description"
                  rows="5"
                  class="form-control"
                  :class="{ 'is-invalid': $v.description.$error }"
                  placeholder="Écrivez le contenu de l'actualité..."
                ></textarea>
                <div class="invalid-feedback" v-if="$v.description.$error">
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
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="bi bi-pencil-square"></i>
              </div>
              <div>
                <h5 class="modal-title">Modifier l'actualité</h5>
                <p class="modal-subtitle">Modifiez les informations de l'actualité</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Statut -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-toggle-on me-2"></i>Statut
                </label>
                <div class="status-toggle">
                  <button 
                    type="button"
                    class="toggle-btn"
                    :class="{ active: formEdit.statut == 1 }"
                    @click="formEdit.statut = 1"
                  >
                    <i class="bi bi-check-circle"></i>
                    Activer
                  </button>
                  <button 
                    type="button"
                    class="toggle-btn"
                    :class="{ active: formEdit.statut == 0 }"
                    @click="formEdit.statut = 0"
                  >
                    <i class="bi bi-x-circle"></i>
                    Désactiver
                  </button>
                </div>
              </div>

              <!-- Titre -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-type me-2"></i>Titre <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.title.$error }"
                  type="text"
                  placeholder="Ex: Réunion trimestrielle"
                  v-model="formEdit.title"
                />
                <div class="invalid-feedback" v-if="$v_edit.title.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Description -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-text-paragraph me-2"></i>Description <span class="text-danger">*</span>
                </label>
                <textarea
                  v-model="formEdit.description"
                  rows="5"
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.description.$error }"
                  placeholder="Écrivez le contenu de l'actualité..."
                ></textarea>
                <div class="invalid-feedback" v-if="$v_edit.description.$error">
                  Ce champ est requis
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
import { ref, reactive, onMounted } from 'vue'
import { useActualite } from '../../stores/parametrage/actualite'
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'
import { useImagerie } from '../../stores/parametrage/imagerie'
import VueEasyLightbox from 'vue-easy-lightbox'

const actualiteStore = useActualite()
const imagerieStore = useImagerie()

const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)

const file_url = import.meta.env.VITE_FILE_URL

interface Actualite {
  id?: number
  title: string
  description: string
  statut: number
}

const form = reactive<Actualite>({
  id: 0,
  title: '',
  description: '',
  statut: 0,
})

const formEdit = reactive<Actualite>({
  id: 0,
  title: '',
  description: '',
  statut: 0,
})

// Lightbox state
const lightboxVisible = ref(false)
const lightboxImages = ref<string[]>([])
const lightboxIndex = ref(0)

// Fonction pour tronquer le texte
const truncateText = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Fonction pour ouvrir la lightbox avec les images de l'actualité
function voirImages(actualiteId: number) {
  const images = imagerieStore.getterImagerie
    .filter(img => img.actualite_id == actualiteId)
    .map(img => `${file_url}/${img.fichier}`)

  if (images.length > 0) {
    lightboxImages.value = images
    lightboxIndex.value = 0
    lightboxVisible.value = true
  } else {
    Swal.fire({
      title: 'Information',
      text: 'Aucune image pour cette actualité.',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    })
  }
}

const showModal = () => {
  if (modalRef.value) {
    form.title = ''
    form.description = ''
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
  form.title = ''
  form.description = ''
}

function AjouterFonctionLocal() {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      isLoading.value = true
      actualiteStore.AjouterActualite(form).then(() => {
        isLoading.value = false
        closeModal()
        annulerChamp()
        Swal.fire({
          title: 'Succès!',
          text: 'L\'actualité a été ajoutée.',
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
        text: 'Une erreur est survenue.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }
}

function annulerChampEdit() {
  $v_edit.value.$reset()
  formEdit.title = ''
  formEdit.description = ''
}

function ModifierFonctionLocal() {
  $v_edit.value.$touch()
  if (!$v_edit.value.$invalid) {
    try {
      isLoading.value = true
      actualiteStore.modifierActualite(formEdit).then(() => {
        isLoading.value = false
        closeModal()
        annulerChampEdit()
        Swal.fire({
          title: 'Succès!',
          text: 'L\'actualité a été modifiée.',
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
  const data = actualiteStore.getterActualite.find((item) => item.id === id)

  if (data) {
    formEdit.id = data.id
    formEdit.title = data.title
    formEdit.description = data.description
    formEdit.statut = data.statut

    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    }
  }
}

function supprimer(id: number) {
  Swal.fire({
    title: 'Confirmation de suppression',
    text: 'Êtes-vous sûr de vouloir supprimer cette actualité ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      actualiteStore.supprimerActualite(id)
      Swal.fire({
        title: 'Supprimé!',
        text: 'L\'actualité a été supprimée.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

const rules = {
  title: { required },
  description: { required },
}
const $v = useVuelidate(rules, form)

const rules_edit = {
  title: { required },
  description: { required },
}
const $v_edit = useVuelidate(rules_edit, formEdit)

onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      imagerieStore.getImagerie(),
      actualiteStore.getActualite()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.actualites-page {
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

/* En-tête de tableau - CONSERVÉ */
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

/* Titre text */
.titre-text {
  font-weight: 600;
  color: #1e293b;
}

/* Description cell */
.description-cell {
  max-width: 300px;
}

.description-text {
  color: #475569;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.btn-action.warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
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

/* Status toggle */
.status-toggle {
  display: flex;
  gap: 10px;
}

.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active[class*="active"]:nth-child(1) {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.toggle-btn.active[class*="active"]:nth-child(2) {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
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
  .actualites-page {
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
  
  .status-toggle {
    flex-direction: column;
  }
}
</style>