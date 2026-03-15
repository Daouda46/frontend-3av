<template>
  <div class="pret-page">
    <Loader :isLoading="isLoading" />
    
    <!-- En-tête avec titre stylisé -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h3 class="page-title">
            <i class="bi bi-cash-stack me-2 text-primary"></i>
            Gestion des prêts
          </h3>
          <p class="text-muted mb-0">Suivez et gérez toutes les demandes de prêts</p>
        </div>
        <div class="col-md-4 text-end">
          <div class="stats-badge">
            <span class="badge bg-primary me-2">
              <i class="bi bi-database"></i> Total: {{ pretStore.getterPret.length }}
            </span>
            <span class="badge bg-info">
              <i class="bi bi-cash"></i> {{ formatageMontant(totalMontantGlobalEncours) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche améliorée -->
    <div class="row mb-4">
      <div class="col-md-5">
        <div class="search-wrapper">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search-input"
            placeholder="Rechercher par nom, prénom ou contact..."
          />
        </div>
      </div>
    </div>

    <!-- Onglets améliorés -->
    <div class="tab-container mb-4">
      <div class="nav nav-tabs" role="tablist">
        <button
          class="nav-tab"
          :class="activeTab === 1 ? 'active warning' : ''"
          @click="activeTab = 1"
        >
          <i class="bi bi-clock-history me-2"></i>
          En cours
          <span class="tab-badge">{{ encoursTaile }}</span>
        </button>
        <button
          class="nav-tab"
          :class="activeTab === 2 ? 'active success' : ''"
          @click="activeTab = 2"
        >
          <i class="bi bi-check-circle me-2"></i>
          Acceptés
          <span class="tab-badge">{{ accepterTaile }}</span>
        </button>
        <button
          class="nav-tab"
          :class="activeTab === 3 ? 'active danger' : ''"
          @click="activeTab = 3"
        >
          <i class="bi bi-x-circle me-2"></i>
          Refusés
          <span class="tab-badge">{{ refuserTaile }}</span>
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="row mb-4 g-3">
      <div class="col-md-3 col-sm-6">
        <div class="stat-card bg-soft-primary">
          <div class="stat-icon">
            <i class="bi bi-hourglass-split"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">En cours</span>
            <span class="stat-value">{{ encoursTaile }}</span>
            <span class="stat-amount">{{ formatageMontant(totalMontantEncours) }}</span>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card bg-soft-success">
          <div class="stat-icon">
            <i class="bi bi-check-circle"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">Acceptés</span>
            <span class="stat-value">{{ accepterTaile }}</span>
            <span class="stat-amount">{{ formatageMontant(totalMontantAccepter) }}</span>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card bg-soft-danger">
          <div class="stat-icon">
            <i class="bi bi-x-circle"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">Refusés</span>
            <span class="stat-value">{{ refuserTaile }}</span>
            <span class="stat-amount">{{ formatageMontant(totalMontantRefuser) }}</span>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card bg-soft-info">
          <div class="stat-icon">
            <i class="bi bi-cash-stack"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">Total global</span>
            <span class="stat-value">{{ pretStore.getterPret.length }}</span>
            <span class="stat-amount">{{ formatageMontant(totalMontantGlobalEncours) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau Encours -->
    <div class="table-wrapper" v-if="activeTab === 1">
      <div class="table-header">
        <h5><i class="bi bi-clock-history me-2 text-warning"></i> Demandes en cours</h5>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle modern-table">
          <thead>
            <tr>
              <th class="text-center">N°</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Contact</th>
              <th>Mode de Paiement</th>
              <th>Date emprunt</th>
              <th class="text-end">Montant (FCFA)</th>
              <th class="text-end">Montant Total (FCFA)</th>
              <th class="text-center">Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="encoursList.length > 0">
            <tr v-for="(item, index) in encoursList" :key="item.id">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td>{{ item.nom }}</td>
              <td>{{ item.prenom }}</td>
              <td>{{ item.contact }}</td>
              <td><span class="payment-badge">{{ item.mode_paiement }}</span></td>
              <td>{{ item.date_emprunt }}</td>
              <td class="text-end montant">{{ formatageMontant(item.montant) }}</td>
              <td class="text-end montant-total">{{ formatageMontant(item.montant_total) }}</td>
              <td class="text-center">
                <span class="status-badge pending">
                  <i class="bi bi-clock me-1"></i> Encours
                </span>
              </td>
              <td class="text-center">
                <button @click="showEditModal(item.id)" class="btn-action">
                  <i class="bi bi-pencil-square"></i>
                  <span class="btn-text">Décision</span>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10" class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>Aucun prêt en cours</p>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="encoursList.length > 0">
            <tr class="table-total">
              <td colspan="6" class="text-end fw-bold">TOTAL</td>
              <td class="text-end montant fw-bold">{{ formatageMontant(totalMontantEncours) }}</td>
              <td class="text-end montant-total fw-bold">{{ formatageMontant(totalMontantGlobalEncours) }}</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Tableau Acceptés -->
    <div class="table-wrapper" v-if="activeTab === 2">
      <div class="table-header">
        <h5><i class="bi bi-check-circle me-2 text-success"></i> Demandes acceptées</h5>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle modern-table">
          <thead>
            <tr>
              <th class="text-center">N°</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Contact</th>
              <th>Mode de Paiement</th>
              <th>Date emprunt</th>
              <th class="text-end">Montant (FCFA)</th>
              <th class="text-end">Montant Total (FCFA)</th>
              <th class="text-center">Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="accepterList.length > 0">
            <tr v-for="(item, index) in accepterList" :key="item.id">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td>{{ item.nom }}</td>
              <td>{{ item.prenom }}</td>
              <td>{{ item.contact }}</td>
              <td><span class="payment-badge">{{ item.mode_paiement }}</span></td>
              <td>{{ item.date_emprunt }}</td>
              <td class="text-end montant">{{ formatageMontant(item.montant) }}</td>
              <td class="text-end montant-total">{{ formatageMontant(item.montant_total) }}</td>
              <td class="text-center">
                <span v-if="item.payer == 'PAYER'" class="status-badge success">
                  <i class="bi bi-check-circle me-1"></i> {{ item.payer }}
                </span>
                <span v-else-if="item.payer == 'ANNULER'" class="status-badge rejected">
                  <i class="bi bi-x-circle me-1"></i> {{ item.payer }}
                </span>
                <span v-else class="status-badge pending">
                  <i class="bi bi-clock me-1"></i> ENCOURS
                </span>
              </td>
              <td class="text-center">
                <button v-if="item.payer === 'PAYER'" @click="showEditModalActivaion(item.id)" class="btn-action success">
                  <i class="bi bi-pencil-square"></i>
                  <span class="btn-text">Activer</span>
                </button>
                <button v-else @click="showEditModalPayer(item.id)" class="btn-action">
                  <i class="bi bi-pencil-square"></i>
                  <span class="btn-text">Payer</span>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10" class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>Aucun prêt accepté</p>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="accepterList.length > 0">
            <tr class="table-total">
              <td colspan="6" class="text-end fw-bold">TOTAL</td>
              <td class="text-end montant fw-bold">{{ formatageMontant(totalMontantAccepter) }}</td>
              <td class="text-end montant-total fw-bold">{{ formatageMontant(totalMontantGlobalAccepter) }}</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Tableau Refusés -->
    <div class="table-wrapper" v-if="activeTab === 3">
      <div class="table-header">
        <h5><i class="bi bi-x-circle me-2 text-danger"></i> Demandes refusées</h5>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle modern-table">
          <thead>
            <tr>
              <th class="text-center">N°</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Contact</th>
              <th>Mode de Paiement</th>
              <th>Date emprunt</th>
              <th class="text-end">Montant (FCFA)</th>
              <th class="text-end">Montant Total (FCFA)</th>
              <th class="text-center">Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="refuserList.length > 0">
            <tr v-for="(item, index) in refuserList" :key="item.id">
              <td class="text-center">
                <span class="row-number">{{ index + 1 }}</span>
              </td>
              <td>{{ item.nom }}</td>
              <td>{{ item.prenom }}</td>
              <td>{{ item.contact }}</td>
              <td><span class="payment-badge">{{ item.mode_paiement }}</span></td>
              <td>{{ item.date_emprunt }}</td>
              <td class="text-end montant">{{ formatageMontant(item.montant) }}</td>
              <td class="text-end montant-total">{{ formatageMontant(item.montant_total) }}</td>
              <td class="text-center">
                <span class="status-badge rejected">
                  <i class="bi bi-x-circle me-1"></i> Refusé
                </span>
              </td>
              <td class="text-center">
                <button @click="showEditModal(item.id)" class="btn-action">
                  <i class="bi bi-pencil-square"></i>
                  <span class="btn-text">Décision</span>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10" class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>Aucun prêt refusé</p>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="refuserList.length > 0">
            <tr class="table-total">
              <td colspan="6" class="text-end fw-bold">TOTAL</td>
              <td class="text-end montant fw-bold">{{ formatageMontant(totalMontantRefuser) }}</td>
              <td class="text-end montant-total fw-bold">{{ formatageMontant(totalMontantGlobalRefuser) }}</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    
    <!-- DEBUT DES MODALS -->
    <!-- Modal décision trésorière -->
    <div
      class="modal"
      id="disabledAnimation"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEditTreso"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title margin-left:40%">Prendre la décision du prêt</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="row g-3 needs-validation">
              <div class="col-md-12">
                <label class="form-label" for="validationCustom01"
                  >Décision <span style="color: red">*</span>
                  <span v-for="(error, errorIndex) in $v.statut.$errors" :key="errorIndex">
                    <span style="color: red">Ce champs est obligatoire</span>
                  </span>
                </label>
                <div>
                  <select class="form-select" v-model="formEdit.statut">
                    <option value="">Choisir une décision</option>
                    <option value="2">Accepter</option>
                    <option value="4">Accepter partiellement</option>
                  </select>
                </div>
              </div>
              <div class="mb-3" v-if="formEdit.statut == 4">
                <label class="form-label">Montant disponible <span style="color:red">*</span> </label>
                <input type="number" class="form-control" v-model="formEdit.montant" />
              </div>
              <div class="mb-3" v-if="formEdit.statut == 4">
                <label class="form-label">Montant total à rembourser (taux 7%)</label>
                <input
                  type="text"
                  class="form-control bg-light"
                  :value="calculateTotalAmount"
                  readonly
                />
              </div>
              <div class="mb-3" v-if="formEdit.statut == 3">
                <label for="message" class="form-label">
                  <i class="bi bi-chat-left-text me-2"></i>Motif
                </label>
                <textarea
                  class="form-control"
                  id="message"
                  v-model="formEdit.observation"
                  rows="3"
                  placeholder="Entrez votre observation"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" @click="pretDecisionTreso">Valider</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal décision président -->
    <div
      class="modal"
      id="disabledAnimation"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEdit"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title margin-left:40%">Prendre la décision du prêt</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="row g-3 needs-validation">
              <div class="col-md-12">
                <label class="form-label" for="validationCustom01"
                  >Décision <span style="color: red">*</span>
                  <span v-for="(error, errorIndex) in $v.statut.$errors" :key="errorIndex">
                    <span style="color: red">Ce champs est obligatoire</span>
                  </span>
                </label>
                <div>
                  <select class="form-select" v-model="formEdit.statut">
                    <option value="">Choisir une décision</option>
                    <option value="2">Accepter</option>
                    <option value="4">Accepter partiellement</option>
                    <option value="3">Rejéter</option>
                  </select>
                </div>
              </div>
              <div class="mb-3" v-if="formEdit.statut == 4">
                <label class="form-label">Montant disponible <span style="color:red">*</span> </label>
                <input type="number" class="form-control" v-model="formEdit.montant" />
              </div>
              <div class="mb-3" v-if="formEdit.statut == 4">
                <label class="form-label">Montant total à rembourser (taux 7%)</label>
                <input
                  type="text"
                  class="form-control bg-light"
                  :value="calculateTotalAmount"
                  readonly
                />
              </div>
              <div class="mb-3" v-if="formEdit.statut == 3">
                <label for="message" class="form-label">
                  <i class="bi bi-chat-left-text me-2"></i>Motif
                </label>
                <textarea
                  class="form-control"
                  id="message"
                  v-model="formEdit.observation"
                  rows="3"
                  placeholder="Entrez votre observation"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" @click="pretDecision">Valider</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal paiement -->
    <div
      class="modal"
      id="disabledAnimation"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEditPayer"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title margin-left:40%">Paiement du prêt</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="row g-3 needs-validation">
              <div class="col-md-12">
                <label class="form-label" for="validationCustom01"
                  >Décision <span style="color: red">*</span>
                  <span v-for="(error, errorIndex) in $v.statut.$errors" :key="errorIndex">
                    <span style="color: red">Ce champs est obligatoire</span>
                  </span>
                </label>
                <div>
                  <select class="form-select" v-model="formEdit.payer">
                    <option value="">Choisir une décision</option>
                    <option value="PAYER">Payer</option>
                  </select>
                </div>
              </div>
              <div class="mb-3" v-if="formEdit.payer == 'ANNULER'">
                <label for="message" class="form-label">
                  <i class="bi bi-chat-left-text me-2"></i>Motif
                </label>
                <textarea
                  class="form-control"
                  id="message"
                  v-model="formEdit.observation"
                  rows="3"
                  placeholder="Entrez votre observation"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" @click="pretPaiement">Valider</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal activation -->
    <div
      class="modal"
      id="disabledAnimation"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefActivation"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><b>Activation du prélèvement</b></h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form class="row g-3 needs-validation">
              <div class="col-md-12">
                <label class="form-label" for="validationCustom02">Année</label>
                <select class="form-select" v-model="formData.annee_id">
                  <option value=""></option>
                  <option v-for="(item, index) in exerciceStore.getterExerciceBudgetaire" :key="index" :value="item.id">
                    {{ item.annee }}
                  </option>
                </select>
              </div>
              <div class="col-md-12">
                <label class="form-label" for="validationCustom02">Trimestre</label>
                <select class="form-select" v-model="formData.trimestre_id">
                  <option value=""></option>
                  <option v-for="(item, index) in trimestreParAnnee" :key="index" :value="item.id">
                    {{ item.trimestre }} -- {{ item.annee }}
                  </option>
                </select>
              </div>
              <div class="col-md-12">
                <label class="form-label" for="validationCustom02">Nombre de trimestre</label>
                <select class="form-select" v-model="formData.trimestre">
                  <option value=""></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" @click="ValiderActivation">Valider</button>
          </div>
        </div>
      </div>
    </div>
    <!-- FIN DES MODALS -->
  </div>
</template>

<script setup lang="ts">
import { Modal } from 'bootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ref, reactive, onMounted, computed } from 'vue'
import { usePret } from '../../stores/finance/pret'
import { formatageMontant } from '../../config/utils'
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'
import { dateDuJourFormatAnglais } from '../../config/utils'
import { useAuthStore } from '../../stores/auth/user'
import { useExerciceBudgetaireStore } from '../../stores/parametrage/exerciceBudgetaire'
import { useTrimestreStore } from '../../stores/parametrage/trimestre'

const authStore = useAuthStore()
const pretStore = usePret()
const trimestreStore = useTrimestreStore()
const exerciceStore = useExerciceBudgetaireStore()
const searchTerm = ref('')
const activeTab = ref(1)
const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const modalRefRemb = ref<HTMLDivElement | null>(null)
const modalRefEditPayer = ref<HTMLDivElement | null>(null)
const modalRefEditTreso = ref<HTMLDivElement | null>(null)
const modalRefActivation = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const form = reactive({
  statut: 0,
})
const formData = reactive({
  id: 0,
  annee_id: 0,
  trimestre_id: 0,
  trimestre: 0,
})
const formRemboursement = reactive({
  id: 0,
  pret_id: 0,
  montant_a_rembourser: 0,
  user_id: 0,
  etape_remboursement: '',
})
const formEdit = reactive({
  id: 0,
  position: 0,
  statut: 0,
  montant: 0,
  montant_total: 0,
  payer: '',
  observation: '',
})

const trimestreParAnnee = computed(() => {
  return trimestreStore.getterTrimestre.filter(
    (item) => String(item.annee) === String(trouveAnnee.value)
  )
})

const trouveAnnee = computed(() => {
  const year = exerciceStore.getterExerciceBudgetaire.find(
    (item) => String(item.id) === String(formData.annee_id)
  )
  if (year) {
    return year.annee
  }
  return 0
})

// Calcul du montant total avec intérêt
const calculateTotalAmount = computed(() => {
  if (formEdit.montant != 0 && formEdit.statut == 4) {
    return formEdit.montant + formEdit.montant * 0.07
  }
  return formEdit.montant_total
})

// POUR L ADMINISTRATEUR
const encoursTaile = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 1).length
})
const accepterTaile = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 2).length
})
const refuserTaile = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 3).length
})

