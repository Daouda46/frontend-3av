<template>
  <div>
    <Loader :isLoading="isLoading" />
    <div class="row mb-4">
      <div>
        <h3>Liste des attestions</h3>
      </div>

      <div class="row align-items-center mt-3">
        <div class="col-md-4">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control"
            placeholder="Rechercher par nom, prenom, matricule..."
          />
        </div>

        <div class="col-md-8 d-flex justify-content-end">
          <button type="button" class="btn btn-primary add-button" @click="showModal">
            Ajouter
          </button>
        </div>
      </div>
    </div>
    <div class="mb-3">
      <button
        class="btn"
        :class="activeTab === 'oui' ? 'btn-primary' : 'btn-outline-primary'"
        @click="activeTab = 'oui'"
      >
        Attestation de Redevance ({{ redevanceTaile }})
      </button>
      &nbsp;
      <button
        class="btn"
        :class="activeTab === 'non' ? 'btn-info' : 'btn-outline-info'"
        @click="activeTab = 'non'"
      >
        Attestation de Non Redevance ({{ nonRedevanceTaile }})
      </button>
      &nbsp;
    </div>
    <div class="row">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-dark" style="background-color: #3a7bd5; color: white">
            <tr>
              <th class="p-1 border" style="text-align: center">N°</th>
              <th class="p-1 border" style="text-align: center">Nom</th>
              <th class="p-1 border" style="text-align: center">Prenom</th>
              <th class="p-1 border" style="text-align: center">Matricule</th>
              <th class="p-1 border" style="text-align: center">Contact</th>
              <th class="p-1 border" style="text-align: center">Montant</th>
              <th class="p-1 border" style="text-align: center">Emploi</th>
              <th class="p-1 border" style="text-align: center">Fiche</th>
              <th class="p-1 border" style="text-align: center">Actions</th>
            </tr>
          </thead>
          <tbody v-if="attestationStore.getterAttestation.length > 0">
            <tr v-for="(item, index) in filteredByTab" :key="item.id">
              <td class="fw-semibold">{{ index + 1 }}</td>

              <td>
                <span class="d-flex" style="text-align: center">
                  {{ item.nom }}
                </span>
              </td>
              <td>
                <span class="d-flex" style="text-align: center">
                  {{ item.prenom }}
                </span>
              </td>
              <td>
                <span class="d-flex" style="text-align: center">
                  {{ item.matricule }}
                </span>
              </td>
              <td>
                <span class="d-flex" style="text-align: center">
                  {{ item.telephone || 'N-D' }}
                </span>
              </td>
               <td>
                <span class="d-flex" style="text-align: center">
                  {{ formatageMontant(item.montant) || 0 }}
                </span>
              </td>
              <td>
                <span class="d-flex" style="text-align: center">
                  {{ item.emploi }}
                </span>
              </td>

             
              <td>
                <button type="button" class="btn btn-primary"  @click="showEditModal(item.id, index+1)">
            Fiche
          </button>
              
              </td>
            

              <td class="text-end">
                <div class="btn-group btn-group-md">
                  <button title="Modifier"
                    @click="showEditModalAttestation(item.id)"
                    class="btn btn-sm btn-outline-success"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  
                  &nbsp;&nbsp;
                  <button title="Supprimer" class="btn btn-outline-danger" @click="supprimer(item.id)">
                    <i class="bi bi-trash"></i>
                  </button> 
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td
                colspan="5"
                style="text-align: center; color: red; font-weight: bold; font-size: 18px"
              >
                Aucune donnée saisie pour l instant
              </td>
            </tr>
          </tbody>
        </table>
      
      </div>
    </div>


    <div
      class="modal"
      id="disabledAnimation"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title flex-grow-1 text-center">Demande d'Attestion</h5>
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
                  >Type d'Attestation <span style="color: red">*</span>
                  <span v-for="(error, errorIndex) in $v.redevance.$errors" :key="errorIndex">
                    <span style="color: red">Ce champs est obligatoire</span>
                  </span>
                </label>
                <div>
                  <select class="form-select" v-model="form.redevance">
                    <option value="">Choirsir une décision</option>
                    <option value="oui">Attestation de Redevance</option>
                    <option value="non">Attestation de Non Redevance</option>
                  </select>
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label">Membres <span style="color: red"></span></label>
                <model-list-select
                  :list="formatPersonnel()"
                  v-model="form.personnel_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Selectionnez un membre"
                  class="col45"
                >
                </model-list-select>
                 <span v-for="(error, errorIndex) in $v.personnel_id.$errors" :key="errorIndex">
                    <span style="color: red">Ce champs est obligatoire</span>
                  </span>
              </div>
          <div class="col-md-12" v-if="form.redevance == 'oui'">
            <label class="form-label">Montant <span style="color: red"></span> </label>
            <input type="number" class="form-control" v-model="form.montant" />
          </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary" @click="AjouterFonctionLocal">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal"
      id="disabledAnimation"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEditAttestation"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title flex-grow-1 text-center">Demande d'Attestion</h5>
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
                  >Type d'Attestation <span style="color: red">*</span>
                  <span v-for="(error, errorIndex) in $v.redevance.$errors" :key="errorIndex">
                    <span style="color: red">Ce champs est obligatoire</span>
                  </span>
                </label>
                <div>
                  <select class="form-select" v-model="formEdit.redevance">
                    <option value="">Choirsir une décision</option>
                    <option value="oui">Attestation de Redevance</option>
                    <option value="non">Attestation de Non Redevance</option>
                  </select>
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label">Membres <span style="color: red"></span></label>
                <model-list-select
                  :list="formatPersonnel()"
                  v-model="formEdit.personnel_id"
                  option-value="id"
                  option-text="libelle"
                  placeholder="Selectionnez un membre"
                  class="col45"
                >
                </model-list-select>
                 <span v-for="(error, errorIndex) in $v.personnel_id.$errors" :key="errorIndex">
                    <span style="color: red">Ce champs est obligatoire</span>
                  </span>
              </div>
          <div class="col-md-12" v-if="formEdit.redevance == 'oui'">
            <label class="form-label">Montant <span style="color: red"></span> </label>
            <input type="number" class="form-control" v-model="formEdit.montant" />
          </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-success" @click="ModifierFonctionLocal">
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- //**
*  DEBUT  DU MODAL D'ENREGISTREMENT
*/ -->
    <div
      class="modal"
      id="disabledAnimation"
      tabindex="-1"
      data-bs-backdrop="static"
      data-keyboard="false"
      ref="modalRefEdit"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-between align-items-center">
  <!-- Bouton imprimer à gauche -->
   <div class="d-flex justify-content-end gap-2 mb-2">
  <vue3-print-nb
    class="btn btn-outline-primary btn-sm"
     @click="printFiche">
    Imprimer
  </vue3-print-nb>
      <button class="btn btn-sm btn-outline-secondary" @click="decreaseFont">Diminue-</button>
      <button class="btn btn-sm btn-outline-secondary" @click="increaseFont">Augmente+</button>
    </div>
  <!-- Titre centré -->
  <h4 class="modal-title flex-grow-1 text-center" style="font-weight:bold">
    DEMANDE D'ATTESTATION
  </h4>

  <!-- Bouton fermer à droite -->
  <button
    type="button"
    class="btn-close"
    data-bs-dismiss="modal"
    aria-label="Close">
  </button>
