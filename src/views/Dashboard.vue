<template>
  <v-container fluid>
    <!-- Encabezado -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div>
            <h1 class="text-h4 text-sm-h3 font-weight-bold">
              Bienvenido a <span class="text-primary">Inder</span><span class="text-accent">Play</span>
            </h1>
            <p class="text-body-1 text-medium-emphasis mt-1">
              Sistema de gestión deportiva
            </p>
          </div>
          <v-chip color="primary" variant="tonal">
            <v-icon start>mdi-calendar-today</v-icon>
            {{ fechaActual }}
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- Tarjetas de resumen -->
    <v-row class="mb-4">
      <v-col cols="6" sm="6" md="3">
        <v-card
          color="primary"
          variant="flat"
          class="stat-card"
          :to="{ name: 'Profesores' }"
          hover
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-white-70">Profesores</div>
                <div class="text-h3 font-weight-bold text-white">{{ stats.profesores }}</div>
              </div>
              <v-avatar size="48" color="white" variant="tonal">
                <v-icon size="24" color="white">mdi-account-tie</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="6" md="3">
        <v-card
          color="success"
          variant="flat"
          class="stat-card"
          :to="{ name: 'Alumnos' }"
          hover
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-white-70">Alumnos</div>
                <div class="text-h3 font-weight-bold text-white">{{ stats.alumnos }}</div>
              </div>
              <v-avatar size="48" color="white" variant="tonal">
                <v-icon size="24" color="white">mdi-account-group</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="6" md="3">
        <v-card
          color="warning"
          variant="flat"
          class="stat-card"
          :to="{ name: 'Clases' }"
          hover
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-white-70">Clases</div>
                <div class="text-h3 font-weight-bold text-white">{{ stats.clases }}</div>
              </div>
              <v-avatar size="48" color="white" variant="tonal">
                <v-icon size="24" color="white">mdi-soccer</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="6" md="3">
        <v-card
          color="accent"
          variant="flat"
          class="stat-card"
          :to="{ name: 'Eventos' }"
          hover
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-white-70">Eventos</div>
                <div class="text-h3 font-weight-bold text-white">{{ stats.eventos }}</div>
              </div>
              <v-avatar size="48" color="white" variant="tonal">
                <v-icon size="24" color="white">mdi-calendar-star</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Accesos rápidos -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h6 font-weight-bold mb-3">
          <v-icon color="primary" class="mr-2">mdi-lightning-bolt</v-icon>
          Accesos Rápidos
        </h2>
      </v-col>

      <v-col cols="6" sm="6" md="3" v-for="accion in accionesRapidas" :key="accion.to">
        <v-card
          :to="{ name: accion.to }"
          hover
          class="quick-action-card"
        >
          <v-card-text class="text-center pa-4">
            <v-avatar :color="accion.color" size="56" class="mb-2">
              <v-icon size="28" color="white">{{ accion.icon }}</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-medium">{{ accion.title }}</div>
            <div class="text-caption text-medium-emphasis">{{ accion.subtitle }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Próximos eventos -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center py-3">
            <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
            Próximos Eventos
            <v-spacer />
            <v-btn
              variant="text"
              color="primary"
              :to="{ name: 'Eventos' }"
              size="small"
            >
              Ver todos
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-0">
            <v-list v-if="proximosEventos.length">
              <v-list-item
                v-for="evento in proximosEventos"
                :key="evento.id"
                class="py-2"
              >
                <template #prepend>
                  <v-avatar :color="getEventoColor(evento.tipo)" size="44">
                    <v-icon color="white">{{ getEventoIcon(evento.tipo) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ evento.nombre }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                  {{ evento.fecha }}
                  <v-icon size="12" class="ml-2 mr-1">mdi-map-marker</v-icon>
                  {{ evento.ubicacion }}
                </v-list-item-subtitle>

                <template #append>
                  <v-chip :color="getEventoColor(evento.tipo)" size="small" variant="tonal">
                    {{ evento.tipo }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <v-alert v-else type="info" variant="tonal" class="ma-3">
              No hay eventos próximos programados
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const stats = ref({
  profesores: 0,
  alumnos: 0,
  clases: 0,
  eventos: 0,
})

const proximosEventos = ref([])

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const accionesRapidas = [
  {
    to: 'CrearProfesor',
    title: 'Nuevo Profesor',
    subtitle: 'Registra un profesor',
    icon: 'mdi-account-plus',
    color: 'primary',
  },
  {
    to: 'CrearAlumno',
    title: 'Nuevo Alumno',
    subtitle: 'Inscribe un alumno',
    icon: 'mdi-account-plus-outline',
    color: 'success',
  },
  {
    to: 'CrearClase',
    title: 'Nueva Clase',
    subtitle: 'Crea un tipo de clase',
    icon: 'mdi-plus-circle',
    color: 'warning',
  },
  {
    to: 'CrearEvento',
    title: 'Nuevo Evento',
    subtitle: 'Programa un evento',
    icon: 'mdi-calendar-plus',
    color: 'accent',
  },
]

onMounted(async () => {
  // Datos de ejemplo
  stats.value = {
    profesores: 12,
    alumnos: 85,
    clases: 8,
    eventos: 3,
  }

  proximosEventos.value = [
    { id: 1, nombre: 'Torneo Interclases', fecha: '15 Abr 2026', ubicacion: 'Cancha Principal', tipo: 'Torneo' },
    { id: 2, nombre: 'Partido Amistoso', fecha: '18 Abr 2026', ubicacion: 'Estadio Municipal', tipo: 'Partido' },
    { id: 3, nombre: 'Exhibición de Gimnasia', fecha: '22 Abr 2026', ubicacion: 'Coliseo', tipo: 'Exhibición' },
  ]
})

function getEventoColor(tipo) {
  const colors = {
    Torneo: 'error',
    Partido: 'primary',
    Exhibición: 'success',
    Clínica: 'warning',
  }
  return colors[tipo] || 'default'
}

function getEventoIcon(tipo) {
  const icons = {
    Torneo: 'mdi-trophy',
    Partido: 'mdi-soccer',
    Exhibición: 'mdi-star',
    Clínica: 'mdi-school',
  }
  return icons[tipo] || 'mdi-calendar'
}
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 12px !important;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7) !important;
}

.quick-action-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.quick-action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

.quick-action-card:hover .v-avatar {
  transform: scale(1.1);
}

.quick-action-card .v-avatar {
  transition: transform 0.3s ease;
}
</style>