const encoursList = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 1)
})
const accepterList = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 2)
})
const refuserList = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 3)
})

// MONTANT ENCOURS
const totalMontantEncours = computed(() => {
  return encoursList.value.reduce((sum, item) => sum + item.montant, 0)
})
const totalMontantGlobalEncours = computed(() => {
  return encoursList.value.reduce((sum, item) => sum + item.montant_total, 0)
})

// MONTANT ACCEPTER
const totalMontantAccepter = computed(() => {
  return accepterList.value.reduce((sum, item) => sum + item.montant, 0)
})
const totalMontantGlobalAccepter = computed(() => {
  return accepterList.value.reduce((sum, item) => sum + item.montant_total, 0)
})

// MONTANT REFUSER
const totalMontantRefuser = computed(() => {
  return refuserList.value.reduce((sum, item) => sum + item.montant, 0)
})
const totalMontantGlobalRefuser = computed(() => {
  return refuserList.value.reduce((sum, item) => sum + item.montant_total, 0)
})

// POUR LA TRESORIERE
const encoursTaileTreso = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 1).length
})
const accepterTaileTreso = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 2).length
})
const refuserTaileTreso = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 3).length
})

const encoursListTreso = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 1)
})
const accepterListTreso = computed(() => {
  return filteredPret.value.filter((item) => item.statut === 2)
})

