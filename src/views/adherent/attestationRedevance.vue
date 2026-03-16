<template>
  <div class="attestation-container">
    <!-- Barre d'actions avec onglets -->
    <div class="actions-bar no-print">
      <div class="left-section">
        <button class="btn btn-secondary" @click="goBack">
          ← Retour
        </button>
          <!-- {{attestation.redevance}} -->
        <!-- Système d'onglets pour switcher entre les modèles -->
        <div class="tab-container">
          <button 
            class="tab-btn" 
            :class="{ active: activeTemplate === 'classic' }"
            @click="activeTemplate = 'classic'"
          >
            📄 Nouveau Modèle
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTemplate === 'simple' }"
            @click="activeTemplate = 'simple'"
          >
            📝 Ancien modèle
          </button>
        </div>
      </div>

      <button class="btn btn-primary" @click="generatePDF">
        📥 Télécharger PDF
      </button>
    </div>

    <!-- DOCUMENT avec template conditionnel -->
    <div :id="'attestation-content-' + activeTemplate" class="attestation-document">
      <!-- Template Classique (ton design original) -->
      <template v-if="activeTemplate === 'classic'">
        <div class="header-border"></div>
        
        <div class="header">
          <div class="logo-section">
            <div class="logo-wrapper">
              <img src="/assets/images/logo.jpg" class="logo" alt="Logo 3AV" />
            </div>
            <p class="president-title"><strong>Le Président</strong></p>
          </div>
          
          <div class="republique">
            <h1>RÉPUBLIQUE DE CÔTE D'IVOIRE</h1>
            <p class="devise">Union – Discipline – Travail</p>
          </div>
        </div>

        <div class="reference">
          <span class="ref-number">N°{{ numero }}/{{ annee }}/3AV/Sg</span>
        </div>

        <h2 class="attestation-title">
          ATTESTATION DE <span v-if="attestation.redevance == 'non'">NON</span>  REDEVANCE N°{{ numero }}/{{ annee }}
        </h2>

        <div class="content">
          <p>
            Je soussigné, <strong>{{ president }}</strong>,
            Président de l'Amicale des Agents Vérificateurs et Assimilés (3AV)
            de la Direction du Contrôle Financier,
          </p>
          
          <p class="atteste">atteste que</p>
          
          <div class="info-card">
            <p><span class="info-label">Nom :</span> <strong>{{ nomComplet }}</strong></p>
            <p><span class="info-label">Matricule :</span> <strong>{{ matriculeFormate }}</strong></p>
            <p><span class="info-label">Emploi :</span> <strong>{{ attestation.emploi }}</strong></p>
            <p><span class="info-label">Direction :</span> <strong>{{ direction }}</strong></p>
          </div>
          
          <!-- <p class="declaration">ne nous est redevable d'aucune somme à ce jour.</p> -->
           <p class="declaration">
            <span v-if="attestation.redevance == 'non'">

            ne nous est redevable d'aucune somme à ce jour
            </span>
           <span v-else>
                    nous est redevable de la somme de <strong>{{ montantEnLettres(attestation.montant) }}</strong> 
                    (<strong>{{ formatageMontantCFA(attestation.montant) }}</strong>), à ce jour.
                  </span>

          </p>
          <p>En foi de quoi, la présente lui est délivrée pour servir et valoir ce que de droit.</p>
        </div>

        <div class="footer">
          <p>Fait à Abidjan, le <strong>{{ date }}</strong></p>
          <p class="cachet">Cachet et signature</p>
        </div>
        
        <p class="note">* Sauf erreurs ou omissions de notre part.</p>
        <div class="footer-border"></div>
      </template>

      <!-- Template SIMPLE - Exactement comme dans l'image avec logo à gauche et texte à droite -->
      <template v-else>
        <!-- En-tête avec logo à gauche et République à droite -->
        <div class="simple-header-row">
          <!-- Logo et Président à gauche -->
          <div class="simple-logo-section">
            <div class="simple-logo-wrapper">
              <img src="/assets/images/logo.jpg" class="simple-logo" alt="Logo 3AV" />
            </div>
            <p class="simple-president-title"><strong>Le Président</strong></p>
              <!-- Référence centrée -->
        <p class="reference-simple">N°{{ numero }}/{{ annee }}/3AV/Sg</p>
          </div>

          <!-- République et devise à droite -->
          <div class="simple-header-right">
            <h1 class="republique-simple">RÉPUBLIQUE DE CÔTE D'IVOIRE</h1>
            <p class="devise-simple">Union – Discipline – Travail</p>
          </div>
        </div>

      

        <!-- Titre -->
        <h2 class="title-simple">ATTESTATION DE <span v-if="attestation.redevance == 'non'">NON</span> REDEVANCE N°{{ numero }}/{{ annee }}</h2>

        <!-- Corps du texte -->
        <div class="body-simple">
          <p>
            Je soussigné, <strong>{{ president }}</strong>, Président de l'Amicale des Agents 
            Vérificateurs et Assimilés (3AV) de la Direction du Contrôle Financier, atteste que 
            Monsieur <strong>{{ nomComplet }}</strong>,
          </p>

          <p>Matricule : <strong>{{ matriculeFormate }}</strong>,</p>
          <p>Emploi : <strong>{{ attestation.emploi }}</strong>,</p>
          <p>Direction : <strong>{{ direction }}</strong>,</p>

          <p>
            <span v-if="attestation.redevance == 'non'">

            ne nous est redevable d'aucune somme à ce jour
            </span>
           <span v-else>
                    nous est redevable de la somme de <strong>{{ montantEnLettres(attestation.montant) }}</strong> 
                    (<strong>{{ formatageMontantCFA(attestation.montant) }}</strong>), à ce jour.
                  </span>

          </p>

          <p>En foi de quoi, la présente lui est délivrée pour servir et valoir ce que de droit.</p>
        </div>

        <!-- Pied de page -->
        <div class="footer-simple">
          <p>Fait à Abidjan, le <strong>{{ date }}</strong></p>
        </div>

        <!-- Note -->
        <p class="note-simple">* Sauf erreurs ou omissions de notre part.</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import html2pdf from "html2pdf.js"
