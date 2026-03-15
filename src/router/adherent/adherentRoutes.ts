 import Accueil from '../../views/adherent/accueil/Accueil.vue'
 import NewsDetail from '../../views/adherent/accueil/NewsDetail.vue'
 import DemandePret from '../../views/adherent/DemandePret.vue'
 import SuiviPret from '../../views/adherent/SuiviPret.vue'
 import Attestation from '../../views/adherent/Attestation.vue'
 import impressionAttestation from '../../views/adherent/impressionAttestation.vue'

const adherentRoute= [
    

    { path: '/impressionAttestation',name: 'impressionAttestation', component: impressionAttestation,},
    { path: '/Attestation',name: 'Attestation', component: Attestation,},
    { path: '/DemandePret',name: 'DemandePret', component: DemandePret,},
    { path: '/SuiviPret',name: 'SuiviPret', component: SuiviPret,},
    { path: '/Accueil',name: 'Accueil', component: Accueil,},
    { path: '/news/:id', name: 'news-detail', component: NewsDetail, props: true }
    ];

export default adherentRoute
