import Login from '../../views/auth/Login.vue'
import PageExpire from '../../views/auth/PageExpire.vue'
import Personnel from '../../views/auth/Personnel.vue'
import importMutualiste from '../../views/auth/importMutualiste.vue'

const AuthRoutes = [
  {
    path: '/',
    name: 'Login',
    // meta: { layout: "no-sidebar", requiresAuth: true },
    component: Login,
  },
  {
    path: '/connexion',
    name: 'Login',
    // meta: { layout: "no-sidebar", requiresAuth: true },
    component: Login,
  },
  {
    path: '/PageExpire',
    name: 'PageExpire',
    // meta: { layout: "no-sidebar", requiresAuth: true },
    component: PageExpire,
  },
  {
    path: '/Personnel',
    name: 'Personnel',
    // meta: { layout: "no-sidebar", requiresAuth: true },
    component: Personnel,
  },
  {
    path: '/importMutualiste',
    name: 'importMutualiste',
    // meta: { layout: "no-sidebar", requiresAuth: true },
    component: importMutualiste,
  },
  // {
  //   path: "/logout",
  //   name: "Logout",
  //   component: Logout,
  //   meta: { requiresAuth: true },
  // },
]

export default AuthRoutes
