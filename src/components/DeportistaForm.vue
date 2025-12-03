<template>
  <form class="nuevo-form" @submit.prevent="onSubmit">
    <h2 v-if="!modoEdicion">Agregar Nuevo Deportista</h2>
    <h2 v-else>Editar Deportista</h2>
    <div class="form-row">
      <input v-model="nuevo.nombre" type="text" placeholder="Nombre" required />
      <input v-model="nuevo.apellido" type="text" placeholder="Apellido" required />
      <input v-model="nuevo.documentoIdentidad" type="text" placeholder="Documento" :readonly="modoEdicion" required />
      <input v-model="nuevo.tipoDocumentoNombre" type="text" placeholder="Tipo Doc." required />
    </div>
    <div class="form-row">
      <input v-model="nuevo.direccion" type="text" placeholder="Direccion" required />
      <input v-model="nuevo.estatura" type="text" placeholder="Estatura" required />
      <input v-model="nuevo.genero" type="text" placeholder="Genero" :readonly="modoEdicion" required />
      <input v-model="nuevo.peso" type="text" placeholder="Peso" required />
    </div>
    <div class="form-row">
      
      <select v-model="departamentoSeleccionado" @change="cargarMunicipios" required>
    <option value="" disabled>-- Selecciona Departamento --</option>
    <option v-for="dep in departamentos" :key="dep.id" :value="dep.id">
      {{ dep.nombre }}
    </option>
  </select>

  <select v-model="nuevo.municipioId" :disabled="!departamentoSeleccionado" required>
    <option value="" disabled>-- Selecciona Municipio --</option>
    <option v-for="mun in municipios" :key="mun.id" :value="mun.id"> 
      {{ mun.nombre }}
    </option>
  </select>
      <input v-model="nuevo.tipoSangre" type="text" placeholder="Tipo Sangre" required />   
      <input v-model="nuevo.telefono" type="text" placeholder="Telefono" required />   
    </div>
    <div class="form-row">
      <input v-model="nuevo.fechaNacimiento" type="date" placeholder="Fecha Nacimiento" required />
      <input v-model="nuevo.email" type="email" placeholder="Email" required />
      <select v-model="nuevo.estado" required>
        <option value="ACTIVO">ACTIVO</option>
        <option value="INACTIVO">INACTIVO</option>
      </select>
      <button type="submit">{{ modoEdicion ? 'Guardar Cambios' : 'Agregar' }}</button>
    </div>
  </form>
</template>

<script>
import api from '../services/api';