</div>
          <div class="modal-body">
            <!-- {{attestationCredential}} -->
            <div class="attestation" id="printArea" :style="{ fontSize: fontSize + 'px' }">
    <!-- Header -->
    <div class="header">
      <div class="left">
        <img src="../../../public/assets/images/logo.jpg" alt="logo" class="logo" />
        <p><strong>Le Président</strong></p>
        <p>N°{{numeroCredential <10 ? '0'+numeroCredential:numeroCredential }}/2025/3AV/Sg</p>
      </div>
      <div class="right">
        <p><strong>REPUBLIQUE DE CÔTE D’IVOIRE</strong></p>
        <p>Union – Discipline - Travail</p>
      </div>
    </div>

    <!-- Title -->
    <h2 class="title">ATTESTATION DE <span v-if="attestationCredential.redevance=='non'">NON</span> REDEVANCE N°{{ numeroCredential <10 ? '0'+numeroCredential:numeroCredential }}/2025</h2>

    <!-- Body -->
    <div class="body">
      <p>
        Je soussigné, <strong>{{ modele.signataire }}</strong>, Président de
        l’Amicale des Agents Vérificateurs et Assimilés (3AV) de la Direction
        du Contrôle Financier,
        atteste que Monsieur <strong>{{ attestationCredential.nom+' '+attestationCredential.prenom }}</strong>,
      </p>
      <p>
        Matricule : {{ attestationCredential.matricule }}, <br />
        Emploi : {{ attestationCredential.emploi }}, <br />
        Direction : {{ modele.direction }},
      </p>
      
      <p >
        <span v-if="attestationCredential.redevance=='non'">ne nous est redevable d'aucune somme à ce jour</span>
        <span v-else>
        nous est redevable de la somme de <strong>{{montantEnLettres(attestationCredential.montant)}}</strong> 
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
      <p>*Sauf erreurs ou omissions de notre part.</p>
    </div>
          </div>
          </div>
        
        </div>
      </div>
    </div>
    <!-- //**