// MONTANT ENCOURS TRESO
const totalMontantEncoursTreso = computed(() => {
  return encoursListTreso.value.reduce((sum, item) => sum + item.montant, 0)
})
const totalMontantGlobalEncoursTreso = computed(() => {
  return encoursListTreso.value.reduce((sum, item) => sum + item.montant_total, 0)
})

// MONTANT ACCEPTER TRESO
const totalMontantAccepterTreso = computed(() => {
  return accepterListTreso.value.reduce((sum, item) => sum + item.montant, 0)
})
const totalMontantGlobalAccepterTreso = computed(() => {
  return accepterListTreso.value.reduce((sum, item) => sum + item.montant_total, 0)
})

// Fonction pour filtrer la liste
const filteredPret = computed(() => {
  if (!searchTerm.value) return pretStore.getterPret

  const keyword = searchTerm.value.toLowerCase()
  return pretStore.getterPret.filter(
    (item) =>
      item.nom?.toLowerCase().includes(keyword) ||
      item.prenom?.toLowerCase().includes(keyword) ||
      item.contact?.toLowerCase().includes(keyword)
  )
})

// appel modal d'enregistrement
const showModal = () => {
  if (modalRef.value) {
    const modalInstance = new Modal(modalRef.value)
    modalInstance.show()
  }
}

