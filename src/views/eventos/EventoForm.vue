<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="8" xl="6">
        <v-card>
          <v-card-title class="text-h5">
            {{ isEditing ? 'Editar Evento' : 'Nuevo Evento' }}
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="save">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="evento.nombre"
                    label="Nombre del Evento"
                    :rules="[rules.required]"
                    variant="outlined"
                    placeholder="Ej: Torneo Interclases 2026"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="evento.descripcion"
                    label="Descripción"
                    variant="outlined"
                    rows="3"
                    placeholder="Descripción del evento"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="evento.fecha"
                    label="Fecha"
                    type="date"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="evento.hora"
                    label="Hora"
                    type="time"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="evento.ubicacion"
                    label="Ubicación"
                    :rules="[rules.required]"
                    variant="outlined"
                    placeholder="Ej: Cancha Principal, Coliseo"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="evento.tipo"
                    :items="tipos"
                    label="Tipo de Evento"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="evento.estado"
                    :items="estados"
                    label="Estado"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <v-card-actions class="pa-0">
                <v-spacer />
                <v-btn
                  variant="text"
                  :to="{ name: 'Eventos' }"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="!valid"
                >
                  {{ isEditing ? 'Guardar Cambios' : 'Crear Evento' }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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

const router = useRouter()
const route = useRoute()

const form = ref(null)
const valid = ref(false)
const loading = ref(false)

const tipos = ['Partido', 'Torneo', 'Exhibición', 'Clínica', 'Otro']
const estados = ['ACTIVO', 'INACTIVO', 'FINALIZADO', 'CANCELADO']

const evento = ref({
  nombre: '',
  descripcion: '',
  fecha: '',
  hora: '',
  ubicacion: '',
  tipo: 'Partido',
  estado: 'ACTIVO',
})

const rules = {
  required: v => !!v || 'Este campo es requerido',
}

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
  if (isEditing.value) {
    await loadEvento()
  }
})

async function loadEvento() {
  loading.value = true
  try {
    const response = await eventoService.getById(route.params.id)
    evento.value = response.data
  } catch (error) {
    showSnackbar('Error al cargar el evento: ' + error.message, 'error')
    router.push({ name: 'Eventos' })
  } finally {
    loading.value = false
  }
}

async function save() {
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  loading.value = true
  try {
    if (isEditing.value) {
      await eventoService.update(route.params.id, evento.value)
      showSnackbar('Evento actualizado correctamente', 'success')
    } else {
      await eventoService.create(evento.value)
      showSnackbar('Evento creado correctamente', 'success')
    }
    router.push({ name: 'Eventos' })
  } catch (error) {
    showSnackbar('Error al guardar: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}
</script>