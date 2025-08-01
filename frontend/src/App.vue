<template>
  <div id="app">
    <header class="navbar">
      <h1 class="logo">🏀 Basketstat</h1>
      <nav class="nav-links">
        <router-link to="/" exact-active-class="active-link">Ana Sayfa</router-link>
        <router-link to="/createplayers" active-class="active-link">Oyuncu Oluştur</router-link>
        <router-link to="/compare" active-class="active-link">Karşılaştırma</router-link>
        <router-link to="/myplayers" active-class="active-link">Oyuncularım</router-link>
        <router-link to="/login" class="section-card">Giriş Yap</router-link>
        <router-link to="/register" class="section-card">Kayıt Ol</router-link>
      </nav>
    </header>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { authState } from './utils/auth'
import axios from 'axios'

// Sayfa yenilendiğinde oturumu kontrol et
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const res = await axios.get('/api/users/me')
      authState.user = res.data.user
    } catch {
      localStorage.removeItem('token')
    }
  }
})
</script>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: 'Segoe UI', sans-serif;
  background-color: #fff4e6;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ff6600;
  padding: 15px 30px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 25px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: text;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.3);
  text-decoration: underline;
}

.active-link {
  background-color: rgba(255, 255, 255, 0.5);
  color: #ff6600;
  font-weight: bolder;
  pointer-events: none;
  border-radius: 4px;
}


.content {
  flex-grow: 1;  
  padding: 20px 30px;
  overflow-y: auto;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100vh; 
  width: 100vw;  
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #ff6600;
}

</style>