// 🔹 computed pour calculer la position selon role_id
const position = computed(() => {
  const roleId = authStore.currentUser.role_id
  if (roleId === 1) return 2
  if (roleId === 2) return 3
  return null
})

// Fonction de fermeture du modal après modification
const closeModal = () => {
  const modal = Modal.getInstance(modalRefEdit.value)
  const modalTreso = Modal.getInstance(modalRefEditTreso.value)
  const modalPayer = Modal.getInstance(modalRefEditPayer.value)
  const modalActivation = Modal.getInstance(modalRefActivation.value)
  
  if (modal) modal.hide()
  if (modalTreso) modalTreso.hide()
  if (modalPayer) modalPayer.hide()
  if (modalActivation) modalActivation.hide()
}

// fonction de modification dans la base
function pretDecision() {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      let objet = {
        montantTotal: calculateTotalAmount.value,
        status: formEdit.statut == 4 ? 2 : formEdit.statut,
        positionPret: 2, // au niveau du president
        date_president: dateDuJourFormatAnglais(new Date()),
        ...formEdit,
      }
      console.log(objet)
      isLoading.value = true
      pretStore.visePret(objet).then(() => {
        isLoading.value = false
        closeModal()
      })
    } catch (error) {
      console.error('Login failed:', error)
      isLoading.value = false
    }
  } else {
    console.log($v)
  }
}

