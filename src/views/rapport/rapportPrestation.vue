<template>
  <div class="p-6 w-full">
  

    <!-- Boutons export -->
    <div class="flex justify-end gap-3 mb-4" style="margin-left:70%">
      <button @click="exportPDF" style="background-color:#1DA1F2" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow">
        Exporter PDF
      </button>
      &nbsp;
      <button @click="exportExcel" style="background-color:#3AAF85" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow">
        Exporter Excel
      </button>
    </div>
  <h2 style="margin-left:8%" class="text-xl font-bold   mb-4">SITUATION DES ASSISTANCES : 3EME TRIMESTRE 2025</h2>
    <!-- Tableau -->
    <div class="overflow-xl-auto">
      <table class="w-full border-collapse border border-black text-sm text-center table-fixed" style="width:100%">
        <thead>
          <tr>
            <th rowspan="2" class="border border-black p-2 header-bg w-[8%]">ORDRE</th>
            <th rowspan="2" class="border border-black p-2 header-bg w-[8%]">DATE</th>
            <th rowspan="2" class="border border-black p-2 header-bg w-[8%]">N° NOTE</th>
            <th rowspan="2" class="border border-black p-2 header-bg w-[15%]">NOM ET PRENOMS</th>
            <th rowspan="2" class="border border-black p-2 header-bg w-[8%]">MATRICULE</th>
            <th rowspan="2" class="border border-black p-2 header-bg w-[10%]">SERVICE</th>
            <th rowspan="2" class="border border-black p-2 header-bg w-[10%]">CONTACT</th>
            <th rowspan="2" class="border border-black p-2 header-bg w-[10%]">OBJET</th>
            <th rowspan="2" class="border border-black p-2 header-bg w-[30%]">MONTANTS(FCFA)</th>
            <th rowspan="2" class="border border-black p-2 header-bg w-[19%]">FRAIS(FCFA)</th>
          </tr>
         
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td class="border border-black p-2">{{ index+1 }}</td>
            <td class="border border-black p-2">{{ row.date }}</td>
            <td class="border border-black p-2">{{ row.nom }}</td>
            <td class="border border-black p-2">{{ row.nom }}</td>
            <td class="border border-black p-2">{{ row.matricule }}</td>
            <td class="border border-black p-2">{{ row.service }}</td>
            <td class="border border-black p-2">{{ row.contact }}</td>
            <td class="border border-black p-2">{{ row.objet }}</td>
            <td class="border border-black p-2">{{ formatMontant(row.total) }}</td>
            <td class="border border-black p-2">{{ formatMontant(row.pret) }}</td>
           
          </tr>
        </tbody>
        <tfoot class="footer-bg">
          <tr>
            <td colspan="8" class="border border-black p-2 font-bold text-right">TOTAUX</td>
            <td class="border border-black p-2">22</td>
            <td class="border border-black p-2">320</td>
         
           
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Données statiques (10 lignes)
const rows = ref([
  { date: "01/01/2025", nom: "Kouassi Jean", matricule: "123", service: "Compta", contact: "07070707", objet: "Marriage",   montant: "2000", pret: "50000",  total: "73500" },
  { date: "02/01/2025", nom: "Traoré Awa", matricule: "456", service: "RH", contact: "05050505", objet: "Accouchement", montant: "1500", pret: "50000",  total: "56800" },
  { date: "03/01/2025", nom: "Konan Serge", matricule: "789", service: "IT", contact: "01010101", objet: "Marriage", montant: "2500", pret: "50000",  total: "87200" },
  { date: "04/01/2025", nom: "Yao Marie", matricule: "321", service: "Logistique", contact: "02020202", objet: "Accouchement", montant: "2200",  pret: "50000", total: "80350" },
  { date: "05/01/2025", nom: "Ouattara Ibrahim", matricule: "654", service: "Finance", contact: "03030303", objet: "Marriage",  montant: "3000", pret: "50000",  total: "101900" },
  { date: "06/01/2025", nom: "Bamba Fatou", matricule: "987", service: "Marketing", contact: "04040404", objet: "Accouchement", montant: "1800", pret: "50000",  total: "65950" },
  { date: "07/01/2025", nom: "N’Guessan Alain", matricule: "741", service: "Ventes", contact: "06060606", objet: "Marriage", montant: "1600", pret: "50000",  total: "55060" },
  { date: "08/01/2025", nom: "Coulibaly Aminata", matricule: "852", service: "RH", contact: "08080808", objet: "Accouchement", montant: "2700", pret: "50000",  total: "90640" },
  { date: "09/01/2025", nom: "Koffi Joseph", matricule: "963", service: "Sécurité", contact: "09090909", objet: "Marriage", montant: "2100", pret: "50000",  total: "74870" },
  { date: "10/01/2025", nom: "Diarra Salimata", matricule: "159", service: "Compta", contact: "11111111", objet: "Accouchement", montant: "2300", pret: "50000",  total: "84760" }
]);

// Format montant
// const formatMontant = (val) =>
//   new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(val);
const formatMontant = (val) => {
  if (!val) return "0";
  return new Intl.NumberFormat("fr-FR").format(val);
};
// Export Excel
const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(rows.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Prets");
  XLSX.writeFile(wb, "prets.xlsx");
};

// Export PDF
const exportPDF = () => {
  const doc = new jsPDF({ orientation: "landscape" }); // paysage pour bien remplir la page
  doc.text("PRETS 3AV 2TR 2025 A PRELEVER", 100, 10);
  autoTable(doc, {
    head: [["DATE", "NOM", "MATRICULE", "SERVICE", "CONTACT", "PRÊT", "PRÉLEVÉ", "INTÉRÊT", "REMBOURS.", "MONTANT", "TOTAL"]],
    body: rows.value.map(r => [r.date, r.nom, r.matricule, r.service, r.contact, r.pret, r.preleve, r.interet, r.rembours, r.montant, r.total]),
  });
  doc.save("prets.pdf");
};
</script>

<style scoped>
table th,
table td {
  font-size: 12px;
}
.header-bg {
  background-color: #b7dee8; /* Bleu clair Excel */
}
.footer-bg {
  background-color: #B2EBF2; /* Bleu clair Excel */
}
</style>
