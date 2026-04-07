<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-4">
            <span class="text-h5">Gestión de Horarios</span>
          </v-card-title>

          <v-card-text>
            <!-- Filtros -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-select
                  v-model="filterProfesor"
                  :items="[{ id: null, nombreCompleto: 'Todos' }, ...profesoresConNombre]"
                  item-title="nombreCompleto"
                  item-value="id"
                  label="Filtrar por profesor"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="filterClase"
                  :items="[{ id: null, nombre: 'Todas' }, ...clases]"
                  item-title="nombre"
                  item-value="id"
                  label="Filtrar por clase"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="filterDia"
                  :items="[{ value: null, title: 'Todos' }, ...dias]"
                  label="Filtrar por día"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>
            </v-row>

            <!-- Vista de calendario semanal -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="text-subtitle-1 bg-surface">
                <v-icon class="mr-2">mdi-calendar-week</v-icon>
                Vista Semanal General
              </v-card-title>
              <v-card-text class="pa-0 overflow-x-auto">
                <v-table density="compact" class="horario-table">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 80px; min-width: 80px">Hora</th>
                      <th v-for="dia in dias" :key="dia.value" class="text-center" style="min-width: 150px">
                        {{ dia.title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="hora in horas" :key="hora">
                      <td class="text-center font-weight-medium bg-surface">{{ hora }}</td>
                      <td
                        v-for="dia in dias"
                        :key="dia.value"
                        class="text-center"
                      >
                        <div class="d-flex flex-column ga-1">
                          <v-chip
                            v-for="h in getHorariosByDiaYHora(dia.value, hora)"
                            :key="h.id"
                            :color="getClaseColor(h.claseId)"
                            size="x-small"
                            class="ma-0"
                            @click="goToProfesor(h.profesorId)"
                            style="cursor: pointer"
                          >
                            <span class="text-truncate" style="max-width: 100px">
                              {{ h.claseNombre }}
                            </span>
                            <v-tooltip activator="parent" location="top">
                              {{ h.profesorNombre }} - {{ h.claseNombre }}<br>
                              {{ h.horaInicio }} - {{ h.horaFin }}<br>
                              {{ h.ubicacion || 'Sin ubicación' }}
                            </v-tooltip>
                          </v-chip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>

            <!-- Resumen -->
            <v-row>
              <v-col cols="12" md="4">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold text-primary">{{ totalHorarios }}</div>
                    <div class="text-medium-emphasis">Horarios totales</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold text-success">{{ profesoresActivos }}</div>
                    <div class="text-medium-emphasis">Profesores activos</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold text-warning">{{ clasesActivas }}</div>
                    <div class="text-medium-emphasis">Clases activas</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import profesorService from '@/services/profesor.service'
import claseService from '@/services/clase.service'
import horarioService from '@/services/horario.service'

const router = useRouter()

const loading = ref(false)
const profesores = ref([])
const clases = ref([])
const horarios = ref([])
const filterProfesor = ref(null)
const filterClase = ref(null)
const filterDia = ref(null)

const dias = [
  { value: 'LUNES', title: 'Lunes' },
  { value: 'MARTES', title: 'Martes' },
  { value: 'MIERCOLES', title: 'Miércoles' },
  { value: 'JUEVES', title: 'Jueves' },
  { value: 'VIERNES', title: 'Viernes' },
  { value: 'SABADO', title: 'Sábado' },
  { value: 'DOMINGO', title: 'Domingo' },
]

const horas = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
]

const claseColors = ['primary', 'success', 'warning', 'error', 'accent', 'secondary', 'info']

const profesoresConNombre = computed(() => {
  return profesores.value.map(p => ({
    ...p,
    nombreCompleto: `${p.nombre} ${p.apellido}`,
  }))
})

const totalHorarios = computed(() => horarios.value.length)

const profesoresActivos = computed(() => {
  return profesores.value.filter(p => p.estado === 'ACTIVO').length
})

const clasesActivas = computed(() => {
  return clases.value.filter(c => c.estado === 'ACTIVO').length
})

onMounted(async () => {
  await Promise.all([loadProfesores(), loadClases(), loadHorarios()])
})

async function loadProfesores() {
  try {
    const response = await profesorService.getAll()
    profesores.value = response.data
  } catch (error) {
    console.error('Error al cargar profesores:', error)
  }
}

async function loadClases() {
  try {
    const response = await claseService.getAll()
    clases.value = response.data
  } catch (error) {
    console.error('Error al cargar clases:', error)
  }
}

async function loadHorarios() {
  loading.value = true
  try {
    const response = await horarioService.getAll()
    horarios.value = response.data || []
  } catch (error) {
    console.error('Error al cargar horarios:', error)
    horarios.value = []
  } finally {
    loading.value = false
  }
}

function getClaseColor(claseId) {
  const index = clases.value.findIndex(c => c.id === claseId)
  return claseColors[index % claseColors.length] || 'primary'
}

function getHorariosByDiaYHora(dia, hora) {
  return horarios.value.filter(h => {
    if (h.diaSemana !== dia) return false
    if (filterProfesor.value && h.profesorId !== filterProfesor.value) return false
    if (filterClase.value && h.claseId !== filterClase.value) return false

    const inicio = parseInt(h.horaInicio.split(':')[0])
    const fin = parseInt(h.horaFin.split(':')[0])
    const horaNum = parseInt(hora.split(':')[0])
    return horaNum >= inicio && horaNum < fin
  })
}

function goToProfesor(profesorId) {
  router.push({ name: 'ProfesorHorarios', params: { id: profesorId } })
}
</script>

<style scoped>
.horario-table {
  min-width: 1000px;
}
.horario-table td {
  padding: 4px 8px !important;
}
</style>