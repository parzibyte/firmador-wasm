import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CrearClave from '@/components/Claves/CrearClave.vue'
import CrearCliente from '@/components/Clientes/CrearCliente.vue'
import CrearFirma from '@/components/Firmas/CrearFirma.vue'
import Firmas from '@/components/Firmas/Firmas.vue'
import Clientes from '@/components/Clientes/Clientes.vue'
import Claves from '@/components/Claves/Claves.vue'
import EditarClave from '@/components/Claves/EditarClave.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/crearClave',
      name: 'crearClave',
      component: CrearClave,
    },
    {
      path: '/editarClave/:id',
      name: 'editarClave',
      component: EditarClave,
    },
    {
      path: '/claves',
      name: 'claves',
      component: Claves,
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
      path: '/firmas',
      name: 'firmas',
      component: Firmas,
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: Clientes,
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