import { useAttestation } from '../../stores/auth/attestation'
import { formatageMontant, formatageMontantCFA } from '../../config/utils'

import writtenNumber from 'written-number'

writtenNumber.defaults.lang = 'fr'

const route = useRoute()
const attestationStore = useAttestation()
const router = useRouter()
const id = route.params.id

// État pour le template actif
const activeTemplate = ref('classic') // 'classic' ou 'simple'

const attestation = computed(() =>
  attestationStore.getterAttestation.find(item => item.id == id)
)

const numero = ref("03")
const annee = ref("2025")
const president = ref("Aboubakar Sidick BERTE")
const direction = ref("Direction du Contrôle Financier")

const getDateToday = () => {
  const today = new Date()
  const jour = String(today.getDate()).padStart(2, "0")
  const mois = String(today.getMonth() + 1).padStart(2, "0")
  const annee = today.getFullYear()
  return `${jour}/${mois}/${annee}`
}

const date = ref(getDateToday())

function montantEnLettres(montant) {
  return writtenNumber(montant)
}

const nomComplet = computed(() =>
  [attestation.value?.nom, attestation.value?.prenom]
    .filter(Boolean)
    .join(" ")
)

const matriculeFormate = computed(() => {
  const matricule = attestation.value?.matricule
  if (!matricule) return ""
  return matricule.replace(/^(\d{3})(\d+)/, "$1 $2")
})