// fonction de prise de decision de la trésorière
function pretDecisionTreso() {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      let objet = {
        montantTotal: calculateTotalAmount.value,
        status: formEdit.statut == 4 ? 2 : formEdit.statut,
        positionPret: 3, // au niveau du tresorier
        date_tresorie: dateDuJourFormatAnglais(new Date()),
        ...formEdit,
      }
      console.log(objet)
      isLoading.value = true
      pretStore.visePretTresorie(objet).then(() => {
        isLoading.value = false
        closeModal()
      })
    } catch (error) {
      console.error('Login failed:', error)
      isLoading.value = false
    }
  } else {
    console.log($v)
  }
}

// fonction de validation du prélèvement
function ValiderActivation() {
  try {
    let objet = {
      ...formData,
    }
    console.log(objet)
    isLoading.value = true
    pretStore.activationPret(objet).then(() => {
      isLoading.value = false
      closeModal()
    })
  } catch (error) {
    console.error('Login failed:', error)
    isLoading.value = false
  }
}

// fonction de modification dans la base
function pretPaiement() {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    try {
      let objet = {
        ...formEdit,
      }
      console.log(objet)
      isLoading.value = true
      pretStore.paiementPret(objet).then(() => {
        isLoading.value = false
        closeModal()
      })
    } catch (error) {
      console.error('Login failed:', error)
      isLoading.value = false
    }
  } else {
    console.log($v)
  }
}

