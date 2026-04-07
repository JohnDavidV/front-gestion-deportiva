<template>
  <v-app class="app-container">
    <!-- Overlay de carga con animación -->
    <transition name="loader-fade">
      <div v-if="loading" class="loader-overlay">
        <div class="loader-content">
          <!-- Logo con anillos giratorios -->
          <div class="logo-wrapper">
            <img :src="Logo" alt="InderPlay" class="loader-logo" />
            <div class="loader-ring ring-1"></div>
            <div class="loader-ring ring-2"></div>
            <div class="loader-ring ring-3"></div>
          </div>

          <!-- Título -->
          <div class="loader-title">
            <span class="title-inder">Inder</span><span class="title-play">Play</span>
          </div>

          <!-- Barra de progreso -->
          <div class="loader-bar">
            <div class="loader-progress"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- App principal -->
    <transition name="app-fade">
      <div v-show="!loading" class="app-wrapper">
        <AppNavigation
          :drawer="drawer"
          :rail="rail"
          @update:drawer="drawer = $event"
          @update:rail="rail = $event"
        />
        <AppHeader
          :rail="rail"
          :drawer="drawer"
          @toggle-drawer="drawer = !drawer"
        />

        <v-main class="app-main">
          <v-container fluid class="pa-3 pa-md-4">
            <transition name="page-slide" mode="out-in">
              <router-view />
            </transition>
          </v-container>
        </v-main>

        <!-- Footer delgado -->
        <v-footer app color="surface" class="app-footer py-2">
          <v-container fluid class="pa-0">
            <div class="d-flex justify-center align-center">
              <v-icon size="12" color="primary" class="mr-1">mdi-soccer</v-icon>
              <span class="text-caption">
                <strong>InderPlay</strong> © {{ new Date().getFullYear() }}
              </span>
            </div>
          </v-container>
        </v-footer>
      </div>
    </transition>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppNavigation from './components/layout/AppNavigation.vue'
import AppHeader from './components/layout/AppHeader.vue'
import Logo from './assets/img/Logo.png'

const drawer = ref(true)
const rail = ref(false)
const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1800)
})
</script>

<style>
/* Reset global */
html {
  overflow-y: auto !important;
}

.app-container {
  background: #F5F5F5;
}

/* ===== ANIMACIÓN DE CARGA ===== */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0A3A7A 0%, #0D47A1 30%, #1565C0 60%, #1976D2 100%);
  background-size: 400% 400%;
  animation: gradientMove 8s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

@keyframes gradientMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* Logo con anillos */
.logo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-logo {
  width: 80px;
  height: auto;
  z-index: 2;
  animation: logoPulse 2s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.loader-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: ringRotate 2s linear infinite;
}

.ring-1 {
  width: 100%;
  height: 100%;
  border-top-color: rgba(255, 255, 255, 0.6);
  border-right-color: rgba(255, 255, 255, 0.3);
}

.ring-2 {
  width: 85%;
  height: 85%;
  border-top-color: rgba(255, 87, 34, 0.8);
  border-left-color: rgba(255, 87, 34, 0.4);
  animation-direction: reverse;
  animation-duration: 1.5s;
}

.ring-3 {
  width: 70%;
  height: 70%;
  border-bottom-color: rgba(255, 255, 255, 0.5);
  animation-duration: 2.5s;
}

@keyframes ringRotate {
  to { transform: rotate(360deg); }
}

/* Título */
.loader-title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  animation: titleFade 1s ease-out;
}

.title-inder {
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.title-play {
  color: #FF5722;
  text-shadow: 0 2px 10px rgba(255, 87, 34, 0.3);
}

@keyframes titleFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Barra de progreso */
.loader-bar {
  width: 180px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.loader-progress {
  height: 100%;
  background: linear-gradient(90deg, #FF5722, #FFC107, #4CAF50, #2196F3, #FF5722);
  background-size: 200% 100%;
  animation: progressSlide 1.5s ease-in-out infinite;
  width: 40%;
}

@keyframes progressSlide {
  0% { background-position: 0% 0%; transform: translateX(-100%); }
  100% { background-position: 200% 0%; transform: translateX(350%); }
}

/* Transiciones */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loader-fade-leave-to {
  opacity: 0;
}

.app-fade-enter-active {
  transition: opacity 0.5s ease 0.3s;
}

.app-fade-enter-from {
  opacity: 0;
}

/* ===== ANIMACIÓN DE PÁGINA ===== */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.25s ease;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

/* ===== FOOTER ===== */
.app-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
  min-height: 32px !important;
  max-height: 32px !important;
}

.app-footer .v-container {
  padding: 0 !important;
}

.app-footer .text-caption {
  font-size: 11px !important;
  color: rgba(0, 0, 0, 0.5) !important;
}

.app-main {
  background: #F5F5F5;
  min-height: calc(100vh - 32px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 600px) {
  .loader-title {
    font-size: 2rem;
  }

  .loader-bar {
    width: 140px;
  }

  .logo-wrapper {
    width: 90px;
    height: 90px;
  }

  .loader-logo {
    width: 60px;
  }

  .ring-3 {
    display: none;
  }
}
</style>