const generatePDF = async () => {
  const element = document.getElementById(`attestation-content-${activeTemplate.value}`)
  
  const options = {
    margin: 0,
    filename: `attestation_${nomComplet.value}_${numero.value}_${annee.value}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2, // Réduit de 4 à 2 pour éviter le débordement
      useCORS: true,
      letterRendering: true,
      dpi: 150, // Réduit de 300 à 150
      backgroundColor: "#ffffff"
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true
    }
  }

  await html2pdf().set(options).from(element).save()
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
* {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.attestation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f2f5;
  padding: 20px;
}

.actions-bar {
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  background: white;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.left-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  padding: 8px 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #003366;
  color: white;
}

.btn-primary:hover {
  background: #004080;
}

.btn-secondary {
  background: #dfc520;
  color: #000;
}

.btn-secondary:hover {
  background: #f0d830;
}

/* Styles des onglets */
.tab-container {
  display: flex;
  gap: 5px;
  background: #f0f0f0;
  padding: 3px;
  border-radius: 4px;
}

.tab-btn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #003366;
  color: white;
}

.tab-btn:not(.active):hover {
  background: #ddd;
}

/* Styles communs du document */
.attestation-document {
  width: 210mm;
  min-height: auto; /* Changé de min-height:297mm à auto */
  height: auto; /* Ajouté */
  max-height: 297mm; /* Ajouté pour limiter à 1 page */
  padding: 15mm 20mm; /* Réduit de 20mm à 15mm en haut/bas */
  box-sizing: border-box;
  background: white;
  font-family: 'Times New Roman', serif;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  page-break-after: avoid; /* Évite les sauts de page */
  page-break-inside: avoid; /* Évite les coupures à l'intérieur */
  overflow: hidden; /* Empêche le débordement */
}

/* ========== STYLES MODÈLE CLASSIQUE (ton design) ========== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px; /* Réduit de 10px à 8px */
  margin-bottom: 5px; /* Ajouté pour contrôler l'espace */
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.logo-wrapper {
  width: 90px; /* Réduit de 100px à 90px */
  height: 90px; /* Réduit de 100px à 90px */
  border-radius: 50%;
  border: 1px solid #003366;
  padding: 2px;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 51, 102, 0.2);
}

.president-title {
  margin-top: 3px; /* Réduit de 5px à 3px */
  font-size: 13px; /* Réduit de 14px à 13px */
}

.republique h1 {
  font-size: 18px; /* Réduit de 20px à 18px */
  color: #003366;
  margin: 0;
}

.devise {
  background: #003366;
  color: #FFD700;
  padding: 2px 4px; /* Réduit le padding */
  border-radius: 16px;
  font-size: 16px; /* Réduit de 18px à 16px */
  text-align: center;
}

.header-border, .footer-border {
  height: 2px; /* Réduit de 3px à 2px */
  background: linear-gradient(90deg, #003366, #FFD700, #003366);
  margin-bottom: 10px; /* Réduit de 15px à 10px */
}

.footer-border {
  margin-top: 20px; /* Réduit de 20px à 15px */
}

.attestation-title {
  text-align: center;
  margin: 20px 0; /* Réduit de 15px à 10px */
  font-size: 22px; /* Réduit de 24px à 22px */
  color: #003366;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: underline;
}

.content {
  font-size: 20px; /* Réduit de 20px à 18px */
  line-height: 1.5; /* Réduit de 1.6 à 1.5 */
}

.atteste {
  text-align: center;
  font-size: 18px; /* Réduit de 20px à 18px */
  font-weight: 300;
  margin: 5px 0; /* Réduit de 3px à 2px */
  color: #666;
  position: relative;
}

.atteste::before,
.atteste::after {
  content: "——";
  color: #FFD700;
  margin: 0 6px; /* Réduit de 8px à 6px */
  font-weight: normal;
}

.info-card {
  background: #f7f7f7;
  padding: 10px; /* Réduit de 15px à 10px */
  border-left: 4px solid #003366;
  margin: 8px 0; /* Réduit de 10px à 8px */
  border-radius: 8px;
}

.info-card p {
  margin: 10px 0; /* Réduit de 8px à 5px */
}

.info-label {
  color: #555;
  font-weight: normal;
}

.declaration {
  font-style: italic;
  color: #003366;
  margin: 10px 0;
}

.footer {
  text-align: right;
  font-size: 18px;
  margin-top: 40px; /* Réduit de 60px à 30px */
}

.cachet {
  font-size: 11px; /* Réduit de 12px à 11px */
  color: #777;
}

.note {
  text-align: center;
  margin-top: 20px; /* Réduit de 40px à 20px */
  font-size: 10px; /* Réduit de 11px à 10px */
}

/* ========== STYLES MODÈLE SIMPLE (exactement comme l'image) ========== */
.simple-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px; /* Réduit de 20px à 15px */
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px; /* Réduit de 15px à 10px */
}

.simple-logo-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.simple-logo-wrapper {
  width: 70px; /* Réduit de 80px à 70px */
  height: 70px; /* Réduit de 80px à 70px */
  border-radius: 50%;
  border: 1px solid #ccc;
  padding: 2px;
  background: white;
  margin-bottom: 3px; /* Réduit de 5px à 3px */
}

.simple-logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.simple-president-title {
  font-size: 14px; /* Réduit de 16px à 14px */
  font-weight: bold;
  color: #000;
  margin-top: 0;
}

.simple-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
}

.republique-simple {
  font-size: 16px; /* Réduit de 18px à 16px */
  font-weight: bold;
  color: #000;
  margin-bottom: 3px; /* Réduit de 5px à 3px */
  text-align: right;
}

.devise-simple {
  font-size: 16px; /* Réduit de 18px à 16px */
  color: #333;
  margin-top: 0;
  text-align: right;
}

.reference-simple {
  text-align: center;
  font-size: 14px; /* Réduit de 16px à 14px */
  margin: 10px 0 15px; /* Réduit de 15px 0 20px à 10px 0 15px */
  color: #333;
}

.title-simple {
  text-align: center;
  font-size: 18px; /* Réduit de 20px à 18px */
  font-weight: bold;
  margin: 15px 0 20px; /* Réduit de 20px 0 30px à 15px 0 20px */
  color: #000;
  text-transform: uppercase;
  text-decoration: underline;
}

.body-simple {
  font-size: 20px; /* Réduit de 18px à 16px */
  line-height: 1.5; /* Réduit de 1.8 à 1.5 */
  margin: 15px 0; /* Réduit de 20px à 15px */
}

.body-simple p {
  margin: 15px 0; /* Réduit de 15px à 10px */
  text-align: left;
  font-size: 20px;
}

.body-simple strong {
  font-weight: bold;
}

.footer-simple {
  margin-top: 40px; /* Réduit de 60px à 30px */
  text-align: right;
}

.footer-simple p {
  font-size: 16px; /* Réduit de 18px à 16px */
}

.note-simple {
  text-align: center;
  margin-top: 25px; /* Réduit de 50px à 25px */
  font-size: 12px; /* Réduit de 14px à 12px */
  font-style: italic;
  color: #555;
}

/* Styles pour l'impression */
@media print {
  .no-print {
    display: none;
  }
  
  .attestation-document {
    box-shadow: none;
    padding: 15mm 20mm; /* Réduit pour l'impression aussi */
    height: auto;
    min-height: auto;
    max-height: 297mm;
    page-break-after: avoid;
    page-break-inside: avoid;
    overflow: hidden;
  }
  
  /* Force tout à tenir sur une page */
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>