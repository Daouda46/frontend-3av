<template>
  <Loader :isLoading="isLoading" />

  <div class="container my-4">
    <div class="card shadow rounded-4">
      <div class="card-body">

        <h5 class="card-title mb-4 text-primary">
          📥 Importer des données mutualistes
        </h5>

        <div class="d-flex align-items-center mb-3 gap-2">
          <label class="btn btn-outline-primary rounded-pill">
            <i class="bi bi-file-earmark-spreadsheet me-2"></i> Choisir un fichier Excel
            <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" hidden />
          </label>
          <span v-if="selectedFileName" class="text-muted small">
            <i class="bi bi-check-circle-fill text-success me-1"></i>{{ selectedFileName }}
          </span>
        </div>

        <div class="mb-3">
          <button
           
            @click="importData"
            class="btn btn-primary me-2 rounded-pill"
          >
            <i class="bi bi-upload me-1"></i> Importer depuis Excel
          </button>

          <button
            v-if="importedData.length > 0"
            @click="sendToBackend"
            class="btn btn-success rounded-pill"
          >
            <i class="bi bi-send-check me-1"></i> Importer
          </button>
        </div>

        <div v-if="importedData.length" class="table-responsive rounded">
          <table class="table table-hover table-bordered align-middle shadow-sm">
            <thead class="table-primary">
              <tr>
                <th class="text-center p-2">N°</th>
                <th class="text-center p-2">Matricule</th>
                <th class="text-center p-2">Nom</th>
                <th class="text-center p-2">Numéro</th>
                <th class="text-center p-2">Fonction</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in importedData" :key="index">
                <td class="text-center p-2">{{ index + 1 }}</td>
                <td class="text-center p-2">{{ item.MATRICULE }}</td>
                <td class="text-center p-2">{{ item.NOM }}</td>
                <td class="text-center p-2">{{ item.NUMERO }}</td>
                <td class="text-center p-2">{{ item.FONCTION }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="text-muted fst-italic mt-3">
          Aucun fichier importé pour le moment.
        </p>

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import axios from 'axios'
import * as XLSX from 'xlsx'
import Loader from "../../components/Loader.vue";
import { authHeader } from "@/config/authHeader";
import Swal from 'sweetalert2'

const isLoading = ref(false);
const selectedFile = ref(null)
const importedData = ref([])

const handleFileUpload = (e) => {
  selectedFile.value = e.target.files[0]
}

const importData = () => {
  if (!selectedFile.value) {
    alert("Veuillez sélectionner un fichier Excel d'abord.")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    importedData.value = jsonData
    console.log('Données importées:', jsonData)
  }
  reader.readAsArrayBuffer(selectedFile.value)
}

const file_url= () => {
  // @ts-ignore
  const url = import.meta.env.VITE_API_URL;
  return url;
};
const url = file_url();


const sendToBackend = async () => {
  try {
    isLoading.value = true;

    const response = await axios.post(`${url}importMutualiste`, importedData.value, {
      headers: authHeader()
    });

    isLoading.value = false;

    // Si retour du serveur = 200 → on affiche la notification
    if (response.status === 200) {
      Swal.fire({
        title: 'Succès !',
        text: 'Importation effectué avec succès !',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true
      });
      importedData.value=[]
    }

    console.log('Réponse serveur:', response.data);

  } catch (error) {
    isLoading.value = false;
    console.error("Erreur lors de l'envoi :", error);

    Swal.fire({
      title: 'Erreur',
      text: error.response?.data?.message || "Erreur lors de l'envoi des données au serveur.",
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}
</script>
