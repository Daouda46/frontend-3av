import { createRouter, createWebHistory } from "vue-router";
import AuthRoutes from "./auth/authRoutes";
import parametrageRoute from "./parametrage/parametrageRoute"
import financeRoute from "./finance/financeRoute"
import adherentRoute from "./adherent/adherentRoutes"
import rapportRoute from "./rapport/rapportRoutes"
// import bureauRoute from './bureau/bureauRoutes'
import prestationRoutes from "./prestation/prestationRoutes"

// Combine main routes and auth routes
const routes = [
  ...AuthRoutes, // Spread the auth routes
  ...financeRoute,
  ...parametrageRoute,
  ...adherentRoute,
  ...rapportRoute,
  ...prestationRoutes,
  // ...bureauRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});


// router.beforeEach((to, from, next) => {
//   const publicPages = ["/connexion"];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem("accessToken");

//   if (authRequired && !loggedIn) {
//     next("/connexion");
//   } else {
//     if (to.path === "/connexion" && loggedIn) {
//       next({ name: "Pret" });
//       return;
//     }

//     next();
//   }
// });

export default router;
