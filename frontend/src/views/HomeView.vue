<template>
  <div class="home">
    <section class="hero">
      <h2>Basketbol İstatistik Platformu</h2>
      <h2 v-if="authState.user">Hoşgeldin, {{ authState.user.username }}! 👋</h2>
      <p>Oyuncular ve daha fazlası tek bir yerde.</p>
    </section>

    <section class="sections">
      <router-link to="/createplayers" class="section-card">Oyuncu Oluştur</router-link>
      <router-link to="/compare" class="section-card">Karşılaştırma</router-link>
      <router-link to="/myplayers" class="section-card">Oyuncularım</router-link>
      <router-link to="/login" class="section-card">Giriş Yap</router-link>
      <router-link to="/register" class="section-card">Kayıt Ol</router-link>
    </section>
  </div>
</template>

<script setup>
import { authState } from '../utils/auth'
</script>

<style scoped>
.home {
  padding: 40px;
  background-color: #fff4e6;
  min-height: 100vh;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

.hero h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.hero p {
  font-size: 18px;
  color: #555;
  margin-bottom: 30px;
}

.sections {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.section-card {
  background-color: #ff6600;
  color: white;
  padding: 20px 30px;
  border-radius: 10px;
  font-size: 18px;
  text-decoration: none;
  transition: 0.3s;
  min-width: 200px;
}

.section-card:hover {
  background-color: #cc5200;
}

</style>
