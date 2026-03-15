<template>
  <div class="trimestre-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-calendar-week me-2 text-primary"></i>
            Gestion des trimestres
          </h3>
          <p class="text-muted mb-0">Gérez les trimestres des exercices budgétaires</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ trimestreStore.getterTrimestre.length }}
            </span>
            <span class="badge bg-success">
              <i class="bi bi-check-circle"></i> Actifs: {{ trimestreStore.getterTrimestre.filter(t => t.encours == 1).length }}
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
            placeholder="Rechercher par année..."
          />
        </div>
      </div>
      <div class="col-md-6 text-end">
        <button type="button" class="btn btn-primary btn-add" @click="showModal">
          <i class="bi bi-plus-lg me-2"></i>
          Nouveau trimestre
        </button>
      </div>
    </div>

    <!-- Tableau des trimestres -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead>
            <tr>
              <th class="text-center">N°</th>
              <th>Année</th>
              <th>Trimestre</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th class="text-center">Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredTrimestre.length > 0">
            <tr v-for="(item, index) in filteredTrimestre" :key="item.id" class="hover-effect">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td><span class="annee-badge">{{ item.annee }}</span></td>
              <td><span class="trimestre-badge">{{ item.trimestre }}</span></td>
              <td>{{ formaterDate(item.date_debut) }}</td>
              <td>{{ formaterDate(item.date_fin) }}</td>
              <td class="text-center">
                <span v-if="item.encours == 1" class="status-badge active">
                  <i class="bi bi-check-circle-fill me-1"></i> En cours
                </span>
                <span v-else class="status-badge inactive">
                  <i class="bi bi-x-circle-fill me-1"></i> Désactivé
                </span>
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button 
                    v-if="item.encours == 1" 
                    @click="desactiver_anner(item.id)" 
                    class="btn-action warning"
                    title="Désactiver"
                  >
                    <i class="bi bi-pause-circle"></i>
                  </button>
                  <button 
                    v-else 
                    @click="Chnage_status(item.id)" 
                    class="btn-action success"
                    title="Activer"
                  >
                    <i class="bi bi-play-circle"></i>
                  </button>
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
                <i class="bi bi-calendar-x"></i>
                <p>Aucun trimestre trouvé</p>
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
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="bi bi-calendar-plus"></i>
              </div>
              <div>
                <h5 class="modal-title">Nouveau trimestre</h5>
                <p class="modal-subtitle">Ajoutez un nouveau trimestre budgétaire</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Année -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-calendar me-2"></i>Année <span class="text-danger">*</span>
                </label>
                <select class="form-select" :class="{ 'is-invalid': $v.annee.$error }" v-model="form.annee">
                  <option value="">Sélectionnez une année</option>
                  <option v-for="(item, index) in exerciceStore.getterExerciceBudgetaire" :key="index" :value="item.annee">
                    {{ item.annee }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="$v.annee.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Trimestre -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-123 me-2"></i>Trimestre <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v.trimestre.$error }"
                  type="text"
                  placeholder="Ex: 1, 2, 3 ou 4"
                  v-model="form.trimestre"
                />
                <div class="invalid-feedback" v-if="$v.trimestre.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Date début -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-calendar-check me-2"></i>Date de début <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v.date_debut.$error }"
                  type="date"
                  v-model="form.date_debut"
                />
                <div class="invalid-feedback" v-if="$v.date_debut.$error">
                  Ce champ est requis
                </div>
                <div class="form-error" v-if="recupannverif(form.annee, form.date_debut) != 1 && form.date_debut">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  L'année de la date ne correspond pas
                </div>
              </div>

              <!-- Date fin -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-calendar-x me-2"></i>Date de fin <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v.date_fin.$error }"
                  type="date"
                  v-model="form.date_fin"
                />
                <div class="invalid-feedback" v-if="$v.date_fin.$error">
                  Ce champ est requis
                </div>
                <div class="form-error" v-if="recupannverif(form.annee, form.date_fin) != 1 && form.date_fin">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  L'année de la date ne correspond pas
                </div>
                <div class="form-error" v-if="!compareDate() && form.date_debut && form.date_fin">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  La date de fin doit être après la date de début
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
                <h5 class="modal-title">Modifier le trimestre</h5>
                <p class="modal-subtitle">Modifiez les informations du trimestre</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Année -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-calendar me-2"></i>Année <span class="text-danger">*</span>
                </label>
                <select class="form-select" :class="{ 'is-invalid': $v_edit.annee.$error }" v-model="formData.annee">
                  <option value="">Sélectionnez une année</option>
                  <option v-for="(item, index) in exerciceStore.getterExerciceBudgetaire" :key="index" :value="item.annee">
                    {{ item.annee }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="$v_edit.annee.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Trimestre -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-123 me-2"></i>Trimestre <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.trimestre.$error }"
                  type="text"
                  placeholder="Ex: 1, 2, 3 ou 4"
                  v-model="formData.trimestre"
                />
                <div class="invalid-feedback" v-if="$v_edit.trimestre.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Date début -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-calendar-check me-2"></i>Date de début <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.date_debut.$error }"
                  type="date"
                  v-model="formData.date_debut"
                />
                <div class="invalid-feedback" v-if="$v_edit.date_debut.$error">
                  Ce champ est requis
                </div>
                <div class="form-error" v-if="recupannverif(formData.annee, formData.date_debut) != 1 && formData.date_debut">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  L'année de la date ne correspond pas
                </div>
              </div>

              <!-- Date fin -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-calendar-x me-2"></i>Date de fin <span class="text-danger">*</span>
                </label>
                <input
                  class="form-control"
                  :class="{ 'is-invalid': $v_edit.date_fin.$error }"
                  type="date"
                  v-model="formData.date_fin"
                />
                <div class="invalid-feedback" v-if="$v_edit.date_fin.$error">
                  Ce champ est requis
                </div>
                <div class="form-error" v-if="recupannverif(formData.annee, formData.date_fin) != 1 && formData.date_fin">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  L'année de la date ne correspond pas
                </div>
                <div class="form-error" v-if="!compareDateEdit() && formData.date_debut && formData.date_fin">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  La date de fin doit être après la date de début
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
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ref, reactive, onMounted, computed } from 'vue'
import { useExerciceBudgetaireStore } from '../../stores/parametrage/exerciceBudgetaire'
import { useTrimestreStore } from '../../stores/parametrage/trimestre'
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'

