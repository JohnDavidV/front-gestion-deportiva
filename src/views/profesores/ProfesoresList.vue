<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-4">
            <span class="text-h5">Profesores</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              :to="{ name: 'CrearProfesor' }"
            >
              Nuevo Profesor
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Filtros y búsqueda -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  label="Buscar profesor"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterEstado"
                  :items="estados"
                  label="Estado"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterClase"
                  :items="clases"
                  item-title="nombre"
                  item-value="id"
                  label="Clase"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                />
              </v-col>
            </v-row>

            <!-- Tabla -->
            <v-data-table
              :headers="headers"
              :items="filteredProfesores"
              :loading="loading"
              class="elevation-0"
              hover
            >
              <template #item.nombreCompleto="{ item }">
                <div class="d-flex align-center py-2">
                  <v-avatar color="primary" size="40" class="mr-3">
                    <span class="text-white text-subtitle-1">
                      {{ getInitials(item.nombre, item.apellido) }}
                    </span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ item.nombre }} {{ item.apellido }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
                  </div>
                </div>
              </template>

              <template #item.clases="{ item }">
                <div class="d-flex flex-wrap ga-1">
                  <v-chip
                    v-for="clase in (item.clases || []).slice(0, 3)"
                    :key="clase.id"
                    size="small"
                    color="primary"
                    variant="tonal"
                  >
                    {{ clase.nombre }}
                  </v-chip>
                  <v-chip
                    v-if="(item.clases || []).length > 3"
                    size="small"
                    color="default"
                    variant="tonal"
                  >
                    +{{ item.clases.length - 3 }} más
                  </v-chip>
                </div>
              </template>

              <template #item.estado="{ item }">
                <v-chip
                  :color="item.estado === 'ACTIVO' ? 'success' : 'error'"
                  size="small"
                >
                  {{ item.estado }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  :to="{ name: 'ProfesorHorarios', params: { id: item.id } }"
                >
                  <v-icon>mdi-calendar-clock</v-icon>
                  <v-tooltip activator="parent">Horarios</v-tooltip>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  :to="{ name: 'EditarProfesor', params: { id: item.id } }"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent">Editar</v-tooltip>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  color="error"
                  @click="confirmDelete(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent">Eliminar</v-tooltip>
                </v-btn>
              </template>

              <template #no-data>
                <v-alert type="info" variant="tonal" class="ma-4">
                  No hay profesores registrados
                </v-alert>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de que desea eliminar al profesor <strong>{{ profesorToDelete?.nombre }} {{ profesorToDelete?.apellido }}</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteProfesor">Eliminar</v-btn>
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
import profesorService from '@/services/profesor.service'
import claseService from '@/services/clase.service'

const search = ref('')
const filterEstado = ref(null)
const filterClase = ref(null)
const loading = ref(false)
const profesores = ref([])
const clases = ref([])
const deleteDialog = ref(false)
const profesorToDelete = ref(null)

const estados = ['ACTIVO', 'INACTIVO']

const headers = [
  { title: 'Profesor', key: 'nombreCompleto', sortable: true },
  { title: 'Documento', key: 'documentoIdentidad', sortable: true },
  { title: 'Teléfono', key: 'telefono', sortable: false },
  { title: 'Especialidad', key: 'especialidad', sortable: true },
  { title: 'Clases', key: 'clases', sortable: false },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const filteredProfesores = computed(() => {
  let result = profesores.value

  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(p =>
      p.nombre?.toLowerCase().includes(term) ||
      p.apellido?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.documentoIdentidad?.includes(term)
    )
  }

  if (filterEstado.value) {
    result = result.filter(p => p.estado === filterEstado.value)
  }

  if (filterClase.value) {
    result = result.filter(p =>
      p.clases?.some(c => c.id === filterClase.value)
    )
  }

  return result
})

onMounted(async () => {
  await Promise.all([loadProfesores(), loadClases()])
})

async function loadProfesores() {
  loading.value = true
  try {
    const response = await profesorService.getAll()
    profesores.value = response.data
  } catch (error) {
    showSnackbar('Error al cargar profesores: ' + error.message, 'error')
  } finally {
    loading.value = false
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

function getInitials(nombre, apellido) {
  const n = nombre?.charAt(0) || ''
  const a = apellido?.charAt(0) || ''
  return (n + a).toUpperCase()
}

function confirmDelete(item) {
  profesorToDelete.value = item
  deleteDialog.value = true
}

async function deleteProfesor() {
  try {
    await profesorService.delete(profesorToDelete.value.id)
    profesores.value = profesores.value.filter(p => p.id !== profesorToDelete.value.id)
    showSnackbar('Profesor eliminado correctamente', 'success')
  } catch (error) {
    showSnackbar('Error al eliminar: ' + error.message, 'error')
  } finally {
    deleteDialog.value = false
    profesorToDelete.value = null
  }
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}
</script>