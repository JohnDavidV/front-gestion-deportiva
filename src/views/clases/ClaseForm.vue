<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="8" xl="6">
        <v-card>
          <v-card-title class="text-h5">
            {{ isEditing ? 'Editar Clase' : 'Nueva Clase' }}
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="save">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="clase.nombre"
                    label="Nombre"
                    :rules="[rules.required]"
                    variant="outlined"
                    placeholder="Ej: Fútbol, Natación, Baloncesto"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="clase.estado"
                    :items="estados"
                    label="Estado"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="clase.descripcion"
                    label="Descripción"
                    variant="outlined"
                    rows="3"
                    placeholder="Descripción breve de la clase"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="clase.duracionMinutos"
                    label="Duración (minutos)"
                    type="number"
                    :rules="[rules.required, rules.positive]"
                    variant="outlined"
                    min="1"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="clase.capacidadMaxima"
                    label="Capacidad Máxima"
                    type="number"
                    :rules="[rules.required, rules.positive]"
                    variant="outlined"
                    min="1"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <v-card-actions class="pa-0">
                <v-spacer />
                <v-btn
                  variant="text"
                  :to="{ name: 'Clases' }"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="!valid"
                >
                  {{ isEditing ? 'Guardar Cambios' : 'Crear Clase' }}
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
import claseService from '@/services/clase.service'

const router = useRouter()
const route = useRoute()

const form = ref(null)
const valid = ref(false)
const loading = ref(false)

const estados = ['ACTIVO', 'INACTIVO']

const clase = ref({
  nombre: '',
  descripcion: '',
  duracionMinutos: 60,
  capacidadMaxima: 20,
  estado: 'ACTIVO',
})

const rules = {
  required: v => !!v || 'Este campo es requerido',
  positive: v => v > 0 || 'El valor debe ser mayor a 0',
}

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
  if (isEditing.value) {
    await loadClase()
  }
})

async function loadClase() {
  loading.value = true
  try {
    const response = await claseService.getById(route.params.id)
    clase.value = response.data
  } catch (error) {
    showSnackbar('Error al cargar la clase: ' + error.message, 'error')
    router.push({ name: 'Clases' })
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
      await claseService.update(route.params.id, clase.value)
      showSnackbar('Clase actualizada correctamente', 'success')
    } else {
      await claseService.create(clase.value)
      showSnackbar('Clase creada correctamente', 'success')
    }
    router.push({ name: 'Clases' })
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