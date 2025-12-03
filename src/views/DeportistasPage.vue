<template>
  <div class="deportistas-page">
    <h1>Lista de Deportistas</h1>
    <DeportistasList />
  </div>
</template>

<script>
import DeportistasList from '../components/DeportistasList.vue';

export default {
  name: 'DeportistasPage',
  components: { DeportistasList },
};
</script>

<style scoped>
.deportistas-page {
  max-width: 1100px;
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