const showEditModal = (id: number) => {
  // recherche de l'id selectionné dans le getter
  const data = pretStore.getterPret.find((item) => item.id === id)
  if (data) {
    // on remplit les champs du formulaire avec les données
    formEdit.id = data.id
    formEdit.montant = data.montant
    formEdit.montant_total = data.montant_total
    formEdit.observation = ''
    formEdit.statut = 0
    if (modalRefEdit.value) {
      const modalInstance = new Modal(modalRefEdit.value)
      modalInstance.show()
    } else {
      console.error(`Modal reference not found for id ${id}`)
    }
  } else {
    console.error(`Data with id ${id} not found`)
  }
}

const showEditModalTreso = (id: number) => {
  // recherche de l'id selectionné dans le getter
  const data = pretStore.getterPret.find((item) => item.id === id)
  if (data) {
    // on remplit les champs du formulaire avec les données
    formEdit.id = data.id
    formEdit.montant = data.montant
    formEdit.montant_total = data.montant_total
    formEdit.observation = ''
    formEdit.statut = 0
    if (modalRefEditTreso.value) {
      const modalInstance = new Modal(modalRefEditTreso.value)
      modalInstance.show()
    } else {
      console.error(`Modal reference not found for id ${id}`)
    }
  } else {
    console.error(`Data with id ${id} not found`)
  }
}

const showEditModalPayer = (id: number) => {
  // recherche de l'id selectionné dans le getter
  const data = pretStore.getterPret.find((item) => item.id === id)
  if (data) {
    // on remplit les champs du formulaire avec les données
    formEdit.id = data.id
    formEdit.payer = data.payer
    if (modalRefEditPayer.value) {
      const modalInstance = new Modal(modalRefEditPayer.value)
      modalInstance.show()
    } else {
      console.error(`Modal reference not found for id ${id}`)
    }
  } else {
    console.error(`Data with id ${id} not found`)
  }
}

// Model d activation du prélèment
const showEditModalActivaion = (id: number) => {
  // recherche de l'id selectionné dans le getter
  const data = pretStore.getterPret.find((item) => item.id === id)
  if (data) {
    // on remplit les champs du formulaire avec les données
    formData.id = data.id
    formData.trimestre = data.trimestre
    formData.annee_id = 0
    formData.trimestre_id = 0
    if (modalRefActivation.value) {
      const modalInstance = new Modal(modalRefActivation.value)
      modalInstance.show()
    } else {
      console.error(`Modal reference not found for id ${id}`)
    }
  } else {
    console.error(`Data with id ${id} not found`)
  }
}

