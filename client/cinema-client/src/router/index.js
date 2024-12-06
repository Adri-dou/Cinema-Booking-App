
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import MovieList from '../views/MovieList.vue';
import MovieDetails from '../views/MovieDetails.vue';
import FoodOrder from '../components/FoodOrder.vue';
import Prices from '../components/Prices.vue';
import SeatSelection from '../views/SeatSelection.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movies', name: 'MovieList', component: MovieList },
  { path: '/movies/:id', name: 'MovieDetails', component: MovieDetails, props: true },
  { path: '/order-food', name: 'FoodOrder', component: FoodOrder },
  { path: '/prices', name: 'Prices', component: Prices },
  { path: "/seat-selection/:sessionId", name: "SeatSelection", component: SeatSelection, props: true,},
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', component: Profile, meta: { requiresAuth: true }}, // Protect this route
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Add a global navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('authToken');

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
