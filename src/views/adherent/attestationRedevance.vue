<template>
  <div class="attestation-container">

    <!-- Barre d'actions -->
    <div class="actions-bar no-print">
      <button class="btn btn-secondary" @click="goBack">
        ← Retour
      </button>

      <button class="btn btn-primary" @click="generatePDF">
        📄 Exporter en PDF
      </button>
    </div>
    <!-- DOCUMENT -->
    <div id="attestation-content" class="attestation-document">

      <div class="header-border"></div>

      <div class="header">

        <div class="logo-section">
          <div class="logo-wrapper">
            <img src="/assets/images/logo.jpg" class="logo" alt="Logo 3AV" />
          </div>

          <p class="president-title">
            <strong>Le Président</strong>
          </p>
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
        ATTESTATION DE NON REDEVANCE N°{{ numero }}/{{ annee }}
      </h2>

      <div class="content">

        <p>
          Je soussigné,
          <strong>{{ president }}</strong>,
          Président de l'Amicale des Agents Vérificateurs et Assimilés (3AV)
          de la Direction du Contrôle Financier,
        </p>

        <p class="atteste">atteste que</p>

        <div class="info-card">
          <p>Nom : <strong>{{ nomComplet}}</strong></p>
          <p>Matricule : <strong>{{ attestation.matricule }}</strong></p>
          <p>Emploi : <strong>{{ attestation.emploi }}</strong></p>
          <p>Direction : <strong>{{ direction }}</strong></p>
        </div>

        <p class="declaration">
          ne nous est redevable d'aucune somme à ce jour.
        </p>

        <p>
          En foi de quoi, la présente lui est délivrée pour servir et valoir ce que de droit.
        </p>

      </div>

      <div class="footer">

        <p>
          Fait à Abidjan, le <strong>{{ date }}</strong>
        </p>

        <p class="cachet">
          Cachet et signature
        </p>

      </div>

      <p class="note">
        * Sauf erreurs ou omissions de notre part.
      </p>

      <div class="footer-border"></div>

    </div>
  </div>
</template>

<script setup>

import { ref } from "vue"
import { useRouter,useRoute } from "vue-router"
import html2pdf from "html2pdf.js"
import {onMounted, computed, watch } from 'vue'
import { useAttestation } from '../../stores/auth/attestation'
const route = useRoute()
const attestationStore = useAttestation()
const router = useRouter()
const id = route.params.id

const attestation = computed(() =>
  attestationStore.getterAttestation.find(item => item.id == id)
)
const numero = ref("02")
const annee = ref("2025")
const president = ref("Aboubakar Sidick BERTE")
const nom = ref("AMAFFI Eba Marie France epse AZI")
const matricule = ref("331186Q")
const emploi = ref("Administrateur civil")
const direction = ref("Direction du Contrôle Financier")
const date = ref("15/03/2026")

const nomComplet = computed(() =>
  [attestation.value?.nom, attestation.value?.prenom]
    .filter(Boolean)
    .join(" ")
)
const generatePDF = async () => {

  const element = document.getElementById("attestation-content")

  const options = {

    margin: 0,

    filename: `attestation_${nomComplet.value}_${numero.value}_${annee.value}.pdf`,

    image: {
      type: "jpeg",
      quality: 1
    },

    html2canvas: {

      scale: 4,          // 🔥 résolution très élevée
      useCORS: true,
      letterRendering: true,
      dpi: 300,
      backgroundColor: "#ffffff"

    },

    jsPDF: {

      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: false

    }

  }

  await html2pdf()
    .set(options)
    .from(element)
    .save()
}

const goBack = () => {
  router.back()
}

</script>

<style scoped>

*{
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.attestation-container{
  display:flex;
  flex-direction:column;
  align-items:center;
  background:#f0f2f5;
  padding:20px;
}

.actions-bar{
  width:100%;
  max-width:800px;
  display:flex;
  justify-content:space-between;
  margin-bottom:20px;
  background:white;
  padding:10px;
  border-radius:6px;
}

.btn{
  padding:8px 18px;
  border:none;
  border-radius:4px;
  cursor:pointer;
}

.btn-primary{
  background:#003366;
  color:white;
}

.btn-secondary{
  background:#dfc520;
}
.attestation-document{

  width:210mm;
  height:257mm;

  padding:20mm;
  box-sizing:border-box;

  background:white;
  font-family:'Times New Roman', serif;

  box-shadow:0 10px 25px rgba(0,0,0,0.1);

}
.attestation-document1{

  width:210mm;
  min-height:297mm;
  background:white;

  padding:20mm;

  font-family:'Times New Roman', serif;

  box-shadow:0 10px 25px rgba(0,0,0,0.1);
}

.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid #ddd;
  padding-bottom:10px;
}

.logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.logo-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid #003366;
  padding: 2px;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 51, 102, 0.2);
}
.republique h1{
  font-size:18px;
  color:#003366;
  margin:0;
  font-size: 20px;
}

.devise{
  background:#003366;
  color:#FFD700;
  padding:2px 8px;
  border-radius:16px;
  font-size:18px;
  text-align: center;
  
}

.reference{
  margin-top:10px;
  line-height:1.6;
}
.attestation-title {
  text-align: center;
  margin: 15px 0;
  font-size: 24px;
  color: #003366;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 1.3;
  text-decoration: underline;
}
.attestation-title1{
  text-align:center;
  color:#003366;
  text-decoration:underline;
  margin:20px 0;
  font-size: 22px;
}

.content{
  font-size:20px;
  line-height:1.6;
}
.atteste {
  text-align: center;
  font-size: 20px;
  font-weight: 300;
  margin: 3px 0;
  color: #666;
  position: relative;
}

.atteste::before,
.atteste::after {
  content: "——";
  color: #FFD700;
  margin: 0 8px;
  font-weight: normal;
}
.atteste1{
  text-align:center;
  font-weight:bold;
  margin:10px 0;
}

.info-card{
  background:#f7f7f7;
  padding:10px;
  border-left:4px solid #003366;
  margin:10px 0;
   border-radius: 8px;
}

.declaration{
  font-style:italic;
  color:#003366;
}

.footer{
  text-align:right;
  margin-top:60px;
}

.cachet{
  font-size:12px;
  color:#777;
}

.note{
  text-align:center;
  margin-top:40px;
  font-size:11px;
}

.header-border{
  height:3px;
  background:linear-gradient(90deg,#003366,#FFD700,#003366);
  margin-bottom:15px;
}

.footer-border{
  height:3px;
  background:linear-gradient(90deg,#003366,#FFD700,#003366);
  margin-top:20px;
}

@media print{

.no-print{
display:none;
}

.attestation-document{
box-shadow:none;
}

}

</style>