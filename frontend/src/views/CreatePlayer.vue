<template>
  <div class="create-player-container">
    <h2>Yeni Oyuncu Oluştur</h2>
    
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Oyuncu Adı*</label>
        <input v-model="player.name" type="text" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Yaş*</label>
          <input v-model.number="player.age" type="number" min="15" max="50" required>
        </div>

        <div class="form-group">
          <label>Boy (cm)*</label>
          <input v-model="player.height" type="text" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Pozisyon*</label>
          <select v-model="player.position" required>
            <option value="PG">Point Guard</option>
            <option value="SG">Shooting Guard</option>
            <option value="SF">Small Forward</option>
            <option value="PF">Power Forward</option>
            <option value="C">Center</option>
          </select>
        </div>

        <div class="form-group">
          <label>Forma Numarası*</label>
          <input v-model.number="player.jerseyNumber" type="number" min="0" max="99" required>
        </div>
      </div>

      <div class="stats-section">
        <h3>İstatistikler</h3>
        <div class="stats-grid">
          <div class="form-group">
            <label>Sayı Ort.</label>
            <input v-model.number="player.stats.points" type="number" step="0.1" min="0">
          </div>
          <div class="form-group">
            <label>Asist Ort.</label>
            <input v-model.number="player.stats.assists" type="number" step="0.1" min="0">
          </div>
          <div class="form-group">
            <label>Ribaund Ort.</label>
            <input v-model.number="player.stats.rebounds" type="number" step="0.1" min="0">
          </div>
          <div class="form-group">
            <label>Top Çalma Ort.</label>
            <input v-model.number="player.stats.steals" type="number" step="0.1" min="0">
          </div>
          <div class="form-group">
            <label>Blok Ort.</label>
            <input v-model.number="player.stats.blocks" type="number" step="0.1" min="0">
          </div>
        </div>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Kaydediliyor...' : 'Oyuncuyu Oluştur' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const player = ref({
  name: '',
  age: null,
  height: '',
  position: 'PG',
  jerseyNumber: null,
  stats: {
    points: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    blocks: 0
  }
});

const submitForm = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Oturum açılmamış. Lütfen giriş yapın.');
    }

    const response = await axios.post('/api/players', player.value, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      successMessage.value = 'Oyuncu başarıyla oluşturuldu!';
      setTimeout(() => {
        router.push('/players');
      }, 1500);
    } else {
      throw new Error(response.data.error || 'Oyuncu oluşturulamadı');
    }

  } catch (error) {
    console.error('Hata detayı:', error);
    
    if (error.response) {
      
      errorMessage.value = error.response.data.error || 
                         error.response.data.details?.join(', ') || 
                         'Oyuncu oluşturulamadı';
    } else {
      
      errorMessage.value = error.message || 'Bir hata oluştu';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-player-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.stats-section {
  margin: 25px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

button {
  background-color: #42b983;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  background-color: #fde0e0;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.success-message {
  color: #388e3c;
  background-color: #ebf5eb;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>