*  FIN  DU MODAL D'ENREGISTREMENT
*/ -->


  </div>
</template>
<script setup lang="ts">
import { Modal } from 'bootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ref, reactive, onMounted, computed } from 'vue'
// import { DemandePrestation } from '../../shared/interfaces/demandePrestation.interface'
import { useDemandePrestation } from '../../stores/prestation/demandePrestation'
import Swal from 'sweetalert2'
import Loader from '../../components/Loader.vue'
import { formatageMontant, formatageMontantCFA, dateDuJour } from '../../config/utils';
import { toast } from 'vue3-toastify'
import { usePersonnel } from '../../stores/auth/personnel'
import { useTypePrestation } from '../../stores/prestation/typePrestation'
import { useAttestation } from '../../stores/auth/attestation'
import { ModelListSelect } from 'vue-search-select'
import printJS from "print-js"
import writtenNumber from 'written-number';

const personnelStore = usePersonnel()
const attestationStore = useAttestation()
const typePrestationStore = useTypePrestation()
const searchTerm = ref('')
const numeroCredential = ref(0)
const activeTab = ref('oui')

// Configurer le français
writtenNumber.defaults.lang = 'fr';

const fontSize = ref(16); // taille par défaut

function increaseFont() {
  fontSize.value += 2;
}
function decreaseFont() {
  if (fontSize.value > 10) fontSize.value -= 2;
}

// Variable pour stocker l'URL de prévisualisation du nouveau fichier
const previewfichier = ref<string | null>(null)
const modalRef = ref<HTMLDivElement | null>(null)
const modalRefEdit = ref<HTMLDivElement | null>(null)
const modalRefEditAttestation = ref<HTMLDivElement | null>(null)
const modalRefDecision = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)

