<template>
  <v-app-bar flat class="app-header" height="56">
    <!-- Banner con animación -->
    <div class="header-banner">
      <!-- Fondo con degradado animado -->
      <div class="gradient-bg"></div>

      <!-- Burbujas rebotando -->
      <div class="bubbles">
        <div class="bubble" v-for="n in 8" :key="n" :style="getBubbleStyle(n)"></div>
      </div>

      <!-- Contenido del header -->
      <div class="header-content">
        <!-- Botón hamburguesa para móvil -->
        <v-app-bar-nav-icon
          v-if="isMobile"
          @click="$emit('toggle-drawer')"
          class="menu-btn"
        />

        <!-- En móvil: Logo + Nombre de la app -->
        <template v-if="isMobile">
          <div class="header-logo">
            <img :src="Logo" alt="InderPlay" class="logo-img" />
            <span class="logo-text">
              <span class="text-white">Inder</span><span class="text-accent">Play</span>
            </span>
          </div>
        </template>

        <!-- En desktop: Nombre de la app (solo si menú colapsado) + Nombre del módulo -->
        <template v-else>
          <!-- Nombre de la app con separador (solo cuando menú colapsado) -->
          <transition name="fade-slide">
            <div v-if="rail" class="app-name">
              <span class="text-white">Inder</span><span class="text-accent">Play</span>
              <span class="separator">|</span>
            </div>
          </transition>

          <!-- Nombre del módulo -->
          <div class="page-title">
            <span class="title-text">{{ pageTitle }}</span>
          </div>
        </template>

        <v-spacer />

        <!-- Notificaciones -->
        <v-btn icon variant="text" size="small" class="header-btn">
          <v-badge :content="notifications" :model-value="notifications > 0" color="error">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <!-- Menú de usuario -->
        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" size="small" class="header-btn user-btn">
              <v-avatar size="28" color="white">
                <v-icon color="primary" size="18">mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-account-outline" title="Perfil" />
            <v-list-item prepend-icon="mdi-cog-outline" title="Configuración" />
            <v-divider />
            <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" />
          </v-list>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import Logo from '@/assets/img/Logo.png'

const props = defineProps({
  rail: {
    type: Boolean,
    default: false,
  },
  drawer: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['toggle-drawer'])

const route = useRoute()
const { mdAndUp } = useDisplay()
const isMobile = computed(() => !mdAndUp.value)

const notifications = 0

const pageTitle = computed(() => {
  const name = route.name
  const titles = {
    Dashboard: 'Inicio',
    Profesores: 'Profesores',
    CrearProfesor: 'Nuevo Profesor',
    EditarProfesor: 'Editar Profesor',
    ProfesorHorarios: 'Horarios',
    Alumnos: 'Alumnos',
    CrearAlumno: 'Nuevo Alumno',
    EditarAlumno: 'Editar Alumno',
    Clases: 'Tipos de Clase',
    CrearClase: 'Nueva Clase',
    EditarClase: 'Editar Clase',
    Horarios: 'Gestión de Horarios',
    Eventos: 'Eventos',
    CrearEvento: 'Nuevo Evento',
    EditarEvento: 'Editar Evento',
    EventoInscripcion: 'Inscripción',
  }
  return titles[name] || 'InderPlay'
})

function getBubbleStyle(n) {
  const sizes = [6, 8, 10, 7, 9, 5, 11, 8]
  const lefts = [5, 15, 30, 45, 55, 70, 82, 92]
  const delays = [0, 0.3, 0.7, 0.2, 0.5, 0.8, 0.1, 0.6]
  const durations = [3, 2.5, 3.5, 2.8, 3.2, 2.7, 3.8, 2.3]

  return {
    width: `${sizes[n - 1]}px`,
    height: `${sizes[n - 1]}px`,
    left: `${lefts[n - 1]}%`,
    animationDelay: `${delays[n - 1]}s`,
    animationDuration: `${durations[n - 1]}s`,
  }
}
</script>

<style scoped>
.app-header {
  position: relative;
  background: transparent !important;
}

.header-banner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0A3A7A 0%, #0D47A1 40%, #1565C0 70%, #1976D2 100%);
  background-size: 300% 300%;
  animation: gradientMove 10s ease infinite;
  overflow: hidden;
}

@keyframes gradientMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Burbujas */
.bubbles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.2);
  animation: bubbleBounce 3s ease-in-out infinite;
}

@keyframes bubbleBounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-12px);
    opacity: 0.8;
  }
}

/* Contenido */
.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  width: 100%;
}

.menu-btn {
  color: white !important;
  margin-right: 12px;
}

/* Logo en móvil */
.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-img {
  height: 32px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 800;
}

.text-white {
  color: white;
}

.text-accent {
  color: #FF5722;
}

/* App name en desktop colapsado */
.app-name {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
}

.separator {
  margin: 0 12px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 300;
}

/* Título */
.page-title {
  margin-left: 0;
}

.title-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: white;
}

/* Botones */
.header-btn {
  color: white !important;
  margin-left: 8px;
}

.user-btn {
  padding: 0 8px;
  border-radius: 20px;
}

/* Transiciones */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>