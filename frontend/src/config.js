// Configurações da aplicação Quest Supremacy IRL

// URL do backend - ATUALIZE ESTA URL APÓS FAZER DEPLOY DO BACKEND
export const API_BASE_URL = 'https://0vhlizcgqgwy.manus.space';

// Configurações de desenvolvimento
export const DEV_CONFIG = {
  // URL local do backend para desenvolvimento
  LOCAL_API_URL: 'http://localhost:5000',
  
  // Habilitar logs de debug
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  
  // Timeout para requisições (em ms)
  REQUEST_TIMEOUT: 10000
};

// Configurações de produção
export const PROD_CONFIG = {
  // Timeout para requisições (em ms)
  REQUEST_TIMEOUT: 15000,
  
  // Retry automático em caso de falha
  AUTO_RETRY: true,
  MAX_RETRIES: 3
};

// Configuração atual baseada no ambiente
export const CONFIG = process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;

// Função para obter a URL da API baseada no ambiente
export const getApiUrl = () => {
  // Em desenvolvimento, use a URL local se disponível
  if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
    return DEV_CONFIG.LOCAL_API_URL;
  }
  
  // Em produção ou desenvolvimento com deploy, use a URL do backend
  return API_BASE_URL;
};

// Configurações do jogo
export const GAME_CONFIG = {
  // Níveis disponíveis no sistema
  LEVELS: ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'],
  
  // XP necessário para cada nível
  XP_PER_LEVEL: {
    'F': 100,
    'E': 200,
    'D': 400,
    'C': 800,
    'B': 1600,
    'A': 3200,
    'S': 6400,
    'SS': 12800,
    'SSS': 25600
  },
  
  // Atributos do jogador
  ATTRIBUTES: [
    'força',
    'saude_mental',
    'inteligencia',
    'controle_vicios',
    'saude_alimentar',
    'resistencia',
    'velocidade',
    'carisma',
    'habilidades',
    'sexualidade'
  ]
};