const trimestreStore = useTrimestreStore()
const exerciceStore = useExerciceBudgetaireStore()
const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const searchTerm = ref('')

const form = reactive({
  annee: '',
  trimestre: '',
  date_debut: '',
  date_fin: '',
})

const formData = reactive({
  annee: '',
  trimestre: '',
  date_debut: '',
  date_fin: '',
  id: 0,
})

const formaterDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const filteredTrimestre = computed(() => {
  if (searchTerm.value !== '') {
    return trimestreStore.getterTrimestre.filter((item) =>
      item.annee.toString().toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  return trimestreStore.getterTrimestre
})

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

function supprimer(id: any) {
  Swal.fire({
    title: 'Confirmation de suppression',
    text: 'Êtes-vous sûr de vouloir supprimer ce trimestre ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    background: '#fff',
  }).then((res) => {
    if (res.isConfirmed) {
      trimestreStore.supprimerTrimestre(id)
      Swal.fire({
        title: 'Supprimé!',
        text: 'Le trimestre a été supprimé.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

function Chnage_status(id: any) {
  Swal.fire({
    title: 'Activation',
    text: 'Voulez-vous activer ce trimestre ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, activer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      trimestreStore.activer_anner(id)
      Swal.fire({
        title: 'Activé!',
        text: 'Le trimestre a été activé.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

function desactiver_anner(id: any) {
  Swal.fire({
    title: 'Désactivation',
    text: 'Voulez-vous désactiver ce trimestre ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, désactiver',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      trimestreStore.desactiver_anner(id)
      Swal.fire({
        title: 'Désactivé!',
        text: 'Le trimestre a été désactivé.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

const showEditModal = (id: number) => {
  const d_data = trimestreStore.getterTrimestre.find((item) => item.id === id)

  if (d_data) {
    formData.annee = d_data.annee.toString()
    formData.trimestre = d_data.trimestre
    formData.date_debut = d_data.date_debut
    formData.date_fin = d_data.date_fin
    formData.id = d_data.id

    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    }
  }
}

const compareDate = () => {
  if (!form.date_debut || !form.date_fin) return true
  return new Date(form.date_debut) <= new Date(form.date_fin)
}

const compareDateEdit = () => {
  if (!formData.date_debut || !formData.date_fin) return true
  return new Date(formData.date_debut) <= new Date(formData.date_fin)
}

const recupannverif = (an: string, date: string) => {
  if (date && an && an != '') {
    return new Date(date).getFullYear().toString() === an ? 1 : 0
  }
  return 1
}

const rules = {
  annee: { required },
  trimestre: { required },
  date_debut: { required },
  date_fin: { required },
}
const $v = useVuelidate(rules, form)

const rule_edit = {
  annee: { required },
  trimestre: { required },
  date_debut: { required },
  date_fin: { required },
}
const $v_edit = useVuelidate(rule_edit, formData)

function ajouterExercice() {
  $v.value.$touch()
  if (!$v.value.$invalid && compareDate()) {
    try {
      isLoading.value = true
      trimestreStore.ajouterTrimestre(form).then(() => {
        isLoading.value = false
        closeModal()
        // Reset form
        form.annee = ''
        form.trimestre = ''
        form.date_debut = ''
        form.date_fin = ''
        $v.value.$reset()
      })
    } catch (error) {
      console.error('Erreur:', error)
      isLoading.value = false
    }
  }
}

function modifierExercice() {
  $v_edit.value.$touch()
  if (!$v_edit.value.$invalid && compareDateEdit()) {
    try {
      isLoading.value = true
      trimestreStore.modifierTrimestre(formData).then(() => {
        isLoading.value = false
        closeModal()
      })
    } catch (error) {
      console.error('Erreur:', error)
      isLoading.value = false
    }
  }
}

onMounted(async () => {
  try {
    isLoading.value = true
    await trimestreStore.getTrimestre()
    await exerciceStore.getExerciceBudgetaire()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.trimestre-page {
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

/* Annee badge */
.annee-badge {
  display: inline-block;
  padding: 5px 15px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);
}

/* Trimestre badge */
.trimestre-badge {
  display: inline-block;
  padding: 5px 15px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(245, 158, 11, 0.3);
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

.btn-action.warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
}

.btn-action.success {
  background: linear-gradient(135deg, #10b981, #34d399);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
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
  .trimestre-page {
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
}
</style>