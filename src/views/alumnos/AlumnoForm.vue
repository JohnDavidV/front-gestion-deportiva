<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="10" xl="8">
        <v-card>
          <v-card-title class="text-h5">
            {{ isEditing ? 'Editar Alumno' : 'Nuevo Alumno' }}
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
                        v-model="alumno.nombre"
                        label="Nombre"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="alumno.apellido"
                        label="Apellido"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="alumno.tipoDocumentoNombre"
                        :items="tiposDocumento"
                        label="Tipo de Documento"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="alumno.documentoIdentidad"
                        label="Número de Documento"
                        :rules="[rules.required]"
                        variant="outlined"
                        :readonly="isEditing"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="alumno.fechaNacimiento"
                        label="Fecha de Nacimiento"
                        type="date"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="alumno.genero"
                        :items="generos"
                        label="Género"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="alumno.estatura"
                        label="Estatura (cm)"
                        type="number"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="alumno.peso"
                        label="Peso (kg)"
                        type="number"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="alumno.tipoSangre"
                        label="Tipo de Sangre"
                        variant="outlined"
                        placeholder="Ej: O+, A-, B+"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Contacto -->
              <v-card variant="outlined" class="mb-6">
                <v-card-title class="text-subtitle-1">
                  <v-icon class="mr-2">mdi-phone</v-icon>
                  Contacto
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="alumno.email"
                        label="Email"
                        type="email"
                        :rules="[rules.required, rules.email]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="alumno.telefono"
                        label="Teléfono"
                        :rules="[rules.required]"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="alumno.direccion"
                        label="Dirección"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="departamentoSeleccionado"
                        :items="departamentos"
                        item-title="nombre"
                        item-value="id"
                        label="Departamento"
                        variant="outlined"
                        @update:model-value="cargarMunicipios"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="alumno.municipioId"
                        :items="municipios"
                        item-title="nombre"
                        item-value="id"
                        label="Municipio"
                        variant="outlined"
                        :disabled="!departamentoSeleccionado"
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
                        v-model="alumno.estado"
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
                  :to="{ name: 'Alumnos' }"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="!valid"
                >
                  {{ isEditing ? 'Guardar Cambios' : 'Crear Alumno' }}
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
import alumnoService from '@/services/alumno.service'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const form = ref(null)
const valid = ref(false)
const loading = ref(false)
const departamentos = ref([])
const municipios = ref([])
const departamentoSeleccionado = ref(null)

const tiposDocumento = ['CC', 'CE', 'TI', 'PP']
const estados = ['ACTIVO', 'INACTIVO']
const generos = [
  { value: 'M', title: 'Masculino' },
  { value: 'F', title: 'Femenino' },
]

const alumno = ref({
  nombre: '',
  apellido: '',
  tipoDocumentoNombre: 'CC',
  documentoIdentidad: '',
  fechaNacimiento: '',
  genero: '',
  estatura: '',
  peso: '',
  tipoSangre: '',
  email: '',
  telefono: '',
  direccion: '',
  municipioId: '',
  estado: 'ACTIVO',
})

const rules = {
  required: v => !!v || 'Este campo es requerido',
  email: v => /.+@.+\..+/.test(v) || 'Email inválido',
}

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
  await loadDepartamentos()
  if (isEditing.value) {
    await loadAlumno()
  }
})

async function loadDepartamentos() {
  try {
    const response = await api.get('/departamentos')
    departamentos.value = response.data
  } catch (error) {
    console.error('Error al cargar departamentos:', error)
  }
}

async function cargarMunicipios() {
  if (!departamentoSeleccionado.value) {
    municipios.value = []
    return
  }

  try {
    const response = await api.get(`/municipios/departamento/${departamentoSeleccionado.value}`)
    municipios.value = response.data

    if (!isEditing.value) {
      alumno.value.municipioId = ''
    }
  } catch (error) {
    console.error('Error al cargar municipios:', error)
    municipios.value = []
  }
}

async function loadAlumno() {
  loading.value = true
  try {
    const response = await alumnoService.getById(route.params.id)
    const data = response.data
    alumno.value = {
      ...data,
      estatura: data.estatura?.toString() || '',
      peso: data.peso?.toString() || '',
    }

    // Cargar municipio si existe
    if (data.municipioId || data.municipio?.id) {
      // Buscar el departamento del municipio
      const municipioId = data.municipioId || data.municipio?.id
      // Intentar cargar los municipios del departamento
      // Esta lógica depende de cómo tu API retorne los datos
    }
  } catch (error) {
    showSnackbar('Error al cargar el alumno: ' + error.message, 'error')
    router.push({ name: 'Alumnos' })
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
      ...alumno.value,
      estatura: parseFloat(alumno.value.estatura) || null,
      peso: parseFloat(alumno.value.peso) || null,
    }

    if (isEditing.value) {
      await alumnoService.update(route.params.id, data)
      showSnackbar('Alumno actualizado correctamente', 'success')
    } else {
      await alumnoService.create(data)
      showSnackbar('Alumno creado correctamente', 'success')
    }
    router.push({ name: 'Alumnos' })
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