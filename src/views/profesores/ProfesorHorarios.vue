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
                :to="{ name: 'Profesores' }"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <span class="text-h5">Horarios de {{ profesor.nombre }} {{ profesor.apellido }}</span>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openDialog()"
            >
              Agregar Horario
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Filtros -->
            <v-row class="mb-4">
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
            <v-card variant="outlined" class="mb-6">
              <v-card-title class="text-subtitle-1 bg-surface">
                <v-icon class="mr-2">mdi-calendar-week</v-icon>
                Vista Semanal
              </v-card-title>
              <v-card-text class="pa-0">
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 100px">Hora</th>
                      <th v-for="dia in dias" :key="dia.value" class="text-center">
                        {{ dia.title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="hora in horas" :key="hora">
                      <td class="text-center font-weight-medium">{{ hora }}</td>
                      <td
                        v-for="dia in dias"
                        :key="dia.value"
                        class="text-center"
                        style="min-width: 120px"
                      >
                        <template v-for="h in getHorariosByDiaYHora(dia.value, hora)" :key="h.id">
                          <v-chip
                            :color="getClaseColor(h.claseId)"
                            size="small"
                            class="ma-1"
                            @click="editHorario(h)"
                          >
                            {{ h.claseNombre }}
                            <v-tooltip activator="parent" location="top">
                              {{ h.claseNombre }} - {{ h.ubicacion || 'Sin ubicación' }}
                            </v-tooltip>
                          </v-chip>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>

            <!-- Lista de horarios -->
            <v-card variant="outlined">
              <v-card-title class="text-subtitle-1 bg-surface">
                <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                Lista de Horarios
              </v-card-title>
              <v-card-text class="pa-0">
                <v-list v-if="filteredHorarios.length">
                  <v-list-item
                    v-for="horario in filteredHorarios"
                    :key="horario.id"
                    class="py-3"
                  >
                    <template #prepend>
                      <v-avatar :color="getClaseColor(horario.claseId)" size="40">
                        <v-icon color="white">mdi-clock-outline</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-medium">
                      {{ horario.claseNombre }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ horario.diaSemana }} | {{ horario.horaInicio }} - {{ horario.horaFin }}
                      <span v-if="horario.ubicacion">| {{ horario.ubicacion }}</span>
                    </v-list-item-subtitle>

                    <template #append>
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        @click="editHorario(horario)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        color="error"
                        @click="confirmDelete(horario)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
                <v-alert v-else type="info" variant="tonal" class="ma-4">
                  No hay horarios configurados
                </v-alert>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para agregar/editar horario -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          {{ editingHorario ? 'Editar Horario' : 'Nuevo Horario' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formDialog" v-model="validDialog">
            <v-select
              v-model="horario.claseId"
              :items="clases"
              item-title="nombre"
              item-value="id"
              label="Clase"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-select
              v-model="horario.diaSemana"
              :items="dias"
              label="Día de la semana"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="horario.horaInicio"
                  label="Hora inicio"
                  type="time"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="horario.horaFin"
                  label="Hora fin"
                  type="time"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="horario.ubicacion"
              label="Ubicación (opcional)"
              variant="outlined"
              placeholder="Ej: Cancha 1, Sala A"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            :disabled="!validDialog"
            @click="saveHorario"
          >
            {{ editingHorario ? 'Guardar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de que desea eliminar este horario?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteHorario">Eliminar</v-btn>
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
import profesorService from '@/services/profesor.service'
import claseService from '@/services/clase.service'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const formDialog = ref(null)
const validDialog = ref(false)

const profesor = ref({ nombre: '', apellido: '' })
const horarios = ref([])
const clases = ref([])
const filterClase = ref(null)
const filterDia = ref(null)
const horarioToDelete = ref(null)
const editingHorario = ref(null)

const horario = ref({
  claseId: null,
  diaSemana: null,
  horaInicio: '',
  horaFin: '',
  ubicacion: '',
})

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

const rules = {
  required: v => !!v || 'Este campo es requerido',
}

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const claseColors = ['primary', 'success', 'warning', 'error', 'accent', 'secondary']

const filteredHorarios = computed(() => {
  let result = horarios.value

  if (filterClase.value) {
    result = result.filter(h => h.claseId === filterClase.value)
  }

  if (filterDia.value) {
    result = result.filter(h => h.diaSemana === filterDia.value)
  }

  return result
})

onMounted(async () => {
  await Promise.all([loadProfesor(), loadClases(), loadHorarios()])
})

async function loadProfesor() {
  try {
    const response = await profesorService.getById(route.params.id)
    profesor.value = response.data
  } catch (error) {
    showSnackbar('Error al cargar profesor: ' + error.message, 'error')
    router.push({ name: 'Profesores' })
  }
}

async function loadClases() {
  try {
    const response = await claseService.getAll()
    clases.value = response.data.filter(c => c.estado === 'ACTIVO')
  } catch (error) {
    console.error('Error al cargar clases:', error)
  }
}

async function loadHorarios() {
  loading.value = true
  try {
    const response = await profesorService.getHorarios(route.params.id)
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
    const inicio = h.horaInicio.split(':')[0]
    const fin = h.horaFin.split(':')[0]
    const horaNum = parseInt(hora.split(':')[0])
    return horaNum >= parseInt(inicio) && horaNum < parseInt(fin)
  })
}

function openDialog() {
  editingHorario.value = null
  horario.value = {
    claseId: null,
    diaSemana: null,
    horaInicio: '',
    horaFin: '',
    ubicacion: '',
  }
  dialog.value = true
}

function editHorario(h) {
  editingHorario.value = h
  horario.value = { ...h }
  dialog.value = true
}

async function saveHorario() {
  const { valid } = await formDialog.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editingHorario.value) {
      // Actualizar horario existente
      const index = horarios.value.findIndex(h => h.id === editingHorario.value.id)
      if (index !== -1) {
        horarios.value[index] = { ...horario.value, id: editingHorario.value.id }
      }
      showSnackbar('Horario actualizado correctamente', 'success')
    } else {
      // Crear nuevo horario
      const newHorario = {
        ...horario.value,
        id: Date.now(), // ID temporal
        claseNombre: clases.value.find(c => c.id === horario.value.claseId)?.nombre,
      }
      horarios.value.push(newHorario)
      showSnackbar('Horario creado correctamente', 'success')
    }
    dialog.value = false
    // TODO: Llamar a la API para guardar
  } catch (error) {
    showSnackbar('Error al guardar: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(h) {
  horarioToDelete.value = h
  deleteDialog.value = true
}

async function deleteHorario() {
  try {
    horarios.value = horarios.value.filter(h => h.id !== horarioToDelete.value.id)
    showSnackbar('Horario eliminado correctamente', 'success')
    // TODO: Llamar a la API para eliminar
  } catch (error) {
    showSnackbar('Error al eliminar: ' + error.message, 'error')
  } finally {
    deleteDialog.value = false
    horarioToDelete.value = null
  }
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}
</script>