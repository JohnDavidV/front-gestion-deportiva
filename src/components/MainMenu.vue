<template>
  <nav class="main-nav">
    <router-link to="/" exact-active-class="active">Listar Deportistas</router-link>
    <router-link to="/crear" exact-active-class="active">Crear Deportista</router-link>
  </nav>
</template>

<style scoped>
.main-nav {
  display: flex;
  justify-content: center;
  gap: 32px;
  background: #22334d;
  padding: 18px 0;
  margin-bottom: 32px;
  border-radius: 0 0 12px 12px;
}
.main-nav a {
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 6px 18px;
  border-radius: 4px;
  transition: background 0.2s;
}
.main-nav a.active, .main-nav a:hover {
  background: #2d4066;
}
</style>
