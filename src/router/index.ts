import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CrearClave from '@/components/Claves/CrearClave.vue'
import CrearCliente from '@/components/Clientes/CrearCliente.vue'
import CrearFirma from '@/components/Firmas/CrearFirma.vue'
import Firmas from '@/components/Firmas/Firmas.vue'
import Clientes from '@/components/Clientes/Clientes.vue'
import Claves from '@/components/Claves/Claves.vue'
import EditarClave from '@/components/Claves/EditarClave.vue'
import Ajustes from '@/components/Ajustes/Ajustes.vue'
import CopiaDeSeguridad from '@/components/CopiaDeSeguridad/CopiaDeSeguridad.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/copiaDeSeguridad',
      name: 'copiaDeSeguridad',
      component: CopiaDeSeguridad,
    },
    {
      path: '/ajustes',
      name: 'ajustes',
      component: Ajustes,
    },
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
      name: 'crearFirma',
      component: CrearFirma,
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
  ],
})

export default router
