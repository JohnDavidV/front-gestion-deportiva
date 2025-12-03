
<template>
  <div class="editar-page">
    <h1>Editar Deportista</h1>
    <DeportistaForm v-if="deportista" :deportista="deportista" :modo-edicion="true" @deportista-editado="volverALista" />
    <div v-else>Cargando datos...</div>
  </div>
</template>

<script>
import DeportistaForm from '../components/DeportistaForm.vue';
import api from '../services/api';

export default {
  name: 'EditarDeportistaPage',
  components: { DeportistaForm },
  props: ['id'],
  data() {
    return {
      deportista: null,
    };
  },
  async mounted() {
    try {
      const res = await api.get(`/deportistas/${this.id}`);
      this.deportista = res.data;
    } catch (e) {
      alert('No se pudo cargar el deportista');
    }
  },
  methods: {
    volverALista() {
      this.$router.push({ name: 'Deportistas' });
    },
  },
};
</script>

<style scoped>
.editar-page {
  max-width: 700px;
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
</style>
