import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
  },

  // Profesores
  {
    path: '/profesores',
    name: 'Profesores',
    component: () => import('../views/profesores/ProfesoresList.vue'),
  },
  {
    path: '/profesores/crear',
    name: 'CrearProfesor',
    component: () => import('../views/profesores/ProfesorForm.vue'),
  },
  {
    path: '/profesores/:id/editar',
    name: 'EditarProfesor',
    component: () => import('../views/profesores/ProfesorForm.vue'),
    props: true,
  },
  {
    path: '/profesores/:id/horarios',
    name: 'ProfesorHorarios',
    component: () => import('../views/profesores/ProfesorHorarios.vue'),
    props: true,
  },

  // Alumnos
  {
    path: '/alumnos',
    name: 'Alumnos',
    component: () => import('../views/alumnos/AlumnosList.vue'),
  },
  {
    path: '/alumnos/crear',
    name: 'CrearAlumno',
    component: () => import('../views/alumnos/AlumnoForm.vue'),
  },
  {
    path: '/alumnos/:id/editar',
    name: 'EditarAlumno',
    component: () => import('../views/alumnos/AlumnoForm.vue'),
    props: true,
  },

  // Clases
  {
    path: '/clases',
    name: 'Clases',
    component: () => import('../views/clases/ClasesList.vue'),
  },
  {
    path: '/clases/crear',
    name: 'CrearClase',
    component: () => import('../views/clases/ClaseForm.vue'),
  },
  {
    path: '/clases/:id/editar',
    name: 'EditarClase',
    component: () => import('../views/clases/ClaseForm.vue'),
    props: true,
  },

  // Horarios
  {
    path: '/horarios',
    name: 'Horarios',
    component: () => import('../views/horarios/HorariosConfig.vue'),
  },

  // Eventos
  {
    path: '/eventos',
    name: 'Eventos',
    component: () => import('../views/eventos/EventosList.vue'),
  },
  {
    path: '/eventos/crear',
    name: 'CrearEvento',
    component: () => import('../views/eventos/EventoForm.vue'),
  },
  {
    path: '/eventos/:id/editar',
    name: 'EditarEvento',
    component: () => import('../views/eventos/EventoForm.vue'),
    props: true,
  },
  {
    path: '/eventos/:id/inscripcion',
    name: 'EventoInscripcion',
    component: () => import('../views/eventos/EventoInscripcion.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router