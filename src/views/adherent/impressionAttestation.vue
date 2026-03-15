<template>
  <div class="attestation">
    <!-- Header -->
    <div class="header">
      <div class="left">
        <img src="../../../public/assets/images/logo.jpg" alt="logo" class="logo" />
        <p><strong>Le Président</strong></p>
        <p>{{ modele.reference }}</p>
      </div>
      <div class="right">
        <p><strong>REPUBLIQUE DE CÔTE D’IVOIRE</strong></p>
        <p>Union – Discipline - Travail</p>
      </div>
    </div>

    <!-- Title -->
    <h2 class="title">ATTESTATION DE REDEVANCE {{ modele.numero }}</h2>

    <!-- Body -->
    <div class="body">
      <p>
        Je soussigné, <strong>{{ modele.signataire }}</strong>, Président de
        l’Amicale des Agents Vérificateurs et Assimilés (3AV) de la Direction
        du Contrôle Financier,
        atteste que Monsieur <strong>{{ modele.nomComplet }}</strong>,
      </p>

      <p>
        Matricule : {{ modele.matricule }}, <br />
        Emploi : {{ modele.emploi }}, <br />
        Direction : {{ modele.direction }},
      </p>

      <p>
        nous est redevable de la somme de
        <strong>{{ modele.montant }}</strong>, à ce jour.
      </p>

      <p>
        En foi de quoi, la présente lui est délivrée pour servir et valoir ce
        que de droit.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Fait à {{ modele.lieu }}, le {{ modele.date }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

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
</script>

<style scoped>
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
  margin-bottom: 40px;
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
  margin: 20px 0;
}

/* Body */
.body {
  text-align: justify;
  line-height: 1.6;
  margin-top: 20px;
}

/* Footer */
.footer {
  margin-top: 60px;
  text-align: right;
  font-size: 12pt;
}

/* Impression */
@media print {
  .attestation {
    margin: 0;
    padding: 20mm;
    border: none;
    width: auto;
    min-height: auto;
  }
}
</style>