// fonction de suppression dans la bd
function supprimer(id: number) {
  Swal.fire({
    title: 'Suppression',
    text: 'êtes-vous sûr de vouloir effectuer cette action ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, Supprimer',
    cancelButtonText: 'Annuler !',
    confirmButtonColor: '#FF6150',
    cancelButtonColor: '#969392',
  }).then((res) => {
    if (res.isConfirmed) {
      pretStore.supprimerPret(id)
    }
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const rules = {
  statut: { required },
}

const $v = useVuelidate(rules, formEdit)

onMounted(async () => {
  try {
    isLoading.value = true
    await pretStore.getPret()
    await pretStore.getListeRemboursement()
    await trimestreStore.getTrimestre()
    await exerciceStore.getExerciceBudgetaire()
  } catch (error) {
    console.error('Erreur lors du chargement des fonctions:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Page container */
.pret-page {
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
  margin-bottom: 20px;
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

/* Tabs */
.tab-container {
  background: white;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.nav-tabs {
  display: flex;
  gap: 10px;
  border: none;
}

.nav-tab {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-tab:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.nav-tab.active {
  color: white;
}

.nav-tab.active.warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.nav-tab.active.success {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.nav-tab.active.danger {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.tab-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-left: 8px;
}

/* Stat cards */
.stat-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-card.bg-soft-primary .stat-icon { background: rgba(58, 123, 213, 0.1); color: #3a7bd5; }
.stat-card.bg-soft-success .stat-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.stat-card.bg-soft-danger .stat-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.stat-card.bg-soft-info .stat-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

.stat-content {
  flex: 1;
}

.stat-label {
  display: block;
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.stat-amount {
  display: block;
  font-size: 0.85rem;
  color: #475569;
}

/* Table wrapper */
.table-wrapper {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  margin-top: 20px;
}

.table-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f5f9;
}

.table-header h5 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Modern table */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 5px;
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
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.modern-table tbody tr:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
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
  width: 28px;
  height: 28px;
  background: #f1f5f9;
  border-radius: 8px;
  font-weight: 600;
  color: #475569;
  font-size: 0.85rem;
}

/* Payment badge */
.payment-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #475569;
  font-weight: 500;
}

/* Status badge */
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

/* Action button */
.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action.success {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-action i {
  font-size: 0.9rem;
}

/* Montant */
.montant {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #3a7bd5;
}

.montant-total {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #10b981;
}

/* Table total */
.table-total {
  background: linear-gradient(135deg, #1e293b, #0f172a) !important;
  color: white !important;
}

.table-total td {
  color: white !important;
  padding: 15px;
  border-radius: 0 0 10px 10px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px !important;
  background: white;
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

/* Responsive */
@media (max-width: 768px) {
  .pret-page {
    padding: 10px;
  }
  
  .btn-text {
    display: none;
  }
  
  .btn-action {
    padding: 8px;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .nav-tab {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
}

.fw-bold td {
  background-color: #0829ab !important;
  color: white !important;
  font-weight: bold;
  text-align: center;
}

.add-button {
  display: inline;
  margin-left: 800%;
}

.full-width-card {
  width: 100%;
  max-width: 100%;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Espacement entre les sections */
.card-title {
  margin-bottom: 1rem;
  font-weight: 600;
}

.card-body {
  flex: 1 1 auto;
  padding: 30px;
  border-radius: 15px;
}

/* Style de l'en-tête du tableau */
.table-dark {
  --bs-table-bg: #3a7bd5;
  --bs-table-striped-bg: #3a7bd5;
  --bs-table-striped-color: #fff;
  --bs-table-active-bg: #3a7bd5;
  --bs-table-active-color: #fff;
  --bs-table-hover-bg: #3a7bd5;
  --bs-table-hover-color: #fff;
  color: white;
  border-color: #3a7bd5;
}

.total-row td {
  background-color: #0829ab !important;
  color: white !important;
  font-weight: bold;
  text-align: center;
}

/* Dégradé pour l'en-tête (optionnel) */
.table-dark {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
}

/* Style des cellules de l'en-tête */
.table-dark th {
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85rem;
}

/* Style au survol des cellules de l'en-tête */
.table-dark th:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
}
</style>