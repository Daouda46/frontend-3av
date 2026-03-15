<template>
  <div class="table-container p-6">
    <Loader :isLoading="isLoading" />
    <div class="row mb-4">
      <div class="col-md-4">
        <input
          type="text"
          class="form-control mt-2 mb-3"
          placeholder="Rechercher par nom, prénom ou service"
          style="width: 500px; margin-right: 40%"
          v-model="searchQuery"
        />
      </div>
      <div class="col-md-8">
        <div class="col-12 d-flex justify-content-end">
          <!-- <button type="button" class="btn btn-primary add-button  me-2" @click="exportPDF">
           Exporter PDF
        </button> -->
          <button type="button" class="btn btn-secondary me-2" @click="exportExcel">
            Exporter Excel
          </button>
        </div>
      </div>
    </div>
    <h2 class="text-xl font-bold mb-4">
      Liste des cotisations des membres du 3av {{ trimestreEncours }}
    </h2>

    <div class="overflow-x-auto">
      <table class="custom-table w-full border-collapse border border-black">
        <thead>
          <tr>
            <th class="header-n">N°</th>
            <th class="header-matricule">Matricule</th>
            <th class="header-nom">Nom et Prénoms</th>
            <th class="header-section">Section</th>
            <th class="header-3av">3AV</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in filteredRapport" :key="index">
            <td style="margin-left: 50%; font-style: bold">{{ index + 1 }}</td>
            <td>{{ row.matricule }}</td>
            <td>{{ row.nom_prenom }}</td>
            <td>{{ row.section }}</td>
            <td class="border border-black p-2">
              {{
                formatMontant(
                  calculerNombres(row.montant_trimestre_encours_divise, row.cotisation_trimestre),
                )
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Loader from '../../components/Loader.vue'
import { useRapportCotisation } from '../../stores/rapport/rapport'
import { useCotisation } from '../../stores/bureau/cotisation'

const cotisationStore = useCotisation()
const rapportCotisationStore = useRapportCotisation()
const isLoading = ref(false)

const searchQuery = ref('')

const trimestreEncours = computed(() => {
  let data = cotisationStore.getterCotisation.find((item) => item.encours === 1)
  if (data) {
    return data.trimestre
  }
})

const filteredRapport = computed(() => {
  if (!searchQuery.value) return rapportCotisationStore.getterRapportRapportCotisation

  const keyword = searchQuery.value.toLowerCase()
  return rapportCotisationStore.getterRapportRapportCotisation.filter(
    (item) =>
      item.nom_prenom?.toLowerCase().includes(keyword) ||
      item.libelle_service?.toLowerCase().includes(keyword) ||
      item.matricule?.toLowerCase().includes(keyword),
  )
})

function calculerNombres(a, b) {
  return a + b
}

const formatMontant = (val) => {
  if (!val) return '0'
  return new Intl.NumberFormat('fr-FR').format(val)
}
const formatMontantPdf = (val) => {
  if (!val) return '0'
  // transforme le nombre en string avec séparateur classique pour PDF
  return val.toLocaleString('fr-FR', { useGrouping: true }).replace(/\u202F/g, ' ')
}
const exportPDF = () => {
  const doc = new jsPDF('p', 'pt', 'a4')

  const tableData = filteredRapport.value.map((row, index) => [
    index + 1,
    row.matricule,
    row.nom_prenom,
    row.section,
    calculerNombres(row.montant_trimestre_encours_divise, row.cotisation_trimestre),
  ])

  const headers = [['N°', 'Matricule', 'Nom et Prénoms', 'Section', '3AV']]

  autoTable(doc, {
    head: headers,
    body: tableData,
    startY: 50,
    tableWidth: 'auto', // ajuste automatiquement à la largeur de la page
    styles: {
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
      cellPadding: 5,
      cellWidth: 'wrap', // chaque colonne s’adapte à son contenu
    },
    headStyles: {
      fillColor: [0, 192, 240],
      textColor: 0,
      fontStyle: 'bold',
    },
    columnStyles: {
      4: { halign: 'right', fillColor: [255, 0, 255] }, // 3AV aligné à droite
    },
    tableLineWidth: 0.5,
    tableLineColor: 0,
  })

  doc.save('prets.pdf')
}

// Export Excel
// Fonction utilitaire pour formater les montants pour Excel
const formatMontantExcel = (valeur) => {
  // Si c'est déjà un nombre, le retourner tel quel
  if (typeof valeur === 'number' && !isNaN(valeur)) {
    return valeur
  }
  
  // Si c'est une chaîne, nettoyer et convertir
  if (typeof valeur === 'string') {
    // Enlever les espaces, remplacer les virgules par des points
    const nettoye = valeur.replace(/\s/g, '').replace(',', '.')
    const nombre = parseFloat(nettoye)
    return isNaN(nombre) ? 0 : nombre
  }
  
  return 0
}

const exportExcel = async () => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Prets')

  // Colonnes
  sheet.columns = [
    { header: 'N°', key: 'num', width: 5 },
    { header: 'Matricule', key: 'matricule', width: 15 },
    { header: 'Nom et Prénoms', key: 'nom_prenom', width: 30 },
    { header: 'Section', key: 'section', width: 20 },
    { header: '3AV', key: 'cotisation', width: 15 },
  ]

  // Header style
  sheet.getRow(1).eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colNumber === 5 ? 'FFFF00FF' : 'FF00C0F0' },
    }
    cell.font = { bold: true, color: { argb: 'FF000000' } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    }
  })

  // Lignes de données
  filteredRapport.value.forEach((row, index) => {
    const cotisationValue = calculerNombres(
      row.montant_trimestre_encours_divise, 
      row.cotisation_trimestre
    )
    
    sheet.addRow({
      num: index + 1,
      matricule: row.matricule,
      nom_prenom: row.nom_prenom,
      section: row.section,
      cotisation: formatMontantExcel(cotisationValue), // Utilisation de la fonction
    })
  })

  // Appliquer les formats et styles
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return
    
    const cellCotisation = row.getCell(5) // Colonne E
    
    // Forcer le type numérique
    if (typeof cellCotisation.value === 'string') {
      cellCotisation.value = formatMontantExcel(cellCotisation.value)
    }
    
    // Appliquer le format monétaire
    cellCotisation.numFmt = '#,##0'
    
    // Style pour toutes les cellules
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      }
    })
  })

  // Ajouter une ligne de somme automatique
  const lastRow = filteredRapport.value.length + 1
  sheet.addRow({
    num: '',
    matricule: '',
    nom_prenom: 'TOTAL GÉNÉRAL',
    section: '',
    cotisation: { formula: `SUM(E2:E${lastRow})` }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), 'LISTE DES MEMBRES 3AV.xlsx')
}
const exportExcel0 = async () => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Prets')

  // Colonnes
  sheet.columns = [
    { header: 'N°', key: 'num', width: 5 },
    { header: 'Matricule', key: 'matricule', width: 15 },
    { header: 'Nom et Prénoms', key: 'nom_prenom', width: 30 },
    { header: 'Section', key: 'section', width: 20 },
    { header: '3AV', key: 'cotisation', width: 15 },
  ]

  // Header style
  sheet.getRow(1).eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colNumber === 5 ? 'FF00FF' : '00C0F0' }, // rose pour 3AV
    }
    cell.font = { bold: true, color: { argb: '000000' } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    }
  })

  // Lignes de données
  filteredRapport.value.forEach((row, index) => {
    sheet.addRow({
      num: index + 1,
      matricule: row.matricule,
      nom_prenom: row.nom_prenom,
      section: row.section,
      cotisation: formatMontant(
        calculerNombres(row.montant_trimestre_encours_divise, row.cotisation_trimestre),
      ),
    })
  })

  // Style des lignes
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return // skip header
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      }
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), 'LISTE DES MEMBRES 3AV.xlsx')
}

onMounted(async () => {
  try {
    isLoading.value = true
    await rapportCotisationStore.getRapportCotisation()
    await cotisationStore.getCotisation()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.table-container {
  max-width: 1200px; /* tu peux mettre 100% si tu veux que ça prenne tout l'écran */
  margin: 0 auto;
  width: 90%; /* s'assure que le container prend toute la largeur disponible */
}

.custom-table {
  width: 100% !important; /* force la table à prendre toute la largeur */
  /*  table-layout: fixed;  permet aux colonnes de se répartir uniformément */
  border: 1px solid black;
  text-align: center;
  font-size: 14px;
}

.custom-table th,
.custom-table td {
  border: 1px solid black;
  padding: 6px;
  word-wrap: break-word; /* pour que le texte long ne casse pas la table */
}

.header-n {
  background-color: #00c0f0;
  width: 5%; /* N° */
}

.header-matricule {
  background-color: #00c0f0;
  width: 10%; /* Matricule */
}

.header-nom {
  background-color: #00c0f0;
  width: 30%; /* Nom et Prénom */
}

.header-section {
  background-color: #00c0f0;
  width: 10%; /* Section */
}

.header-3av {
  background-color: #ff00ff;
  width: 10%; /* 3AV */
}

.table-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