export default {
  name: 'DeportistaForm',
  props: {
    deportista: {
      type: Object,
      default: null
    },
    modoEdicion: {
      type: Boolean,
      default: false
    }
  },
  emits: ['deportista-creado', 'deportista-editado'],
  data() {
    return {
      nuevo: {
        nombre: '',
        apellido: '',
        documentoIdentidad: '',
        tipoDocumentoNombre: '',
        direccion: '',
        genero: '',
        estatura: '',
        peso: '',
        municipioId: '',  
        departamento: '',
        tipoSangre: '',
        telefono: '',
        email: '',
        fechaNacimiento: '',
        estado: 'ACTIVO',
      },
      departamentos: [],
      municipios: [],
      departamentoSeleccionado: '',
    };
  },
  created() {
    this.inicializarFormulario();
  },
  watch: {
    deportista: {
      immediate: true,
        handler() {
            this.inicializarFormulario();
        }
    }
  },
  methods: {
    async onSubmit() {
      if (this.modoEdicion) {
        // Editar
        try {
          await api.put(`/deportistas/${this.nuevo.id}`, this.nuevo);
          this.$emit('deportista-editado');
        } catch (error) {
          alert('Error al editar deportista');
          console.error(error);
        }
      } else {
        // Crear
        try {
          await api.post('/deportistas', this.nuevo);
          this.$emit('deportista-creado');
          this.nuevo = {
                nombre: '',
                apellido: '',
                documentoIdentidad: '',
                tipoDocumentoNombre: '',
                direccion: '',
                genero: '',
                estatura: '',
                peso: '',
                municipioId: '',  
                departamento: '',
                tipoSangre: '',
                telefono: '',
                email: '',
                fechaNacimiento: '',
                estado: 'ACTIVO',
          };
        } catch (error) {
          alert('Error al crear deportista');
          console.error(error);
        }
      }
    },
    // Función para cargar la lista inicial de todos los departamentos
  async cargarDepartamentos() {
    try {
      // AJUSTA ESTE ENDPOINT A TU API DE DEPARTAMENTOS
      const response = await api.get('/departamentos'); 
      this.departamentos = response.data;
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
    }
  },
  // Función para cargar los municipios basados en el departamento seleccionado
  async cargarMunicipios() {
    const departamentoId = this.departamentoSeleccionado;
    
    if (!this.modoEdicion) { 
        this.nuevo.municipioId = '';
    }
    
    // Si hay un ID de departamento seleccionado, haz la llamada
    if (departamentoId) {
      try {
        // Usa el ID seleccionado para cargar la lista
        const response = await api.get(`/municipios/departamento/${departamentoId}`); 
        this.municipios = response.data;
        
        // Opcional: Asignar el nombre del departamento al campo 'nuevo.departamento' para el POST/PUT
        const depObj = this.departamentos.find(d => d.id === departamentoId);
        this.nuevo.departamento = depObj ? depObj.nombre : '';

      } catch (error) {
        console.error(`Error al cargar municipios para el depto ${departamentoId}:`, error);
        this.municipios = []; // Limpiar si hay error
      }
    } else {
      this.municipios = [];
    }
  },
  async inicializarFormulario() {
      // 1. Aseguramos que los departamentos estén cargados
      if (this.departamentos.length === 0) {
          await this.cargarDepartamentos();
      }

      // 2. Si estamos en modo edición y tenemos datos del deportista
      if (this.modoEdicion && this.deportista) {
          // Copiamos los datos del prop 'deportista' a 'nuevo'
          this.nuevo = { ...this.deportista }; 

          // 3. Buscamos el ID del departamento por su nombre
          const deportistaDeptoNombre = this.deportista.departamento;
          if (deportistaDeptoNombre) {
              const dep = this.departamentos.find(d => d.nombre === deportistaDeptoNombre);
              
              if (dep) {
                  this.departamentoSeleccionado = dep.id;
                  // 4. Cargamos los municipios y luego asignamos el ID del municipio
                  await this.cargarMunicipios();
                  
                  // Asignamos el ID del municipio que viene en el deportista original.
                  // Esto asume que el objeto deportista (al ser editado) trae el campo municipioId
                  // o el objeto municipio completo con su ID (val.municipio.id).
                  // AJUSTA ESTA LÍNEA SEGÚN CÓMO RECIBAS EL ID DEL MUNICIPIO EN EL PROP 'deportista'
                  // Si tu prop 'deportista' es un DTO, ya debería traer 'municipioId'.
                  if (this.deportista.municipioId) {
                       this.nuevo.municipioId = this.deportista.municipioId;
                  } else if (this.deportista.municipio && this.deportista.municipio.id) {
                       this.nuevo.municipioId = this.deportista.municipio.id;
                  }
              }
          }
      } else {
          // Lógica de creación: Limpiar el formulario
          // (Tu lógica de resetear al crear ya está en onSubmit)
      }
  },
  },
};
</script>

<style scoped>
.nuevo-form {
  margin-bottom: 32px;
  padding: 18px 20px 10px 20px;
  background: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  max-width: 100%;
}
.nuevo-form h2 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.2rem;
  color: #22334d;
  text-align: center;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
}
.form-row input, .form-row select {
  flex: 1 1 180px;
  min-width: 120px;
  padding: 7px 10px;
  border: 1px solid #cfd8dc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}
.form-row button {
  padding: 7px 18px;
  background: #22334d;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  min-width: 140px;
}
.form-row button:hover {
  background: #2d4066;
}
@media (max-width: 900px) {
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
  .nuevo-form {
    padding: 12px 8px 8px 8px;
  }
}
</style>
