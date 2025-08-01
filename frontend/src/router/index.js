import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlayersView from '../views/PlayersView.vue'
import CompareView from '../views/CompareView.vue'
import CreatePlayer from '../views/CreatePlayer.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/createplayers',
    name: 'CreatePlayers',
    component: CreatePlayer
  },
  {
    path: '/compare',
    name: 'Compare',
    component: CompareView
  },
  {
    path: '/myplayers',
    name: 'MyPlayers',
    component: PlayersView
  },
   {
    path: '/login',
    name: 'Login',
    component: Login
  },
   {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
  })

export default router
