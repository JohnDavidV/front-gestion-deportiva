<template>
  <div class="crear-page">
    <h1>Crear Deportista</h1>
    <DeportistaForm />
  </div>
</template>

<script>
import DeportistaForm from '../components/DeportistaForm.vue';

export default {
  name: 'CrearDeportistaPage',
  components: { DeportistaForm },
};
</script>

<style scoped>
.crear-page {
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
