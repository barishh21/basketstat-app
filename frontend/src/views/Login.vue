<template>
  <div class="auth-container">
    <h2>Giriş Yap</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="form.username" placeholder="Kullanıcı Adı" required />
      <input v-model="form.password" type="password" placeholder="Şifre" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <router-link to="/register">Hesabınız yok mu? Kayıt Olun</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { authState } from '../utils/auth'

const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const { data } = await axios.post('/api/users/login', {
      username: form.value.username,
      password: form.value.password
    })

    authState.login({ username: form.value.username })
    localStorage.setItem('token', data.token)

    router.push('/')

  } catch (err) {
    error.value = err.response?.data?.error || 'Giriş başarısız'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>