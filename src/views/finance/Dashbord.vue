<template>
  <Loader :isLoading="isLoading" />
  <div class="dashboard-container p-6 space-y-6">
    <!-- En-tête avec animation -->
    <div class="dashboard-header mb-8">
      <div class="header-content">
        <h1 class="dashboard-title">
          <span class="title-icon">📊</span>
          Tableau de bord
          <span class="title-gradient">Finances & Prestations</span>
        </h1>
        <p class="dashboard-subtitle">Vue d'ensemble de vos activités et performances</p>
      </div>
      <div class="header-actions">
        <div class="date-badge">
          <iconify-icon icon="solar:calendar-bold-duotone" class="me-2"></iconify-icon>
          {{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
        </div>
      </div>
    </div>

    <!-- Statistiques globales -->
    <div class="stats-grid">
      <div class="stat-card total">
        <div class="stat-icon">
          <iconify-icon icon="solar:wallet-money-bold-duotone"></iconify-icon>
        </div>
        <div class="stat-content">
          <span class="stat-label">Montant total des prêts</span>
          <span class="stat-value">{{ formatCurrency(montantTotal) }}</span>
          <span class="stat-trend positive">
            <iconify-icon icon="solar:arrow-rise-bold-duotone"></iconify-icon>
            +12.5%
          </span>
        </div>
      </div>
      
      <div class="stat-card prestations">
        <div class="stat-icon">
          <iconify-icon icon="solar:hand-heart-bold-duotone"></iconify-icon>
        </div>
        <div class="stat-content">
          <span class="stat-label">Prestations en cours</span>
          <span class="stat-value">{{ encoursDemandeTaile }}</span>
          <span class="stat-text">{{ formatCurrency(totalDemandeEncours) }} FCFA</span>
        </div>
      </div>
      
      <div class="stat-card success">
        <div class="stat-icon">
          <iconify-icon icon="solar:check-circle-bold-duotone"></iconify-icon>
        </div>
        <div class="stat-content">
          <span class="stat-label">Taux de réussite</span>
          <span class="stat-value">{{ tauxReussite }}%</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: tauxReussite + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Prêts -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">
          <iconify-icon icon="solar:hand-money-bold-duotone" class="section-icon"></iconify-icon>
          Analyse des prêts
        </h2>
        <div class="section-actions">
          <button class="btn-export" @click="exportExcel">
            <iconify-icon icon="solar:file-excel-bold-duotone"></iconify-icon>
            Excel
          </button>
          <button class="btn-export" @click="exportPDF">
            <iconify-icon icon="solar:file-pdf-bold-duotone"></iconify-icon>
            PDF
          </button>
        </div>
      </div>

      <div class="cards-grid">
        <!-- Prêts en cours -->
        <div class="status-card pending">
          <div class="card-header">
            <div class="status-icon">
              <iconify-icon icon="solar:clock-circle-bold-duotone"></iconify-icon>
            </div>
            <span class="status-badge">En cours</span>
          </div>
          <div class="card-body">
            <div class="stat-row">
              <span class="stat-label">Nombre</span>
              <span class="stat-number">{{ encoursTaile }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Montant total</span>
              <span class="stat-amount">{{ formatCurrency(totalEncours) }}</span>
            </div>
          </div>
          <div class="card-footer">
            <!-- <span class="trend">+8% ce mois</span> -->
          </div>
        </div>

        <!-- Prêts acceptés -->
        <div class="status-card approved">
          <div class="card-header">
            <div class="status-icon">
              <iconify-icon icon="solar:check-circle-bold-duotone"></iconify-icon>
            </div>
            <span class="status-badge">Acceptés</span>
          </div>
          <div class="card-body">
            <div class="stat-row">
              <span class="stat-label">Nombre</span>
              <span class="stat-number">{{ accepterTaile }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Montant total</span>
              <span class="stat-amount">{{ formatCurrency(totalAccepter) }}</span>
            </div>
          </div>
          <div class="card-footer">
            <!-- <span class="trend positive">+15% ce mois</span> -->
          </div>
        </div>

        <!-- Prêts refusés -->
        <div class="status-card rejected">
          <div class="card-header">
            <div class="status-icon">
              <iconify-icon icon="solar:close-circle-bold-duotone"></iconify-icon>
            </div>
            <span class="status-badge">Refusés</span>
          </div>
          <div class="card-body">
            <div class="stat-row">
              <span class="stat-label">Nombre</span>
              <span class="stat-number">{{ refuserTaile }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Montant total</span>
              <span class="stat-amount">{{ formatCurrency(totalRefuser) }}</span>
            </div>
          </div>
          <div class="card-footer">
            <!-- <span class="trend negative">-5% ce mois</span> -->
          </div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="charts-grid">
        <div class="chart-card">
          <h3 class="chart-title">
            <iconify-icon icon="solar:chart-square-bold-duotone"></iconify-icon>
            Répartition par statut
          </h3>
          <apexchart
            type="bar"
            height="300"
            :options="statusChartOptions"
            :series="statusChartSeries"
          />
        </div>

        <div class="chart-card">
          <h3 class="chart-title">
            <iconify-icon icon="solar:chart-2-bold-duotone"></iconify-icon>
            Modes de paiement
          </h3>
          <apexchart
            type="donut"
            height="300"
            :options="modeChartOptions"
            :series="modeChartSeries"
          />
        </div>
      </div>
    </div>

    <!-- Section Prestations -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">
          <iconify-icon icon="solar:hand-heart-bold-duotone" class="section-icon"></iconify-icon>
          Analyse des prestations
        </h2>
      </div>

      <div class="cards-grid">
        <!-- Demandes en cours -->
        <div class="status-card pending">
          <div class="card-header">
            <div class="status-icon">
              <iconify-icon icon="solar:clock-circle-bold-duotone"></iconify-icon>
            </div>
            <span class="status-badge">En cours</span>
          </div>
          <div class="card-body">
            <div class="stat-row">
              <span class="stat-label">Nombre</span>
              <span class="stat-number">{{ encoursDemandeTaile }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Montant total</span>
              <span class="stat-amount">{{ formatCurrency(totalDemandeEncours) }}</span>
            </div>
          </div>
        </div>

        <!-- Demandes acceptées -->
        <div class="status-card approved">
          <div class="card-header">
            <div class="status-icon">
              <iconify-icon icon="solar:check-circle-bold-duotone"></iconify-icon>
            </div>
            <span class="status-badge">Acceptées</span>
          </div>
          <div class="card-body">
            <div class="stat-row">
              <span class="stat-label">Nombre</span>
              <span class="stat-number">{{ accepterDemandeTaile }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Montant total</span>
              <span class="stat-amount">{{ formatCurrency(totalDemandeAccepter) }}</span>
            </div>
          </div>
        </div>

        <!-- Demandes refusées -->
        <div class="status-card rejected">
          <div class="card-header">
            <div class="status-icon">
              <iconify-icon icon="solar:close-circle-bold-duotone"></iconify-icon>
            </div>
            <span class="status-badge">Refusées</span>
          </div>
          <div class="card-body">
            <div class="stat-row">
              <span class="stat-label">Nombre</span>
              <span class="stat-number">{{ refuserDemandeTaile }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Montant total</span>
              <span class="stat-amount">{{ formatCurrency(totalDemandeRefuser) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ApexCharts from 'vue3-apexcharts'
import { ref, computed, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import { useDemandePrestation } from '../../stores/prestation/demandePrestation'
import 'jspdf-autotable'
import Loader from '../../components/Loader.vue'
import { usePret } from '../../stores/finance/pret'

const pretStore = usePret()
const demandePrestationStore = useDemandePrestation()
const isLoading = ref(false)

// Données des prêts
const pret = pretStore.getterPret

// Taux de réussite
const tauxReussite = computed(() => {
  const total = pret.length
  if (total === 0) return 0
  const acceptes = accepterTaile.value
  return Math.round((acceptes / total) * 100)
})

// Nombre de prêts
const encoursTaile = computed(() => pret.filter((item) => item.statut === 1).length)
const accepterTaile = computed(() => pret.filter((item) => item.statut === 2).length)
const refuserTaile = computed(() => pret.filter((item) => item.statut === 3).length)

// Nombre de prestation
const encoursDemandeTaile = computed(() => 
  demandePrestationStore.getterDemandePrestation.filter((item) => item.statut === 1).length
)
const accepterDemandeTaile = computed(() => 
  demandePrestationStore.getterDemandePrestation.filter((item) => item.statut === 2).length
)
const refuserDemandeTaile = computed(() => 
  demandePrestationStore.getterDemandePrestation.filter((item) => item.statut === 3).length
)

// Totaux montants prêts
const totalEncours = computed(() =>
  pret.filter((item) => item.statut === 1)
    .reduce((sum, item) => sum + Number(item.montant || 0), 0)
)
const totalAccepter = computed(() =>
  pret.filter((item) => item.statut === 2)
    .reduce((sum, item) => sum + Number(item.montant || 0), 0)
)
const totalRefuser = computed(() =>
  pret.filter((item) => item.statut === 3)
    .reduce((sum, item) => sum + Number(item.montant || 0), 0)
)

// Totaux montants demandes
const totalDemandeEncours = computed(() =>
  demandePrestationStore.getterDemandePrestation
    .filter((item) => item.statut === 1)
    .reduce((sum, item) => sum + Number(item.montant || 0), 0)
)
const totalDemandeAccepter = computed(() =>
  demandePrestationStore.getterDemandePrestation
    .filter((item) => item.statut === 2)
    .reduce((sum, item) => sum + Number(item.montant || 0), 0)
)
const totalDemandeRefuser = computed(() =>
  demandePrestationStore.getterDemandePrestation
    .filter((item) => item.statut === 3)
    .reduce((sum, item) => sum + Number(item.montant || 0), 0)
)

// Montant total global
const montantTotal = computed(() => pret.reduce((acc, p) => acc + p.montant, 0))

// Options des graphiques
const statusChartOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  colors: ['#f59e0b', '#10b981', '#ef4444'],
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '60%',
      distributed: true,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val.toLocaleString('fr-FR'),
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ['#304758']
    }
  },
  grid: {
    borderColor: '#e2e8f0',
    strokeDashArray: 4
  },
  xaxis: {
    categories: ['En cours', 'Acceptés', 'Refusés'],
    labels: {
      style: {
        colors: ['#f59e0b', '#10b981', '#ef4444'],
        fontSize: '14px',
        fontWeight: 600
      }
    }
  },
  yaxis: {
    title: {
      text: 'Montant (FCFA)',
      style: {
        fontSize: '12px',
        fontWeight: 500
      }
    },
    labels: {
      formatter: (val: number) => val.toLocaleString('fr-FR')
    }
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) => val.toLocaleString('fr-FR') + ' FCFA'
    }
  }
}

const statusChartSeries = computed(() => [
  {
    name: 'Montant',
    data: [totalEncours.value, totalAccepter.value, totalRefuser.value]
  }
])

const modeChartOptions = {
  chart: {
    type: 'donut',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  colors: ['#f97316', '#facc15', '#10b981', '#3b82f6', '#a855f7'],
  labels: ['Orange Money', 'MTN Money', 'Moov Money', 'Wave', 'Cash'],
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '14px'
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: () => montantTotal.value.toLocaleString('fr-FR') + ' FCFA'
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val.toFixed(1) + '%'
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) => val.toLocaleString('fr-FR') + ' FCFA'
    }
  }
}

const modeChartSeries = computed(() => {
  const totals = [0, 0, 0, 0, 0]
  pret.forEach((p) => {
    const mode = p.mode_paiement?.toUpperCase() || ''
    const montant = Number(p.montant) || 0
    if (mode.includes('ORANGE')) totals[0] += montant
    else if (mode.includes('MTN')) totals[1] += montant
    else if (mode.includes('MOOV')) totals[2] += montant
    else if (mode.includes('WAVE')) totals[3] += montant
    else if (mode.includes('CASH')) totals[4] += montant
  })
  return totals
})

// Format devise
function formatCurrency(value: number) {
  return value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// Export Excel
function exportExcel() {
  const ws = XLSX.utils.json_to_sheet(pret)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Prêts')
  XLSX.writeFile(wb, 'prets.xlsx')
}

// Export PDF
function exportPDF() {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.setTextColor(58, 123, 213)
  doc.text('Tableau de bord des prêts', 14, 20)
  
  doc.setFontSize(11)
  doc.setTextColor(100, 116, 139)
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30)
  
  const table = pret.map((p) => [
    p.id,
    p.nom_prenom,
    p.montant.toLocaleString('fr-FR') + ' FCFA',
    p.mode_paiement,
    p.statut === 1 ? 'En cours' : p.statut === 2 ? 'Accepté' : 'Refusé'
  ])
  
  ;(doc as any).autoTable({
    head: [['ID', 'Nom', 'Montant', 'Mode', 'Statut']],
    body: table,
    startY: 40,
    theme: 'striped',
    headStyles: {
      fillColor: [58, 123, 213],
      textColor: [255, 255, 255],
      fontSize: 11
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    }
  })
  
  doc.save('prets.pdf')
}

onMounted(async () => {
  try {
    isLoading.value = true
    await pretStore.getPret()
    await demandePrestationStore.getDemandePrestation()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.dashboard-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 24px;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-content {
  flex: 1;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 2.5rem;
}

.title-gradient {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 8px;
}

.dashboard-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.date-badge {
  background: white;
  padding: 10px 20px;
  border-radius: 50px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  color: #3a7bd5;
  font-weight: 500;
  display: flex;
  align-items: center;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(58, 123, 213, 0.3);
}

.stat-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.prestations {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon iconify-icon {
  font-size: 2rem;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  display: block;
  margin-bottom: 4px;
}

.stat-value {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
}

.stat-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.85rem;
  color: white;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin-top: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 10px;
  transition: width 0.3s ease;
}

/* Sections */
.dashboard-section {
  background: white;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.section-icon {
  color: #3a7bd5;
  font-size: 1.5rem;
}

.section-actions {
  display: flex;
  gap: 12px;
}

.btn-export {
  padding: 8px 16px;
  border: none;
  border-radius: 12px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-export:hover {
  background: #3a7bd5;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 123, 213, 0.3);
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.status-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.15);
}

.status-card.pending {
  border-left: 4px solid #f59e0b;
}

.status-card.approved {
  border-left: 4px solid #10b981;
}

.status-card.rejected {
  border-left: 4px solid #ef4444;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pending .status-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.approved .status-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.rejected .status-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-icon iconify-icon {
  font-size: 1.5rem;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.pending .status-badge {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.approved .status-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.rejected .status-badge {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.card-body {
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-row .stat-label {
  color: #64748b;
  font-size: 0.9rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-amount {
  font-size: 1.1rem;
  font-weight: 600;
  color: #3a7bd5;
}

.card-footer {
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.trend {
  font-size: 0.85rem;
  color: #64748b;
}

.trend.positive {
  color: #10b981;
}

.trend.negative {
  color: #ef4444;
}

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.chart-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.chart-title iconify-icon {
  color: #3a7bd5;
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 1.4rem;
  }
}
</style>