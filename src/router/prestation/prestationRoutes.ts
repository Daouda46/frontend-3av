 
 import TypePrestation from '../../views/prestation/TypePrestation.vue'
 import DemandePrestation from '../../views/prestation/DemandePrestation.vue'
 import SuiviPrestation from '../../views/prestation/SuiviPrestation.vue'


const prestationRoutes= [
    
    {
        path: '/TypePrestation',
        name: 'TypePrestation',
        component: TypePrestation,
    },
    {
        path: '/DemandePrestation',
        name: 'DemandePrestation',
        component: DemandePrestation,
    },
 
    {
        path: '/SuiviPrestation',
        name: 'SuiviPrestation',
        component: SuiviPrestation,
    },
 
  
    
    ];

export default prestationRoutes
