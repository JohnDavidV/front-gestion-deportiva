<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-4">
            <span class="text-h5">Alumnos</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              :to="{ name: 'CrearAlumno' }"
            >
              Nuevo Alumno
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Filtros y búsqueda -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  label="Buscar alumno"
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
                  v-model="filterGenero"
                  :items="generos"
                  label="Género"
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
              :items="filteredAlumnos"
              :loading="loading"
              class="elevation-0"
              hover
            >
              <template #item.nombreCompleto="{ item }">
                <div class="d-flex align-center py-2">
                  <v-avatar :color="getAvatarColor(item.genero)" size="40" class="mr-3">
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

              <template #item.fechaNacimiento="{ item }">
                {{ formatDate(item.fechaNacimiento) }}
              </template>

              <template #item.genero="{ item }">
                <v-chip :color="item.genero === 'M' ? 'primary' : 'accent'" size="small">
                  {{ item.genero === 'M' ? 'Masculino' : 'Femenino' }}
                </v-chip>
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
                  :to="{ name: 'EditarAlumno', params: { id: item.id } }"
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
                  No hay alumnos registrados
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
          ¿Está seguro de que desea eliminar al alumno <strong>{{ alumnoToDelete?.nombre }} {{ alumnoToDelete?.apellido }}</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteAlumno">Eliminar</v-btn>
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
import alumnoService from '@/services/alumno.service'

const search = ref('')
const filterEstado = ref(null)
const filterGenero = ref(null)
const loading = ref(false)
const alumnos = ref([])
const deleteDialog = ref(false)
const alumnoToDelete = ref(null)

const estados = ['ACTIVO', 'INACTIVO']
const generos = [
  { value: 'M', title: 'Masculino' },
  { value: 'F', title: 'Femenino' },
]

const headers = [
  { title: 'Alumno', key: 'nombreCompleto', sortable: true },
  { title: 'Documento', key: 'documentoIdentidad', sortable: true },
  { title: 'F. Nacimiento', key: 'fechaNacimiento', sortable: true },
  { title: 'Género', key: 'genero', sortable: true },
  { title: 'Teléfono', key: 'telefono', sortable: false },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const filteredAlumnos = computed(() => {
  let result = alumnos.value

  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(a =>
      a.nombre?.toLowerCase().includes(term) ||
      a.apellido?.toLowerCase().includes(term) ||
      a.email?.toLowerCase().includes(term) ||
      a.documentoIdentidad?.includes(term)
    )
  }

  if (filterEstado.value) {
    result = result.filter(a => a.estado === filterEstado.value)
  }

  if (filterGenero.value) {
    result = result.filter(a => a.genero === filterGenero.value)
  }

  return result
})

onMounted(async () => {
  await loadAlumnos()
})

async function loadAlumnos() {
  loading.value = true
  try {
    const response = await alumnoService.getAll()
    alumnos.value = response.data
  } catch (error) {
    showSnackbar('Error al cargar alumnos: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

function getInitials(nombre, apellido) {
  const n = nombre?.charAt(0) || ''
  const a = apellido?.charAt(0) || ''
  return (n + a).toUpperCase()
}

function getAvatarColor(genero) {
  return genero === 'M' ? 'primary' : 'accent'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES')
}

function confirmDelete(item) {
  alumnoToDelete.value = item
  deleteDialog.value = true
}

async function deleteAlumno() {
  try {
    await alumnoService.delete(alumnoToDelete.value.id)
    alumnos.value = alumnos.value.filter(a => a.id !== alumnoToDelete.value.id)
    showSnackbar('Alumno eliminado correctamente', 'success')
  } catch (error) {
    showSnackbar('Error al eliminar: ' + error.message, 'error')
  } finally {
    deleteDialog.value = false
    alumnoToDelete.value = null
  }
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}
</script>