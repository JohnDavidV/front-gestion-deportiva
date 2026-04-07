<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="$emit('update:drawer', $event)"
    :rail="rail && !isMobile"
    :temporary="isMobile"
    :permanent="!isMobile"
    :width="260"
    :rail-width="64"
    color="primary"
    theme="dark"
    class="app-navigation"
  >
    <!-- Header con logo clickeable -->
    <div class="nav-header" @click="toggleRail" :class="{ 'nav-header-collapsed': rail && !isMobile }">
      <div class="nav-logo-wrapper">
        <img :src="Logo" alt="InderPlay" class="nav-logo" />
        <transition name="fade-slide">
          <div v-if="!rail || isMobile" class="nav-title">
            <span class="title-main">Inder</span><span class="title-accent">Play</span>
          </div>
        </transition>
      </div>
      <v-icon v-if="!isMobile" class="collapse-indicator" size="16">
        {{ rail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
      </v-icon>
    </div>

    <v-divider class="mx-3" />

    <!-- Menú de navegación -->
    <v-list nav density="compact" class="nav-list px-2">
      <!-- Dashboard -->
      <v-list-item
        :to="{ name: 'Dashboard' }"
        prepend-icon="mdi-view-dashboard"
        title="Inicio"
        value="dashboard"
        rounded="lg"
        class="nav-item"
      />

      <v-divider class="my-2 mx-3" />

      <!-- Profesores -->
      <v-list-group value="profesores">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-tie"
            title="Profesores"
            rounded="lg"
            class="nav-item"
          />
        </template>
        <v-list-item
          :to="{ name: 'Profesores' }"
          prepend-icon="mdi-format-list-bulleted"
          title="Listar"
          rounded="lg"
          class="nav-subitem"
        />
        <v-list-item
          :to="{ name: 'CrearProfesor' }"
          prepend-icon="mdi-account-plus"
          title="Nuevo"
          rounded="lg"
          class="nav-subitem"
        />
      </v-list-group>

      <!-- Alumnos -->
      <v-list-group value="alumnos">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-group"
            title="Alumnos"
            rounded="lg"
            class="nav-item"
          />
        </template>
        <v-list-item
          :to="{ name: 'Alumnos' }"
          prepend-icon="mdi-format-list-bulleted"
          title="Listar"
          rounded="lg"
          class="nav-subitem"
        />
        <v-list-item
          :to="{ name: 'CrearAlumno' }"
          prepend-icon="mdi-account-plus"
          title="Nuevo"
          rounded="lg"
          class="nav-subitem"
        />
      </v-list-group>

      <!-- Clases -->
      <v-list-group value="clases">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-soccer"
            title="Clases"
            rounded="lg"
            class="nav-item"
          />
        </template>
        <v-list-item
          :to="{ name: 'Clases' }"
          prepend-icon="mdi-format-list-bulleted"
          title="Tipos de Clase"
          rounded="lg"
          class="nav-subitem"
        />
        <v-list-item
          :to="{ name: 'CrearClase' }"
          prepend-icon="mdi-plus-circle"
          title="Nueva"
          rounded="lg"
          class="nav-subitem"
        />
      </v-list-group>

      <!-- Horarios -->
      <v-list-item
        :to="{ name: 'Horarios' }"
        prepend-icon="mdi-calendar-clock"
        title="Horarios"
        value="horarios"
        rounded="lg"
        class="nav-item"
      />

      <v-divider class="my-2 mx-3" />

      <!-- Eventos -->
      <v-list-group value="eventos">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-calendar-star"
            title="Eventos"
            rounded="lg"
            class="nav-item"
          />
        </template>
        <v-list-item
          :to="{ name: 'Eventos' }"
          prepend-icon="mdi-format-list-bulleted"
          title="Listar"
          rounded="lg"
          class="nav-subitem"
        />
        <v-list-item
          :to="{ name: 'CrearEvento' }"
          prepend-icon="mdi-calendar-plus"
          title="Nuevo"
          rounded="lg"
          class="nav-subitem"
        />
      </v-list-group>
    </v-list>

    <template #append>
      <v-divider class="mx-3" />
      <div class="nav-footer" :class="{ 'nav-footer-collapsed': rail && !isMobile }">
        <transition name="fade">
          <div v-if="!rail || isMobile" class="footer-text">
            <div class="text-caption opacity-60">InderPlay v1.0.0</div>
            <div class="text-caption opacity-40">© 2026</div>
          </div>
        </transition>
        <v-icon v-if="rail && !isMobile" size="16" class="opacity-40">mdi-dots-horizontal</v-icon>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'
import { useDisplay } from 'vuetify'
import Logo from '@/assets/img/Logo.png'

const props = defineProps({
  drawer: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:drawer', 'update:rail'])

const { mdAndUp } = useDisplay()
const isMobile = computed(() => !mdAndUp.value)

const rail = ref(false)

// Exponer el estado del rail al padre
watch(rail, (newVal) => {
  emit('update:rail', newVal)
})

function toggleRail() {
  if (!isMobile.value) {
    rail.value = !rail.value
  }
}

// Cuando es móvil y se cierra el drawer, resetear el rail
watch(() => props.drawer, (newVal) => {
  if (isMobile.value && !newVal) {
    rail.value = false
  }
})
</script>

<style scoped>
.app-navigation {
  background: linear-gradient(180deg, #0A3A7A 0%, #0D47A1 50%, #1565C0 100%) !important;
}

/* Header del menú */
.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  min-height: 56px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.nav-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.nav-header-collapsed {
  padding: 12px;
  justify-content: center;
}

.nav-logo-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-logo {
  height: 36px;
  width: auto;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.nav-header:hover .nav-logo {
  transform: scale(1.05);
}

.nav-title {
  display: flex;
  align-items: baseline;
  white-space: nowrap;
}

.title-main {
  font-size: 1.15rem;
  font-weight: 800;
  color: white;
}

.title-accent {
  font-size: 1.15rem;
  font-weight: 800;
  color: #FF5722;
}

.collapse-indicator {
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.3s ease;
}

.nav-header:hover .collapse-indicator {
  color: white;
}

/* Menú */
.nav-list {
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  transition: all 0.2s ease;
  margin: 2px 0;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.nav-item.v-list-item--active {
  background: rgba(255, 255, 255, 0.15) !important;
}

.nav-subitem {
  margin-left: 16px !important;
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.nav-subitem:hover {
  border-left-color: white;
  background: rgba(255, 255, 255, 0.08) !important;
}

.nav-subitem.v-list-item--active {
  border-left-color: #FF5722;
  background: rgba(255, 255, 255, 0.12) !important;
}

/* Footer */
.nav-footer {
  padding: 12px 16px;
  text-align: center;
}

.nav-footer-collapsed {
  padding: 8px;
}

.footer-text {
  line-height: 1.4;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Opacity helpers */
.opacity-40 {
  opacity: 0.4;
}

.opacity-60 {
  opacity: 0.6;
}

/* Rail mode - centrar iconos */
:deep(.v-list-item--rail) {
  justify-content: center !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

:deep(.v-list-item--rail .v-list-item__spacer) {
  display: none !important;
}

:deep(.v-navigation-drawer--rail .nav-header) {
  justify-content: center;
  padding: 12px;
}
</style>