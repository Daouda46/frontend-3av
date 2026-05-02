<template>
  <div class="attestations-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête de la page -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h3 class="page-title">
            <i class="bi bi-file-text me-2 text-primary"></i>
            Gestion des attestations
          </h3>
          <p class="text-muted mb-0">Gérez les attestations de redevance et non-redevance</p>
        </div>
        <div class="col-md-6 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ attestationStore.getterAttestation.length }}
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
            placeholder="Rechercher par nom, prénom ou matricule..."
          />
        </div>
      </div>
      <div class="col-md-7 text-end">
        <button type="button" class="btn btn-primary btn-add" @click="showModal">
          <i class="bi bi-plus-lg me-2"></i>
          Nouvelle attestation
        </button>
      </div>
    </div>

    <!-- Onglets de statut -->
    <div class="tab-container mb-4">
      <div class="tab-buttons">
        <button
          class="tab-btn"
          :class="activeTab === 'oui' ? 'active primary' : ''"
          @click="activeTab = 'oui'"
        >
          <i class="bi bi-check-circle me-2"></i>
          Redevance
          <span class="tab-badge">{{ redevanceTaile }}</span>
        </button>
        <button
          class="tab-btn"
          :class="activeTab === 'non' ? 'active info' : ''"
          @click="activeTab = 'non'"
        >
          <i class="bi bi-x-circle me-2"></i>
          Non Redevance
          <span class="tab-badge">{{ nonRedevanceTaile }}</span>
        </button>
      </div>
    </div>

    <!-- Tableau des attestations -->
    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="table modern-table">
          <thead class="table-header-custom">
            <tr>
              <th class="text-center">N°</th>
              <th>Bénéficiaire</th>
              <th>Matricule</th>
              <th>Contact</th>
              <th class="text-end">Montant</th>
              <th>Emploi</th>
              <th class="text-center">Fiche</th>
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
                <span class="matricule-badge">{{ item.matricule || 'N/D' }}</span>
              </td>
              <td>
                <div class="contact-info">
                  <i class="bi bi-telephone"></i>
                  <span>{{ item.telephone || 'N/D' }}</span>
                </div>
              </td>
              <td class="text-end">
                <span v-if="item.redevance === 'oui'" class="montant-badge">
                  {{ formatageMontant(item.montant) }} FCFA
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <span class="emploi-text">{{ item.emploi || 'N/D' }}</span>
              </td>
              <td class="text-center">
                <button 
                    @click="fonctionView(item.id)"   
                  class="btn-action primary"
                  title="Voir la fiche"
                >
                  <i class="bi bi-file-pdf"></i>
                </button>
                <!-- <button 
                  @click="showEditModal(item.id, (currentPage - 1) * itemsPerPage + index + 1)" 
                  class="btn-action primary"
                  title="Voir la fiche"
                >
                  <i class="bi bi-file-pdf"></i>
                </button> -->
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button 
                    @click="showEditModalAttestation(item.id)" 
                    class="btn-action warning" 
                    title="Modifier"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <!-- <button 
                    @click="showEditModalAttestation(item.id)" 
                    class="btn-action warning" 
                    title="Modifier"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button> -->
                  <button 
                    @click="supprimer(item.id)" 
                    class="btn-action danger" 
                    title="Supprimer"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="8" class="empty-state">
                <i class="bi bi-file-text"></i>
                <p>Aucune attestation trouvée</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper" v-if="attestationList.length > itemsPerPage">
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
                <h5 class="modal-title">Nouvelle attestation</h5>
                <p class="modal-subtitle">Créez une attestation pour un membre</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Type d'attestation -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-tag me-2"></i>Type d'attestation <span class="text-danger">*</span>
                </label>
                <div class="type-selector">
                  <button 
                    type="button"
                    class="type-btn"
                    :class="{ active: form.redevance === 'oui' }"
                    @click="form.redevance = 'oui'"
                  >
                    <i class="bi bi-check-circle"></i>
                    Redevance
                  </button>
                  <button 
                    type="button"
                    class="type-btn"
                    :class="{ active: form.redevance === 'non' }"
                    @click="form.redevance = 'non'"
                  >
                    <i class="bi bi-x-circle"></i>
                    Non Redevance
                  </button>
                </div>
                <div class="invalid-feedback" v-if="$v.redevance.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Membre -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-person me-2"></i>Membre <span class="text-danger">*</span>
                </label>
                <model-list-select
                  :list="formatPersonnel()"
                  v-model="form.personnel_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Sélectionnez un membre"
                  class="form-select"
                  :class="{ 'is-invalid': $v.personnel_id.$error }"
                />
                <div class="invalid-feedback" v-if="$v.personnel_id.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Montant (pour redevance) -->
              <div class="form-group mb-3" v-if="form.redevance === 'oui'">
                <label class="form-label">
                  <i class="bi bi-cash me-2"></i>Montant
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">FCFA</span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="form.montant"
                    min="0"
                    placeholder="Ex: 50000"
                  />
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

    <!-- Modal de modification attestation -->
    <div
      class="modal fade"
      id="editAttestationModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEditAttestation"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon">
                <i class="bi bi-pencil-square"></i>
              </div>
              <div>
                <h5 class="modal-title">Modifier l'attestation</h5>
                <p class="modal-subtitle">Modifiez les informations de l'attestation</p>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation">
              <!-- Type d'attestation -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-tag me-2"></i>Type d'attestation <span class="text-danger">*</span>
                </label>
                <div class="type-selector">
                  <button 
                    type="button"
                    class="type-btn"
                    :class="{ active: formEdit.redevance === 'oui' }"
                    @click="formEdit.redevance = 'oui'"
                  >
                    <i class="bi bi-check-circle"></i>
                    Redevance
                  </button>
                  <button 
                    type="button"
                    class="type-btn"
                    :class="{ active: formEdit.redevance === 'non' }"
                    @click="formEdit.redevance = 'non'"
                  >
                    <i class="bi bi-x-circle"></i>
                    Non Redevance
                  </button>
                </div>
                <div class="invalid-feedback" v-if="$v_edit.redevance.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Membre -->
              <div class="form-group mb-3">
                <label class="form-label">
                  <i class="bi bi-person me-2"></i>Membre <span class="text-danger">*</span>
                </label>
                <model-list-select
                  :list="formatPersonnel()"
                  v-model="formEdit.personnel_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Sélectionnez un membre"
                  class="form-select"
                  :class="{ 'is-invalid': $v_edit.personnel_id.$error }"
                />
                <div class="invalid-feedback" v-if="$v_edit.personnel_id.$error">
                  Ce champ est requis
                </div>
              </div>

              <!-- Montant (pour redevance) -->
              <div class="form-group mb-3" v-if="formEdit.redevance === 'oui'">
                <label class="form-label">
                  <i class="bi bi-cash me-2"></i>Montant
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">FCFA</span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="formEdit.montant"
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

    <!-- Modal de visualisation de l'attestation -->
    <div
      class="modal fade"
      id="viewModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEdit"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <div class="d-flex justify-content-between align-items-center w-100">
              <div class="d-flex gap-2">
                <vue3-print-nb class="btn btn-outline-primary btn-sm" @click="printFiche">
                  <i class="bi bi-printer me-1"></i> Imprimer
                </vue3-print-nb>
                <button class="btn btn-outline-secondary btn-sm" @click="decreaseFont">
                  <i class="bi bi-dash"></i>
                </button>
                <button class="btn btn-outline-secondary btn-sm" @click="increaseFont">
                  <i class="bi bi-plus"></i>
                </button>
                <span class="badge bg-light text-dark align-self-center">{{ fontSize }}px</span>
              </div>
              <h4 class="modal-title flex-grow-1 text-center">DEMANDE D'ATTESTATION</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>
          <div class="modal-body">
            <div class="attestation" id="printArea" :style="{ fontSize: fontSize + 'px' }">
              <!-- Header -->
              <div class="header">
                <div class="left">
                  <img src="../../../public/assets/images/logo.jpg" alt="logo" class="logo" />
                  <p><strong>Le Président</strong></p>
                  <p>N°{{ numeroCredential < 10 ? '0' + numeroCredential : numeroCredential }}/2025/3AV/Sg</p>
                </div>
                <div class="right">
                  <p><strong>RÉPUBLIQUE DE CÔTE D'IVOIRE</strong></p>
                  <p>Union – Discipline - Travail</p>
                </div>
              </div>

              <!-- Title -->
              <h2 class="title">
                ATTESTATION DE <span v-if="attestationCredential.redevance == 'non'">NON</span> REDEVANCE 
                N°{{ numeroCredential < 10 ? '0' + numeroCredential : numeroCredential }}/2025
              </h2>

              <!-- Body -->
              <div class="body">
                <p>
                  Je soussigné, <strong>{{ modele.signataire }}</strong>, Président de
                  l'Amicale des Agents Vérificateurs et Assimilés (3AV) de la Direction
                  du Contrôle Financier,
                  atteste que Monsieur <strong>{{ attestationCredential.nom }} {{ attestationCredential.prenom }}</strong>,
                </p>
                <p>
                  Matricule : {{ attestationCredential.matricule }}, <br />
                  Emploi : {{ attestationCredential.emploi }}, <br />
                  Direction : {{ modele.direction }},
                </p>
                <p>
                  <span v-if="attestationCredential.redevance == 'non'">
                    ne nous est redevable d'aucune somme à ce jour.
                  </span>
                  <span v-else>
                    nous est redevable de la somme de <strong>{{ montantEnLettres(attestationCredential.montant) }}</strong> 
                    (<strong>{{ formatageMontantCFA(attestationCredential.montant) }}</strong>), à ce jour.
                  </span>
                </p>
                <p>
                  En foi de quoi, la présente lui est délivrée pour servir et valoir ce
                  que de droit.
                </p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>Fait à Abidjan, le {{ dateDuJour(new Date()) }}</p>
              </div>
              <div class="footer-right">
                <p>* Sauf erreurs ou omissions de notre part.</p>
              </div>
            </div>
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
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'
import { formatageMontant, formatageMontantCFA, dateDuJour } from '../../config/utils'
import { usePersonnel } from '../../stores/auth/personnel'
import { useAttestation } from '../../stores/auth/attestation'
import { ModelListSelect } from 'vue-search-select'
import printJS from 'print-js'
import writtenNumber from 'written-number'

