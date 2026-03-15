<template>
  <div>
    <Loader :isLoading="isLoading" />

    <div class="p-6 w-full">

     
  <div class="row mb-4">
          <div class="col-md-4">
        <input type="text"
              class="form-control mt-2 mb-3"
              placeholder="Rechercher par nom, prénom ou service"
            style="width: 500px;margin-right:40%"
              v-model="searchQuery"
            />
          </div>
          <div class="col-md-8">
       
     <div class="col-12 d-flex justify-content-end">
    
         <button type="button" class="btn btn-primary add-button  me-2" @click="exportPDF">
           Exporter PDF
        </button>
        <button type="button" class="btn btn-secondary me-2" @click="exportExcel">
           Exporter Excel
        </button>
        
        </div>
          </div>
         </div>

      <h2 class="text-xl font-bold mb-4 text-center">Situations des prêts et des cotisations {{trimestreEncours}} </h2>

      <!-- Tableau -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-black text-sm text-center table-fixed">
          <thead>
            <tr>
              <th rowspan="2" class="border border-black p-2 header-bg">N°</th>
              <th rowspan="2" class="border border-black p-2 header-bg">NOM ET PRENOMS</th>
              <th rowspan="2" class="border border-black p-2 header-bg">MATRICULE</th>
              <th rowspan="2" class="border border-black p-2 header-bg">SERVICE</th>
              <th rowspan="2" class="border border-black p-2 header-bg">CONTACT</th>
              <th colspan="5" class="border border-black p-2 header-bg">MONTANTS</th>
              <th colspan="2" class="border border-black p-2 header-bg">COTISATIONS</th>
            </tr>
            <tr>
              <th class="border border-black p-2 header-bg">PRÊT</th>
              <th class="border border-black p-2 header-bg">A PRELEVÉ</th>
              <th class="border border-black p-2 header-bg">INTÉRÊT</th>
              <th class="border border-black p-2 header-bg">REMBOURS.</th>
              <th class="border border-black p-2 header-bg">MONTANT <br> TRIMESTRE</th>
              <th class="border border-black p-2 header-bg">MONTANT</th>
              <th class="border border-black p-2 header-bg">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in paginatedRows" :key="index">
              <td class="border border-black p-2">{{ index+1 }}</td>
              <td class="border border-black p-2">{{ row.nom_prenom }}</td>
              <td class="border border-black p-2">{{ row.matricule }}</td>
              <td class="border border-black p-2">{{ row.libelle_service || 'Non renseigné' }}</td>
              <td class="border border-black p-2">{{ row.telephone }}</td>
              <td class="border border-black p-2">{{ formatMontant(row.total_montant) }}</td>
              <td class="border border-black p-2">{{ formatMontant(row.montant_total_avec_interet) }}</td>
              <td class="border border-black p-2">{{ formatMontant(calculInteret(row.total_montant)) }}</td>
              <td class="border border-black p-2">{{ formatMontant(row.montant_rembourser) }}</td>
              <td class="border border-black p-2">{{ formatMontant(row.montant_trimestre_encours_divise) }}</td>
              <td class="border border-black p-2">{{ formatMontant(row.cotisation_trimestre) }}</td>
              <td class="border border-black p-2">{{ formatMontant(calculerNombres(row.montant_trimestre_encours_divise,row.cotisation_trimestre) )}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-4 gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded btn btn-primary"
        >
          Précédent
           &nbsp;
        </button>
        <span>  &nbsp; Page {{ currentPage }} / {{ totalPages }}</span>
        &nbsp;
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded btn btn-primary"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loader from '../../components/Loader.vue';
import { useRapportCotisation } from '../../stores/rapport/rapport';
import { useCotisation } from '../../stores/bureau/cotisation'

const cotisationStore = useCotisation()
const rapportCotisationStore = useRapportCotisation();
const isLoading = ref(false);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 20;

const trimestreEncours = computed(() => {
  let data = cotisationStore.getterCotisation.find((item) => item.encours === 1)
  if (data) {
    return data.trimestre
  }
})

const rows = computed(() => rapportCotisationStore.getterRapportRapportCotisation || []);

// Recherche filtrée
const filteredRows = computed(() => {
  if (!searchQuery.value) return rows.value;
  return rows.value.filter(r =>
    r.nom_prenom.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (r.libelle_service && r.libelle_service.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage));
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRows.value.slice(start, start + itemsPerPage);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function calculerNombres(a, b) {
  return  a + b
}

const formatMontant = val => {
  if (!val) return "0";
  return new Intl.NumberFormat("fr-FR").format(val);
};

// Fonction pour calculer l'intérêt
function calculInteret(m) {
  if (!m || isNaN(m)) return 0;
  return m * 0.07;
}



// Export Excel
const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(filteredRows.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Prets");
  XLSX.writeFile(wb, "prets.xlsx");
};

// Export PDF
const exportPDF = () => {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.text("PRETS 3AV 2TR 2025 A PRELEVER", 100, 10);
  autoTable(doc, {
    head: [["NOM", "MATRICULE", "SERVICE", "CONTACT", "PRÊT", "PRÉLEVÉ", "INTÉRÊT", "REMBOURS.", "MONTANT", "TOTAL"]],
    body: filteredRows.value.map(r => [
      r.nom_prenom, r.matricule, r.libelle_service, r.telephone,
      r.total_montant, r.montant_total_avec_interet, calculInteret(r.total_montant),
      r.montant_rembourser, r.montant, r.total
    ])
  });
  doc.save("prets.pdf");
};

onMounted(async () => {
  try {
    isLoading.value = true;
    await rapportCotisationStore.getRapportCotisation();
    await cotisationStore.getCotisation()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
table th,
table td {
  font-size: 12px;
}
.header-bg {
  background-color: #b7dee8;
}
</style>
