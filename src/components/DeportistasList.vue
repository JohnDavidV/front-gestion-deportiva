<template>
  <div class="deportistas-container">




    <table v-if="deportistas.length" class="deportistas-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Documento</th>
          <th>Email</th>
          <th>Fecha Nacimiento</th>
          <th>Tipo Doc.</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="deportista in deportistas" :key="deportista.id">
          <td>{{ deportista.nombre }}</td>
          <td>{{ deportista.apellido }}</td>
          <td>{{ deportista.documentoIdentidad }}</td>
          <td>{{ deportista.email }}</td>
          <td>{{ deportista.fechaNacimiento }}</td>
          <td>{{ deportista.tipoDocumentoNombre }}</td>
          <td>{{ deportista.estado }}</td>
          <td>
            <router-link :to="{ name: 'EditarDeportista', params: { id: deportista.id } }" class="edit-btn">Editar</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      No hay datos para mostrar.
    </div>
  </div>
</template>
<style scoped>
.deportistas-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
h1 {
  text-align: center;
  margin-bottom: 32px;
  color: #22334d;
}
.deportistas-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.05rem;
}
.deportistas-table th, .deportistas-table td {
  border: 1px solid #e0e0e0;
  padding: 10px 14px;
  text-align: left;
}
.deportistas-table th {
  background: #f5f7fa;
  color: #22334d;
  font-weight: 600;
}
.deportistas-table tr:nth-child(even) {
  background: #f9fbfd;
}
</style>

.edit-btn {
  color: #fff;
  background: #22334d;
  padding: 5px 14px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.98rem;
  font-weight: 500;
  transition: background 0.2s;
  margin-left: 4px;
}
.edit-btn:hover {
  background: #2d4066;
}

<script>
import api from '../services/api';
import DeportistaForm from './DeportistaForm.vue';

export default {
  name: 'DeportistasList',
  components: { DeportistaForm },
  data() {
    return {
      deportistas: [],
    };
  },
  mounted() {
    this.fetchDeportistas();
  },
  methods: {
    async fetchDeportistas() {
      try {
        const response = await api.get('/deportistas');
        this.deportistas = response.data;
      } catch (error) {
        console.error('Error al obtener deportistas:', error);
      }
    },
  }
}
</script>