writtenNumber.defaults.lang = 'fr'

const personnelStore = usePersonnel()
const attestationStore = useAttestation()
const searchTerm = ref('')
const numeroCredential = ref(0)
const activeTab = ref('oui')
const fontSize = ref(16)
const itemsPerPage = 10
const currentPage = ref(1)


const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const modalRefEditAttestation = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const router = useRouter();


const fonctionView = (id) => {
  router.push({
    name: "attestationRedevance",
    params: { id: id }
  });
};
interface Attestation {
  id: number
  personnel_id: string
  redevance: string
  montant?: number
}

interface AttestationCredential {
  id?: number
  montant?: number
  redevance: string
  nom?: string
  prenom?: string
  matricule?: string
  telephone?: string
  fonction?: string
  emploi?: string
}

const form = reactive<Attestation>({
  id: 0,
  personnel_id: '',
  redevance: '',
  montant: 0,
})

const formEdit = reactive<Attestation>({
  id: 0,
  personnel_id: '',
  redevance: '',
  montant: 0,
})

const attestationCredential = reactive<AttestationCredential>({
  id: 0,
  redevance: '',
  nom: '',
  prenom: '',
  montant: 0,
  matricule: '',
  emploi: '',
})

const modele = ref({
  signataire: 'Aboubakar Sidick BERTE',
  direction: 'Direction du Contrôle Financier',
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

const formatPersonnel = () => {
  return personnelStore.getterPersonnel.map(p => ({
    id: p.id,
    libelle: `${p.matricule}-${p.nom}-${p.prenom}`
  }))
}

function montantEnLettres(montant: number) {
  return writtenNumber(montant)
}

function increaseFont() {
  fontSize.value += 2
}

function decreaseFont() {
  if (fontSize.value > 10) fontSize.value -= 2
}

function printFiche() {
  const customCss = `
    @page { size: A4 portrait; margin: 15mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .attestation { width: 100%; margin: auto; padding: 18px; font-family: "Times New Roman", serif; font-size: ${fontSize.value}pt !important; color: #000; background: #fff; }
    .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .left { font-size: ${fontSize.value - 4}pt !important; }
    .left .logo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; }
    .right { font-size: ${fontSize.value - 4}pt !important; text-align: right; }
    .title { text-align: center; font-size: ${fontSize.value + 8}pt !important; font-weight: bold; text-decoration: underline; margin: 18px 0; }
    .body { text-align: justify; line-height: 2; font-size: ${fontSize.value}pt !important; }
    .footer { margin-top: 40px; text-align: right; font-size: ${fontSize.value - 2}pt !important; }
    .footer-right { margin-top: 40px; text-align: left; font-style: italic; font-size: ${fontSize.value - 2}pt !important; }
  `

  printJS({
    printable: 'printArea',
    type: 'html',
    style: customCss
  })
}

// Pagination
const attestationList = computed(() => attestationStore.getterAttestation || [])

const totalPages = computed(() => Math.ceil(attestationList.value.length / itemsPerPage))

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

const paginatedAttestation = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return attestationList.value.slice(start, end)
})

