<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="10" xl="8">
        <v-card>
          <v-card-title class="text-h5">
            {{ isEditing ? 'Editar Profesor' : 'Nuevo Profesor' }}
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="save">
              <!-- Información Personal -->
              <v-card variant="outlined" class="mb-6">
                <v-card-title class="text-subtitle-1">
                  <v-icon class="mr-2">mdi-account</v-icon>
                  Información Personal
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="profesor.nombre"
                        label="Nombre"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="profesor.apellido"
                        label="Apellido"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="profesor.tipoDocumento"
                        :items="tiposDocumento"
                        label="Tipo de Documento"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profesor.documentoIdentidad"
                        label="Número de Documento"
                        :rules="[rules.required]"
                        variant="outlined"
                        :readonly="isEditing"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profesor.telefono"
                        label="Teléfono"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Información de Contacto -->
              <v-card variant="outlined" class="mb-6">
                <v-card-title class="text-subtitle-1">
                  <v-icon class="mr-2">mdi-email</v-icon>
                  Contacto
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profesor.email"
                        label="Email"
                        type="email"
                        :rules="[rules.required, rules.email]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profesor.especialidad"
                        label="Especialidad"
                        :rules="[rules.required]"
                        variant="outlined"
                        placeholder="Ej: Entrenador de fútbol, Instructor de natación"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Clases que Imparte -->
              <v-card variant="outlined" class="mb-6">
                <v-card-title class="text-subtitle-1">
                  <v-icon class="mr-2">mdi-soccer</v-icon>
                  Clases que Imparte
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="profesor.clasesIds"
                        :items="clases"
                        item-title="nombre"
                        item-value="id"
                        label="Seleccionar clases"
                        variant="outlined"
                        multiple
                        chips
                        closable-chips
                        :rules="[rules.minLength]"
                        hint="Seleccione una o más clases que el profesor puede impartir"
                        persistent-hint
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Estado -->
              <v-card variant="outlined" class="mb-6">
                <v-card-title class="text-subtitle-1">
                  <v-icon class="mr-2">mdi-toggle-circle</v-icon>
                  Estado
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="profesor.estado"
                        :items="estados"
                        label="Estado"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-divider class="my-4" />

              <v-card-actions class="pa-0">
                <v-spacer />
                <v-btn
                  variant="text"
                  :to="{ name: 'Profesores' }"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="!valid"
                >
                  {{ isEditing ? 'Guardar Cambios' : 'Crear Profesor' }}
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
import profesorService from '@/services/profesor.service'
import claseService from '@/services/clase.service'

const router = useRouter()
const route = useRoute()

const form = ref(null)
const valid = ref(false)
const loading = ref(false)
const clases = ref([])

const tiposDocumento = ['CC', 'CE', 'TI', 'PP', 'NIT']
const estados = ['ACTIVO', 'INACTIVO']

const profesor = ref({
  nombre: '',
  apellido: '',
  tipoDocumento: 'CC',
  documentoIdentidad: '',
  email: '',
  telefono: '',
  especialidad: '',
  clasesIds: [],
  estado: 'ACTIVO',
})

const rules = {
  required: v => !!v || 'Este campo es requerido',
  email: v => /.+@.+\..+/.test(v) || 'Email inválido',
  minLength: v => (v && v.length > 0) || 'Seleccione al menos una clase',
}

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
  await loadClases()
  if (isEditing.value) {
    await loadProfesor()
  }
})

async function loadClases() {
  try {
    const response = await claseService.getAll()
    clases.value = response.data.filter(c => c.estado === 'ACTIVO')
  } catch (error) {
    console.error('Error al cargar clases:', error)
  }
}

async function loadProfesor() {
  loading.value = true
  try {
    const response = await profesorService.getById(route.params.id)
    const data = response.data
    profesor.value = {
      ...data,
      clasesIds: data.clases?.map(c => c.id) || [],
    }
  } catch (error) {
    showSnackbar('Error al cargar el profesor: ' + error.message, 'error')
    router.push({ name: 'Profesores' })
  } finally {
    loading.value = false
  }
}

async function save() {
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  loading.value = true
  try {
    const data = {
      ...profesor.value,
      clases: profesor.value.clasesIds.map(id => ({ id })),
    }
    delete data.clasesIds

    if (isEditing.value) {
      await profesorService.update(route.params.id, data)
      showSnackbar('Profesor actualizado correctamente', 'success')
    } else {
      await profesorService.create(data)
      showSnackbar('Profesor creado correctamente', 'success')
    }
    router.push({ name: 'Profesores' })
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