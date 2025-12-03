import { createRouter, createWebHistory } from 'vue-router';

import DeportistasPage from '../views/DeportistasPage.vue';
import CrearDeportistaPage from '../views/CrearDeportistaPage.vue';
import EditarDeportistaPage from '../views/EditarDeportistaPage.vue';

const routes = [
  {
    path: '/',
    name: 'Deportistas',
    component: DeportistasPage,
  },
  {
    path: '/crear',
    name: 'CrearDeportista',
    component: CrearDeportistaPage,
  },
  {
    path: '/editar/:id',
    name: 'EditarDeportista',
    component: EditarDeportistaPage,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
