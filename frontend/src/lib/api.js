// Serviço de API para comunicação com o backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Para incluir cookies de sessão
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  async checkAuth() {
    return this.request('/api/auth/check-auth');
  }

  // Métodos de dados do jogo
  async getGameData() {
    return this.request('/api/game/game-data');
  }

  async getPlayerStats() {
    return this.request('/api/game/player-stats');
  }

  async updatePlayerStats(stats) {
    return this.request('/api/game/player-stats', {
      method: 'PUT',
      body: stats,
    });
  }

  async getDailyQuests() {
    return this.request('/api/game/daily-quests');
  }

  async updateDailyQuests(quests) {
    return this.request('/api/game/daily-quests', {
      method: 'PUT',
      body: quests,
    });
  }

  async completeQuest(questId) {
    return this.request('/api/game/complete-quest', {
      method: 'POST',
      body: { quest_id: questId },
    });
  }

  async getAchievements() {
    return this.request('/api/game/achievements');
  }

  async updateAchievements(achievements) {
    return this.request('/api/game/achievements', {
      method: 'PUT',
      body: achievements,
    });
  }

  async getSettings() {
    return this.request('/api/game/settings');
  }

  async updateSettings(settings) {
    return this.request('/api/game/settings', {
      method: 'PUT',
      body: settings,
    });
  }
}

export const apiService = new ApiService();
export default apiService;