// Méthode pour extraire le nom du fichier depuis le chemin
// (Conservez getFileName si vous en avez besoin ailleurs)
const getFileName = (filePath) => {
  return filePath?.split('/').pop().split('\\').pop() || ''
}
interface Attestation {
  id: number
  personnel_id: string
  redevance: string
  montant?: number
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
 
const formatPersonnel = () => {
  return personnelStore.getterPersonnel.map(p => ({
    id: p.id,
    libelle: `${p.nom} ${p.prenom}`
  }))
}
// Fonction qui prend un montant et retourne le montant en lettres
function montantEnLettres(montant) {
  return writtenNumber(montant);
}

function printFiche() {
  const customCss = `
    @page {
      size: A4 portrait;   /* force A4 */
      margin: 15mm;        /* marge fixe */
    }

    html, body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      zoom: 100% !important;   /* empêche le shrink */
      transform: none !important;
    }

    .attestation {
      width: 100%;
      min-height: 100%;
      margin: auto;
      padding: 18px;
      font-family: "Times New Roman", serif;
      font-size: ${fontSize.value}pt !important;
      color: #000;
      background: #fff;
    }

    .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .left { font-size: ${fontSize.value - 4}pt !important; }
    .left .logo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; }
    .right { font-size: ${fontSize.value - 4}pt !important; text-align: right; }

    .title { text-align: center; font-size: ${fontSize.value + 8}pt !important; font-weight: bold; text-decoration: underline; margin: 18px 0; }
    .body { text-align: justify; line-height: 2; margin-top: 16px; font-size: ${fontSize.value}pt !important; }
    .footer { margin-top: 40px; text-align: right; font-size: ${fontSize.value - 2}pt !important; }
    .footer-right { margin-top: 40px; text-align: left; font-style: italic; font-size: ${fontSize.value - 2}pt !important; }

    .attestation p { margin: 0 0 10px 0; line-height: 2; font-size: ${fontSize.value}pt !important; }
  `;

  const oldTitle = document.title;
  document.title = `Attestation-${attestationCredential.nom}-${attestationCredential.matricule}`;

  printJS({
    printable: 'printArea',
    type: 'html',
    style: customCss
  });

  document.title = oldTitle;
}


//Ajouter fonction
function AjouterFonctionLocal() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    try {
    //   let objet = {
    //     libelle: form.libelle,
    //     id: 0,
    //   }
       isLoading.value = true;
      attestationStore.AjouterAttestation(form).then(() => {
        isLoading.value = false;
        annulerChamp();
      });
    } catch (error) {
      console.error("Echec d'enregistrement:", error);
    //   isLoading.value = false;
    }
  }
}
// fonction de modification dans la base
function ModifierFonctionLocal() {
  $v_edit.value.$touch()
  if (!$v_edit.value.$invalid) {
    try {
      isLoading.value = true
      attestationStore.modifierAttestation(formEdit).then(() => {
        isLoading.value = false
        //    annulerChampEdit();
        closeModal()
      })
      // Fermer le modal après modification
    } catch (error) {
      console.error('Login failed:', error)
      isLoading.value = false
    }
  } else {
    console.log($v)
  }
}

const modele = ref({
  reference: "N°03/2025/3AV/Sg",
  numero: "N°03/2025",
  signataire: "Aboubakar Sidick BERTE",
  nomComplet: "BERTE ABOUBAKAR SIDICK",
  matricule: "320 140 N",
  emploi: "ATTACHE DES FINANCES",
  direction: "Direction du Contrôle Financier",
  montant: "……… (…. 000) francs CFA",
  lieu: "Abidjan",
  date: "23 juillet 2025"
})
// Découper la liste selon la page actuelle
const paginatedAttestation = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return attestationList.value.slice(start, end)
})
const filteredAttestation = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return paginatedAttestation.value
  return paginatedAttestation.value.filter((demande) =>
    [demande.nom, demande.prenom, demande.matricule].some((field) => field.toLowerCase().includes(q)),
  )
})
const filteredByTab = computed(() => {
  return filteredAttestation.value.filter((item) => item.redevance === activeTab.value)
})
const redevanceTaile = computed(() => {
  return filteredAttestation.value.filter((item) => item.redevance === 'oui').length
})
const nonRedevanceTaile = computed(() => {
  return filteredAttestation.value.filter((item) => item.redevance === 'non').length
})

// Nombre d'éléments par page
const itemsPerPage = 10

