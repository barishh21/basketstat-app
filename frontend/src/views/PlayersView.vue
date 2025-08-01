<template>
  <div class="players-view-container">
    <div class="header">
      <h2>Oyuncularım</h2>
      <div class="search-filter">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Oyuncu ara..."
          class="search-input"
          @input="handleSearch"
        >
        <span class="search-icon">🔍</span>
      </div>
      <router-link to="/createplayers" class="new-player-btn">
        Yeni Oyuncu Ekle
      </router-link>
    </div>

    <div v-if="loading" class="loading">Yükleniyor...</div>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="filteredPlayers.length === 0 && !loading" class="empty-state">
      <p v-if="searchQuery">Aramanızla eşleşen oyuncu bulunamadı</p>
      <p v-else>Henüz oyuncu eklemediniz</p>
      <router-link to="/createplayers" class="btn">
        Yeni Oyuncu Oluştur
      </router-link>
    </div>

    <div v-else class="players-grid">
      <div 
        v-for="player in filteredPlayers" 
        :key="player._id" 
        class="player-card"
      >
        <div class="player-header">
          <span class="jersey-number">#{{ player.jerseyNumber }}</span>
          <h3>{{ player.name }}</h3>
          <span class="position-badge">{{ getPositionName(player.position) }}</span>
        </div>
        
        <div class="player-details">
          <p><strong>Yaş:</strong> {{ player.age }}</p>
          <p><strong>Boy:</strong> {{ player.height }} cm</p>
        </div>
        
        <div class="player-stats">
          <div class="stat-item">
            <span class="stat-value">{{ player.stats.points }}</span>
            <span class="stat-label">SAYI</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ player.stats.assists }}</span>
            <span class="stat-label">ASIST</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ player.stats.rebounds }}</span>
            <span class="stat-label">RIBAUND</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ player.stats.steals }}</span>
            <span class="stat-label">TOP ÇALMA</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ player.stats.blocks }}</span>
            <span class="stat-label">BLOK</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const players = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const searchQuery = ref('');

const fetchPlayers = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Oturum açılmamış. Lütfen giriş yapın.');
    }

    const response = await axios.get('/api/players/my-players', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.success) {
      players.value = response.data.players;
    } else {
      throw new Error(response.data.error || 'Oyuncular getirilemedi');
    }

  } catch (error) {
    console.error('Hata detayı:', error);
    errorMessage.value = error.response?.data?.error || 
                        error.message || 
                        'Oyuncular yüklenirken hata oluştu';
  } finally {
    loading.value = false;
  }
};

const getPositionName = (code) => {
  const positions = {
    'PG': 'Point Guard',
    'SG': 'Shooting Guard',
    'SF': 'Small Forward',
    'PF': 'Power Forward',
    'C': 'Center'
  };
  return positions[code] || code;
};

const filteredPlayers = computed(() => {
  if (!searchQuery.value) return players.value;
  
  const query = searchQuery.value.toLowerCase();
  return players.value.filter(player => 
    player.name.toLowerCase().includes(query) ||
    player.position.toLowerCase().includes(query) ||
    player.jerseyNumber.toString().includes(query)
  );
});

const handleSearch = () => {
};

onMounted(fetchPlayers);
</script>

<style scoped>
.players-view-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.search-filter {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
  margin: 0 20px;
}

.search-input {
  width: 100%;
  padding: 8px 15px 8px 35px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.3);
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.new-player-btn {
  background-color: #42b983;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  text-decoration: none;
  white-space: nowrap;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.player-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.player-card:hover {
  transform: translateY(-5px);
}

.player-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.jersey-number {
  font-size: 24px;
  font-weight: bold;
  color: #666;
}

.position-badge {
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.player-details {
  margin-bottom: 10px;
}

.player-details p {
  margin: 5px 0;
}

.player-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.stat-item {
  text-align: center;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #42b983;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-state p {
  margin-bottom: 15px;
  color: #666;
}

.btn {
  background-color: #42b983;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
}

.loading {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.error-message {
  color: #d32f2f;
  background-color: #fde0e0;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    max-width: 100%;
    margin: 10px 0;
    order: 2;
  }
  
  .new-player-btn {
    order: 3;
    margin-top: 10px;
    text-align: center;
  }
}
</style>