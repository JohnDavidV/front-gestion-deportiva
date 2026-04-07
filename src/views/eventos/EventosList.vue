<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-4">
            <span class="text-h5">Eventos</span>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              :to="{ name: 'CrearEvento' }"
            >
              Nuevo Evento
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Filtros y búsqueda -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  label="Buscar evento"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterTipo"
                  :items="tipos"
                  label="Tipo"
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
              :items="filteredEventos"
              :loading="loading"
              class="elevation-0"
              hover
            >
              <template #item.fecha="{ item }">
                <div>
                  <div class="font-weight-medium">{{ formatDate(item.fecha) }}</div>
                  <div class="text-caption text-medium-emphasis">{{ item.hora }}</div>
                </div>
              </template>

              <template #item.tipo="{ item }">
                <v-chip :color="getTipoColor(item.tipo)" size="small">
                  {{ item.tipo }}
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
                  :to="{ name: 'EventoInscripcion', params: { id: item.id } }"
                >
                  <v-icon>mdi-account-group</v-icon>
                  <v-tooltip activator="parent">Inscribir grupos</v-tooltip>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  :to="{ name: 'EditarEvento', params: { id: item.id } }"
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
                  No hay eventos registrados
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
          ¿Está seguro de que desea eliminar el evento <strong>{{ eventoToDelete?.nombre }}</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteEvento">Eliminar</v-btn>
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
import eventoService from '@/services/evento.service'

const search = ref('')
const filterTipo = ref(null)
const filterEstado = ref(null)
const loading = ref(false)
const eventos = ref([])
const deleteDialog = ref(false)
const eventoToDelete = ref(null)

const tipos = ['Partido', 'Torneo', 'Exhibición', 'Clínica', 'Otro']
const estados = ['ACTIVO', 'INACTIVO', 'FINALIZADO', 'CANCELADO']

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Fecha y Hora', key: 'fecha', sortable: true },
  { title: 'Ubicación', key: 'ubicacion', sortable: false },
  { title: 'Tipo', key: 'tipo', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' },
]

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const filteredEventos = computed(() => {
  let result = eventos.value

  if (search.value) {
    const term = search.value.toLowerCase()
    result = result.filter(e =>
      e.nombre?.toLowerCase().includes(term) ||
      e.descripcion?.toLowerCase().includes(term) ||
      e.ubicacion?.toLowerCase().includes(term)
    )
  }

  if (filterTipo.value) {
    result = result.filter(e => e.tipo === filterTipo.value)
  }

  if (filterEstado.value) {
    result = result.filter(e => e.estado === filterEstado.value)
  }

  return result
})

onMounted(async () => {
  await loadEventos()
})

async function loadEventos() {
  loading.value = true
  try {
    const response = await eventoService.getAll()
    eventos.value = response.data
  } catch (error) {
    showSnackbar('Error al cargar eventos: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

function getTipoColor(tipo) {
  const colors = {
    Partido: 'primary',
    Torneo: 'error',
    Exhibición: 'success',
    Clínica: 'warning',
    Otro: 'default',
  }
  return colors[tipo] || 'default'
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function confirmDelete(item) {
  eventoToDelete.value = item
  deleteDialog.value = true
}

async function deleteEvento() {
  try {
    await eventoService.delete(eventoToDelete.value.id)
    eventos.value = eventos.value.filter(e => e.id !== eventoToDelete.value.id)
    showSnackbar('Evento eliminado correctamente', 'success')
  } catch (error) {
    showSnackbar('Error al eliminar: ' + error.message, 'error')
  } finally {
    deleteDialog.value = false
    eventoToDelete.value = null
  }
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}
</script>