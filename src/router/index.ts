import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CrearClave from '@/components/Claves/CrearClave.vue'
import CrearCliente from '@/components/Clientes/CrearCliente.vue'
import CrearFirma from '@/components/Firmas/CrearFirma.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/crearClave',
      name: 'crearClave',
      component: CrearClave,
    },
    {
      path: '/crearCliente',
      name: 'crearCliente',
      component: CrearCliente,
    },
    {
      path: '/crearFirma',
      name: 'crearFirma',
      component: CrearFirma,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
