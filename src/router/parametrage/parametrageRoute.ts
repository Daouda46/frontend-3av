import TheContent from "../../layout/TheContent.vue"
 import TheFonction from '../../views/parametrage/TheFonction.vue'
 import Emploi from '../../views/parametrage/Emploi.vue'
 import Role from '../../views/parametrage/Role.vue'
 import Service from '../../views/parametrage/Service.vue'
 import Grade from '../../views/parametrage/Grade.vue'
 import StructureControlle from '../../views/parametrage/StructureControlle.vue'
 import Actualite from '../../views/parametrage/Actualite.vue'
 import Imagerie from '../../views/parametrage/Imagerie.vue'
 import Caisse from '../../views/bureau/Caisse.vue'
 import ParametrageCotisation from '../../views/bureau/ParametrageCotisation.vue'
 import exerciceBudgetaire from '../../views/parametrage/exerciceBudgetaire.vue'
 import Trimestre from '../../views/parametrage/Trimestre.vue'


const parametrageRoute = [
  {
    path: '/exerciceBudgetaire',
    name: 'exerciceBudgetaire',
    component: exerciceBudgetaire,
  },
  { path: '/Trimestre', name: 'Trimestre', component: Trimestre },
  { path: '/Caisse', name: 'Caisse', component: Caisse },
  { path: '/ParametrageCotisation', name: 'ParametrageCotisation', component: ParametrageCotisation },
  {
    path: '/StructureControlle',
    name: 'StructureControlle',
    component: StructureControlle,
  },
  {
    path: '/TheFonction',
    name: 'TheFonction',
    component: TheFonction,
  },
  {
    path: '/Actualite',
    name: 'Actualite',
    component: Actualite,
  },
  {
    path: '/Imagerie',
    name: 'Imagerie',
    component: Imagerie,
  },
  {
    path: '/Grade',
    name: 'Grade',
    component: Grade,
  },
  {
    path: '/Service',
    name: 'Service',
    component: Service,
  },
  {
    path: '/Role',
    name: 'Role',
    component: Role,
  },
  {
    path: '/Emploi',
    name: 'Emploi',
    component: Emploi,
  },
  {
    path: '/default',
    name: 'TheContent',
    component: TheContent,
  },
]

export default parametrageRoute
