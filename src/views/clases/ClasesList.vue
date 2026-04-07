<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-4">
            <span class="text-h5">Tipos de Clase</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              :to="{ name: 'CrearClase' }"
            >
              Nueva Clase
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Filtros y búsqueda -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="search"
                  label="Buscar clase"
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
            </v-row>

            <!-- Tabla -->
            <v-data-table
              :headers="headers"
              :items="filteredClases"
              :loading="loading"
              class="elevation-0"
              hover
            >
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
                  :to="{ name: 'EditarClase', params: { id: item.id } }"
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
                  No hay clases registradas
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
          ¿Está seguro de que desea eliminar la clase <strong>{{ claseToDelete?.nombre }}</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteClase">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
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
import claseService from '@/services/clase.service'

const search = ref('')
const filterEstado = ref(null)
const loading = ref(false)
const clases = ref([])
const deleteDialog = ref(false)
const claseToDelete = ref(null)

const estados = ['ACTIVO', 'INACTIVO']

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Descripción', key: 'descripcion', sortable: false },
  { title: 'Duración (min)', key: 'duracionMinutos', sortable: true },
  { title: 'Capacidad', key: 'capacidadMaxima', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const filteredClases = computed(() => {
  let result = clases.value

  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(c =>
      c.nombre?.toLowerCase().includes(term) ||
      c.descripcion?.toLowerCase().includes(term)
    )
  }

  if (filterEstado.value) {
    result = result.filter(c => c.estado === filterEstado.value)
  }

  return result
})

onMounted(async () => {
  await loadClases()
})

async function loadClases() {
  loading.value = true
  try {
    const response = await claseService.getAll()
    clases.value = response.data
  } catch (error) {
    showSnackbar('Error al cargar clases: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

function confirmDelete(item) {
  claseToDelete.value = item
  deleteDialog.value = true
}

async function deleteClase() {
  try {
    await claseService.delete(claseToDelete.value.id)
    clases.value = clases.value.filter(c => c.id !== claseToDelete.value.id)
    showSnackbar('Clase eliminada correctamente', 'success')
  } catch (error) {
    showSnackbar('Error al eliminar: ' + error.message, 'error')
  } finally {
    deleteDialog.value = false
    claseToDelete.value = null
  }
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}
</script>