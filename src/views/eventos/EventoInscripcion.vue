<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div class="d-flex align-center">
              <v-btn
                icon
                variant="text"
                class="mr-2"
                :to="{ name: 'Eventos' }"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <span class="text-h5">Inscripción: {{ evento.nombre }}</span>
            </div>
            <v-chip :color="getTipoColor(evento.tipo)" size="small">
              {{ evento.tipo }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <!-- Info del evento -->
            <v-card variant="outlined" class="mb-6">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="3">
                    <div class="text-caption text-medium-emphasis">Fecha</div>
                    <div class="text-body-1 font-weight-medium">{{ formatDate(evento.fecha) }}</div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="text-caption text-medium-emphasis">Hora</div>
                    <div class="text-body-1 font-weight-medium">{{ evento.hora }}</div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="text-caption text-medium-emphasis">Ubicación</div>
                    <div class="text-body-1 font-weight-medium">{{ evento.ubicacion }}</div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="text-caption text-medium-emphasis">Estado</div>
                    <v-chip
                      :color="evento.estado === 'ACTIVO' ? 'success' : 'default'"
                      size="small"
                    >
                      {{ evento.estado }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Formulario de inscripción -->
            <v-card variant="outlined" class="mb-6">
              <v-card-title class="text-subtitle-1 bg-surface">
                <v-icon class="mr-2">mdi-account-group</v-icon>
                Inscribir Grupo
              </v-card-title>
              <v-card-text>
                <v-row align="end">
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="inscripcion.profesorId"
                      :items="profesores"
                      item-title="nombreCompleto"
                      item-value="id"
                      label="Profesor"
                      variant="outlined"
                      @update:model-value="loadHorariosProfesor"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="inscripcion.horarioId"
                      :items="horariosProfesor"
                      item-title="descripcion"
                      item-value="id"
                      label="Horario / Grupo"
                      variant="outlined"
                      :disabled="!inscripcion.profesorId"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-btn
                      color="primary"
                      :disabled="!inscripcion.profesorId || !inscripcion.horarioId"
                      :loading="inscribiendo"
                      @click="inscribirGrupo"
                    >
                      <v-icon class="mr-2">mdi-plus</v-icon>
                      Inscribir Grupo
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Grupos inscritos -->
            <v-card variant="outlined">
              <v-card-title class="text-subtitle-1 bg-surface">
                <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                Grupos Inscritos ({{ inscripciones.length }})
              </v-card-title>
              <v-card-text class="pa-0">
                <v-list v-if="inscripciones.length">
                  <v-list-item
                    v-for="inscripcion in inscripciones"
                    :key="inscripcion.id"
                    class="py-3"
                  >
                    <template #prepend>
                      <v-avatar color="primary" size="40">
                        <v-icon color="white">mdi-account-group</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-medium">
                      {{ inscripcion.profesorNombre }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ inscripcion.claseNombre }} | {{ inscripcion.diaSemana }} | {{ inscripcion.horaInicio }} - {{ inscripcion.horaFin }}
                    </v-list-item-subtitle>

                    <template #append>
                      <v-chip size="small" class="mr-2">
                        {{ inscripcion.alumnosCount || 0 }} alumnos
                      </v-chip>
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        color="error"
                        @click="confirmRemove(inscripcion)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
                <v-alert v-else type="info" variant="tonal" class="ma-4">
                  No hay grupos inscritos en este evento
                </v-alert>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="removeDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de que desea retirar este grupo del evento?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="removeDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="removeInscripcion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import eventoService from '@/services/evento.service'
import profesorService from '@/services/profesor.service'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const inscribiendo = ref(false)
const removeDialog = ref(false)
const inscripcionToRemove = ref(null)

const evento = ref({
  nombre: '',
  fecha: '',
  hora: '',
  ubicacion: '',
  tipo: '',
  estado: '',
})

const profesores = ref([])
const horariosProfesor = ref([])
const inscripciones = ref([])

const inscripcion = ref({
  profesorId: null,
  horarioId: null,
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const tipoColors = {
  Partido: 'primary',
  Torneo: 'error',
  Exhibición: 'success',
  Clínica: 'warning',
  Otro: 'default',
}

onMounted(async () => {
  await Promise.all([loadEvento(), loadProfesores(), loadInscripciones()])
})

async function loadEvento() {
  try {
    const response = await eventoService.getById(route.params.id)
    evento.value = response.data
  } catch (error) {
    showSnackbar('Error al cargar el evento: ' + error.message, 'error')
    router.push({ name: 'Eventos' })
  }
}

async function loadProfesores() {
  try {
    const response = await profesorService.getAll()
    profesores.value = response.data
      .filter(p => p.estado === 'ACTIVO')
      .map(p => ({
        ...p,
        nombreCompleto: `${p.nombre} ${p.apellido}`,
      }))
  } catch (error) {
    console.error('Error al cargar profesores:', error)
  }
}

async function loadInscripciones() {
  loading.value = true
  try {
    const response = await eventoService.getInscripciones(route.params.id)
    inscripciones.value = response.data || []
  } catch (error) {
    console.error('Error al cargar inscripciones:', error)
    inscripciones.value = []
  } finally {
    loading.value = false
  }
}

async function loadHorariosProfesor() {
  if (!inscripcion.value.profesorId) {
    horariosProfesor.value = []
    return
  }

  try {
    const response = await profesorService.getHorarios(inscripcion.value.profesorId)
    horariosProfesor.value = (response.data || []).map(h => ({
      ...h,
      descripcion: `${h.claseNombre} - ${h.diaSemana} (${h.horaInicio}-${h.horaFin})`,
    }))
  } catch (error) {
    console.error('Error al cargar horarios:', error)
    horariosProfesor.value = []
  }
}

async function inscribirGrupo() {
  if (!inscripcion.value.profesorId || !inscripcion.value.horarioId) return

  inscribiendo.value = true
  try {
    await eventoService.inscribirGrupo(route.params.id, {
      profesorId: inscripcion.value.profesorId,
      horarioId: inscripcion.value.horarioId,
    })
    showSnackbar('Grupo inscrito correctamente', 'success')
    inscripcion.value = { profesorId: null, horarioId: null }
    horariosProfesor.value = []
    await loadInscripciones()
  } catch (error) {
    showSnackbar('Error al inscribir: ' + error.message, 'error')
  } finally {
    inscribiendo.value = false
  }
}

function confirmRemove(item) {
  inscripcionToRemove.value = item
  removeDialog.value = true
}

async function removeInscripcion() {
  try {
    await eventoService.removeInscripcion(route.params.id, inscripcionToRemove.value.id)
    inscripciones.value = inscripciones.value.filter(i => i.id !== inscripcionToRemove.value.id)
    showSnackbar('Grupo retirado del evento', 'success')
  } catch (error) {
    showSnackbar('Error al retirar: ' + error.message, 'error')
  } finally {
    removeDialog.value = false
    inscripcionToRemove.value = null
  }
}

function getTipoColor(tipo) {
  return tipoColors[tipo] || 'default'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}
</script>