<template>
  <div class="compare-container">
    <h2>Oyuncu Karşılaştırma</h2>
    
    <div class="player-selection">
      <div class="player-select">
        <label>1. Oyuncu</label>
        <select v-model="selectedPlayer1">
          <option value="">Oyuncu Seçin</option>
          <option 
            v-for="player in players" 
            :key="player._id" 
            :value="player"
          >
            {{ player.name }} (#{{ player.jerseyNumber }} - {{ player.position }})
          </option>
        </select>
      </div>
      
      <div class="vs-circle">VS</div>
      
      <div class="player-select">
        <label>2. Oyuncu</label>
        <select v-model="selectedPlayer2">
          <option value="">Oyuncu Seçin</option>
          <option 
            v-for="player in players" 
            :key="player._id" 
            :value="player"
          >
            {{ player.name }} (#{{ player.jerseyNumber }} - {{ player.position }})
          </option>
        </select>
      </div>
    </div>
    
    <div v-if="comparisonResult" class="comparison-result">
      <div class="player-header">
        <div class="player-info">
          <h3>{{ selectedPlayer1.name }}</h3>
          <p>#{{ selectedPlayer1.jerseyNumber }} | {{ getPositionName(selectedPlayer1.position) }}</p>
        </div>
        
        <div class="versus">VS</div>
        
        <div class="player-info">
          <h3>{{ selectedPlayer2.name }}</h3>
          <p>#{{ selectedPlayer2.jerseyNumber }} | {{ getPositionName(selectedPlayer2.position) }}</p>
        </div>
      </div>
      
      <div class="stats-comparison">
        <div 
          v-for="stat in comparedStats" 
          :key="stat.key" 
          class="stat-row"
        >
          <div class="stat-name">{{ stat.label }}</div>
          <div class="stat-values">
            <div class="player-stat" :class="{ 'better-stat': stat.player1Value > stat.player2Value }">
              {{ stat.player1Value.toFixed(1) }}
            </div>
            <div class="difference">
              {{ formatDifference(stat.player1Value, stat.player2Value, stat.key) }}
            </div>
            <div class="player-stat" :class="{ 'better-stat': stat.player2Value > stat.player1Value }">
              {{ stat.player2Value.toFixed(1) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="selectedPlayer1 && selectedPlayer2" class="no-comparison">
      <p>Karşılaştırma verisi bulunamadı</p>
    </div>
    
    <div v-else class="select-players">
      <p>Karşılaştırmak için iki oyuncu seçin</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const players = ref([]);
const selectedPlayer1 = ref(null);
const selectedPlayer2 = ref(null);
const loading = ref(false);

const fetchPlayers = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/players/my-players', {
      headers: { Authorization: `Bearer ${token}` }
    });
    players.value = response.data.players;
  } catch (error) {
    console.error('Oyuncular yüklenirken hata:', error);
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

const comparisonResult = computed(() => {
  if (!selectedPlayer1.value || !selectedPlayer2.value) return null;
  
  return {
    player1: selectedPlayer1.value,
    player2: selectedPlayer2.value
  };
});

const comparedStats = computed(() => {
  if (!comparisonResult.value) return [];
  
  const stats = [
    { key: 'points', label: 'Sayı Ortalaması' },
    { key: 'assists', label: 'Asist Ortalaması' },
    { key: 'rebounds', label: 'Ribaund Ortalaması' },
    { key: 'steals', label: 'Top Çalma Ortalaması' },
    { key: 'blocks', label: 'Blok Ortalaması' }
  ];
  
  return stats.map(stat => {
    const player1Value = selectedPlayer1.value.stats?.[stat.key] || 0;
    const player2Value = selectedPlayer2.value.stats?.[stat.key] || 0;
    
    return {
      ...stat,
      player1Value,
      player2Value
    };
  });
});

const formatDifference = (player1Value, player2Value, statKey) => {
  const difference = player1Value - player2Value;
  const absoluteDiff = Math.abs(difference).toFixed(1);
  
  const statLabels = {
    points: 'sayı',
    assists: 'asist',
    rebounds: 'ribaund',
    steals: 'top çalma',
    blocks: 'blok'
  };
  
  if (difference === 0) {
    return `İki oyuncu da ${statLabels[statKey]} ortalamasında eşit`;
  }
  
  if (difference > 0) {
    return `${selectedPlayer1.value.name}, ${selectedPlayer2.value.name}'den ${absoluteDiff} ${statLabels[statKey]} daha fazla`;
  } else {
    return `${selectedPlayer2.value.name}, ${selectedPlayer1.value.name}'den ${absoluteDiff} ${statLabels[statKey]} daha az`;
  }
};

onMounted(fetchPlayers);
</script>

<style scoped>
.compare-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.player-selection {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.player-select {
  flex: 1;
  min-width: 250px;
}

.player-select label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.player-select select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.vs-circle {
  background-color: #42b983;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 5px;
}

.comparison-result {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.player-info {
  text-align: center;
  flex: 1;
}

.player-info h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.player-info p {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.9rem;
}

.versus {
  padding: 0 20px;
  font-weight: bold;
  color: #42b983;
  font-size: 1.2rem;
}

.stats-comparison {
  display: grid;
  gap: 15px;
}

.stat-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.stat-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.stat-values {
  flex: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-stat {
  width: 80px;
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  font-weight: bold;
}

.better-stat {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.difference {
  flex: 1;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  padding: 0 10px;
}

.select-players, .no-comparison {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .player-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .versus {
    padding: 10px 0;
  }
  
  .stat-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .stat-values {
    width: 100%;
  }
}
</style>