const filteredAttestation = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return paginatedAttestation.value
  return paginatedAttestation.value.filter(item =>
    [item.nom, item.prenom, item.matricule].some(field =>
      (field || '').toLowerCase().includes(q)
    )
  )
})

const filteredByTab = computed(() => {
  return filteredAttestation.value.filter(item => item.redevance === activeTab.value)
})

const redevanceTaile = computed(() => {
  return attestationList.value.filter(item => item.redevance === 'oui').length
})

const nonRedevanceTaile = computed(() => {
  return attestationList.value.filter(item => item.redevance === 'non').length
})

watch(searchTerm, () => {
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

const showModal = () => {
  if (modalRef.value) {
    form.personnel_id = ''
    form.redevance = ''
    form.montant = 0
    $v.value.$reset()
    const modalInstance = new Modal(modalRef.value)
    modalInstance.show()
  }
}

const closeModal = () => {
  const modal = Modal.getInstance(modalRef.value)
  const modalEdit = Modal.getInstance(modalRefEdit.value)
  const modalEditAttestation = Modal.getInstance(modalRefEditAttestation.value)
  if (modal) modal.hide()
  if (modalEdit) modalEdit.hide()
  if (modalEditAttestation) modalEditAttestation.hide()
}

function annulerChamp() {
  $v.value.$reset()
  form.personnel_id = ''
  form.montant = 0
}

function AjouterFonctionLocal() {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      isLoading.value = true
      attestationStore.AjouterAttestation(form).then(() => {
        isLoading.value = false
        closeModal()
        annulerChamp()
        Swal.fire({
          title: 'Succès!',
          text: "L'attestation a été ajoutée.",
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

function ModifierFonctionLocal() {
  $v_edit.value.$touch()
  if (!$v_edit.value.$invalid) {
    try {
      isLoading.value = true
      attestationStore.modifierAttestation(formEdit).then(() => {
        isLoading.value = false
        closeModal()
        Swal.fire({
          title: 'Succès!',
          text: "L'attestation a été modifiée.",
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

const showEditModal = (id: number, numero: number) => {
  const data = attestationStore.getterAttestation.find(item => item.id === id)
  numeroCredential.value = numero
  
  if (data) {
    attestationCredential.id = data.id
    attestationCredential.nom = data.nom
    attestationCredential.prenom = data.prenom
    attestationCredential.emploi = data.emploi
    attestationCredential.matricule = data.matricule
    attestationCredential.redevance = data.redevance
    attestationCredential.montant = data.montant

    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    }
  }
}

const showEditModalAttestation = (id: number) => {
  const data = attestationStore.getterAttestation.find(item => item.id === id)
  
  if (data) {
    formEdit.id = data.id
    formEdit.personnel_id = data.personnel_id
    formEdit.redevance = data.redevance
    formEdit.montant = data.montant

    if (modalRefEditAttestation.value) {
      const modalInstance = new Modal(modalRefEditAttestation.value)
      modalInstance.show()
    }
  }
}

function supprimer(id: number) {
  Swal.fire({
    title: 'Confirmation de suppression',
    text: 'Êtes-vous sûr de vouloir supprimer cette attestation ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
  }).then((res) => {
    if (res.isConfirmed) {
      attestationStore.supprimerAttestation(id)
      Swal.fire({
        title: 'Supprimé!',
        text: "L'attestation a été supprimée.",
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

const rules = {
  personnel_id: { required },
  redevance: { required },
}
const $v = useVuelidate(rules, form)

const rules_edit = {
  personnel_id: { required },
  redevance: { required },
}
const $v_edit = useVuelidate(rules_edit, formEdit)

onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      personnelStore.getPersonnel(),
      attestationStore.getAttestation()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.attestations-page {
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

.tab-btn.active.primary {
  background: linear-gradient(135deg, #3a7bd5, #2c3e50);
  color: white;
}

.tab-btn.active.info {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.tab-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-left: 8px;
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

/* Matricule badge */
.matricule-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
  font-family: 'Courier New', monospace;
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

/* Montant badge */
.montant-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

/* Emploi text */
.emploi-text {
  color: #475569;
  font-weight: 500;
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

.btn-action.primary {
  background: linear-gradient(135deg, #3a7bd5, #2c3e50);
  box-shadow: 0 4px 10px rgba(58, 123, 213, 0.3);
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
  background: linear-gradient(135deg, #3a7bd5, #2c3e50);
  color: white;
  box-shadow: 0 4px 10px rgba(58, 123, 213, 0.3);
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

/* Type selector */
.type-selector {
  display: flex;
  gap: 10px;
}

.type-btn {
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

.type-btn.active[class*="active"]:nth-child(1) {
  border-color: #3a7bd5;
  background: rgba(58, 123, 213, 0.1);
  color: #3a7bd5;
}

.type-btn.active[class*="active"]:nth-child(2) {
  border-color: #06b6d4;
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
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

/* Attestation styles */
.attestation {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 20mm;
  font-family: 'Times New Roman', serif;
  color: #000;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.left {
  text-align: left;
}

.left .logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid #333;
}

.right {
  text-align: right;
}

.title {
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
  text-decoration: underline;
  margin: 30px 0;
}

.body {
  text-align: justify;
  line-height: 2;
}

.footer {
  margin-top: 60px;
  text-align: right;
}

.footer-right {
  margin-top: 20px;
  text-align: left;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .attestations-page {
    padding: 10px;
  }
  
  .tab-buttons {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  .type-selector {
    flex-direction: column;
  }
  
  .attestation {
    width: 100%;
    padding: 10mm;
     font-family:"Times New Roman", serif;
  }
}
</style>