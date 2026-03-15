import rapportCotisation from '../../views/rapport/rapportCotisation.vue'
import rapportPrestation from '../../views/rapport/rapportPrestation.vue'
import rapportTrimestriel from '../../views/rapport/rapportTrimestriel.vue'

const rapportRoute = [
  
  { path: '/rapportCotisation', name: 'rapportCotisation', component: rapportCotisation },
  { path: '/rapportPrestation', name: 'rapportPrestation', component: rapportPrestation },
  { path: '/rapportTrimestriel', name: 'rapportTrimestriel', component: rapportTrimestriel },
  
]

export default rapportRoute
