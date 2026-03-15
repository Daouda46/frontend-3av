 import Pret from '../../views/finance/Pret.vue'
 import Dashbord from '../../views/finance/Dashbord.vue'
 import Remboursement from '../../views/finance/Remboursement.vue'


const financeRoute= [
    
    {
        path: '/pret',
        name: 'Pret',
        component: Pret,
    },
    {
        path: '/Remboursement',
        name: 'Remboursement',
        component: Remboursement,
    },
    {
        path: '/Dashbord',
        name: 'Dashbord',
        component: Dashbord,
    },
    
    ];

export default financeRoute