// Page actuelle
const currentPage = ref(1)

// Récupérer la liste depuis le store (existant)
const attestationList = computed(() => attestationStore.getterAttestation)

// Nombre total de pages
const totalPages = computed(() => Math.ceil(attestationList.value.length / itemsPerPage))

// Fonctions pour naviguer
const goToPage = (page) => {
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

//appel modal d'enregistrement
const showModal = () => {
  if (modalRef.value) {
    const modalInstance = new Modal(modalRef.value)
    modalInstance.show()
  }
}
// fonction pour vider les champs
function annulerChamp() {
  $v.value.$reset()
  ;(form.personnel_id = ''), (form.montant = 0)
}

//Fonction de fermeture du modal après modification
const closeModal = () => Modal.getInstance(modalRefEdit.value)?.hide()

//Fonction de fermeture du modal après la decision
const closeModalDecision = () => Modal.getInstance(modalRefDecision.value)?.hide()
//fonction de modification dans la base

const showEditModal = (id: number, numero:number) => {
  // recherche de l'id selectionné dans le getter
  const data = attestationStore.getterAttestation.find((item) => item.id === id)
   numeroCredential.value = numero
  if (data) {
    // on remplit les champs du formulaire avec les données de la nature de dépense selectionnée
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
    } else {
      console.error(`Modal reference not found for id ${id}`)
    }
  } else {
    console.error(`Data with id ${id} not found`)
  }
}
const showEditModalAttestation = (id: number) => {
  // recherche de l'id selectionné dans le getter
  const data = attestationStore.getterAttestation.find((item) => item.id === id)
  if (data) {
    // on remplit les champs du formulaire avec les données de la nature de dépense selectionnée
    formEdit.id = data.id
    formEdit.personnel_id = data.personnel_id
    formEdit.redevance = data.redevance   
    formEdit.montant = data.montant

    if (modalRefEditAttestation.value) {
      const modalInstance = new Modal(modalRefEditAttestation.value)
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
      attestationStore.supprimerAttestation(id)
    }
  })
}

const rules = {
  personnel_id: { required },
  redevance: { required },
}
const $v = useVuelidate(rules, form)

const rules_edit = {
  // code: { required },
  personnel_id: { required },
  redevance: { required },
}
const $v_edit = useVuelidate(rules_edit, formEdit)

onMounted(async () => {
  try {
    isLoading.value = true
    await personnelStore.getPersonnel()
    await attestationStore.getAttestation()
  } catch (error) {
    console.error('Erreur lors du chargement des fonctions:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
<style scoped>
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
.total-row td {
  background-color: #0829ab !important;
  color: white !important;
  font-weight: bold;
  text-align: center;
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

.attestation {
  width: 210mm;
  min-height: 297mm;
  margin: auto;
  padding: 20mm;
  font-family: "Times New Roman", serif;
  font-size: 14pt;
  color: #000;
  background: #fff;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.left {
  text-align: left;
  font-size: 12pt;
}
.left .logo {
  width: 100px;
  height: 100px;        /* hauteur = largeur pour garder un cercle parfait */
  margin-bottom: 10px;
  border-radius: 50%;   /* arrondi total */
  object-fit: cover;    /* recadre l’image si elle n’est pas carrée */
/*  border: 2px solid #000;  optionnel : petit contour noir */
}
.right {
  text-align: right;
  font-size: 12pt;
}

/* Title */
.title {
  text-align: center;
  font-size: 16pt;
  font-weight: bold;
  text-decoration: underline;
  margin: 18px 0;
}

/* Body */
.body {
  text-align: justify;
  line-height: 1.6;
  margin-top: 16px;
}

/* Footer */
.footer {
  margin-top: 40px;
  text-align: right;
  font-size: 12pt;
}
.footer-right {
  margin-top: 40px;
  text-align: left;
  font-size: 12px;
  font-size: italic;
}

</style>
