// Sistema de níveis hierárquicos do Quest Supremacy IRL
export const LEVELS = [
  'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 
  'SR', 'SSR', 'UR', 'LR', 'MR', 'X', 'XX', 'XXX'
];

// Status do jogador
export const STATS = {
  STRENGTH: 'strength',
  MENTAL_HEALTH: 'mentalHealth',
  INTELLIGENCE: 'intelligence',
  ADDICTION_CONTROL: 'addictionControl',
  NUTRITION: 'nutrition',
  ENDURANCE: 'endurance',
  SPEED: 'speed',
  CHARISMA: 'charisma',
  SKILLS: 'skills',
  SEXUALITY: 'sexuality'
};

// Labels em português para os status
export const STAT_LABELS = {
  [STATS.STRENGTH]: 'Força',
  [STATS.MENTAL_HEALTH]: 'Saúde Mental',
  [STATS.INTELLIGENCE]: 'Inteligência',
  [STATS.ADDICTION_CONTROL]: 'Controle de Vícios',
  [STATS.NUTRITION]: 'Saúde Alimentar',
  [STATS.ENDURANCE]: 'Resistência',
  [STATS.SPEED]: 'Velocidade',
  [STATS.CHARISMA]: 'Carisma',
  [STATS.SKILLS]: 'Habilidades',
  [STATS.SEXUALITY]: 'Sexualidade'
};

// Ícones para cada status (usando Lucide icons)
export const STAT_ICONS = {
  [STATS.STRENGTH]: 'Dumbbell',
  [STATS.MENTAL_HEALTH]: 'Brain',
  [STATS.INTELLIGENCE]: 'BookOpen',
  [STATS.ADDICTION_CONTROL]: 'Shield',
  [STATS.NUTRITION]: 'Apple',
  [STATS.ENDURANCE]: 'Heart',
  [STATS.SPEED]: 'Zap',
  [STATS.CHARISMA]: 'Users',
  [STATS.SKILLS]: 'Target',
  [STATS.SEXUALITY]: 'Heart'
};

// Cores para cada nível
export const LEVEL_COLORS = {
  'F': '#8B5CF6', // Roxo
  'E': '#3B82F6', // Azul
  'D': '#10B981', // Verde
  'C': '#F59E0B', // Amarelo
  'B': '#EF4444', // Vermelho
  'A': '#EC4899', // Rosa
  'S': '#F97316', // Laranja
  'SS': '#DC2626', // Vermelho escuro
  'SSS': '#7C2D12', // Marrom
  'SR': '#1E40AF', // Azul escuro
  'SSR': '#7C3AED', // Roxo escuro
  'UR': '#059669', // Verde escuro
  'LR': '#D97706', // Amarelo escuro
  'MR': '#BE185D', // Rosa escuro
  'X': '#FFD700', // Dourado
  'XX': '#FF6B35', // Laranja vibrante
  'XXX': '#FF1493' // Rosa vibrante
};

// Classe para gerenciar o estado do jogador
export class PlayerState {
  constructor() {
    this.stats = this.initializeStats();
    this.titles = [];
    this.artifacts = [];
    this.achievements = [];
    this.streaks = {};
    this.lastActive = new Date().toISOString();
    this.totalDays = 0;
    this.questsCompleted = 0;
    this.questsFailed = 0;
  }

  initializeStats() {
    const stats = {};
    Object.values(STATS).forEach(stat => {
      stats[stat] = {
        level: 0, // Índice no array LEVELS (0 = F)
        xp: 0,    // 0-100%
        crisisMode: false,
        consecutiveFailures: 0
      };
    });
    return stats;
  }

  // Calcular nível baseado no índice
  getLevel(stat) {
    return LEVELS[this.stats[stat].level];
  }

  // Adicionar XP a um status
  addXP(stat, amount) {
    const statData = this.stats[stat];
    statData.xp += amount;
    
    // Subir de nível se XP >= 100
    while (statData.xp >= 100 && statData.level < LEVELS.length - 1) {
      statData.xp -= 100;
      statData.level++;
    }
    
    // Limitar XP máximo no último nível
    if (statData.level === LEVELS.length - 1) {
      statData.xp = Math.min(statData.xp, 100);
    }
    
    // Resetar modo crise se XP positivo
    if (statData.xp > 0) {
      statData.crisisMode = false;
      statData.consecutiveFailures = 0;
    }
  }

  // Remover XP de um status
  removeXP(stat, amount) {
    const statData = this.stats[stat];
    statData.xp -= amount;
    
    // Descer de nível se XP < 0
    while (statData.xp < 0 && statData.level > 0) {
      statData.level--;
      statData.xp += 100;
    }
    
    // Limitar XP mínimo no primeiro nível
    if (statData.level === 0) {
      statData.xp = Math.max(statData.xp, 0);
    }
    
    // Contar falhas consecutivas
    statData.consecutiveFailures++;
    
    // Ativar modo crise após 3 falhas
    if (statData.consecutiveFailures >= 3) {
      statData.crisisMode = true;
      this.removeXP(stat, 10); // Penalidade adicional
    }
  }

  // Aplicar penalidade por inatividade
  applyInactivityPenalty() {
    Object.values(STATS).forEach(stat => {
      this.removeXP(stat, 5);
    });
  }

  // Aplicar bônus por completar 7+ quests no dia
  applyDailyBonus() {
    Object.values(STATS).forEach(stat => {
      this.addXP(stat, 1);
    });
  }

  // Salvar estado no localStorage
  save() {
    localStorage.setItem('questSupremacyState', JSON.stringify(this));
  }

  // Carregar estado do localStorage
  static load() {
    const saved = localStorage.getItem('questSupremacyState');
    if (saved) {
      const data = JSON.parse(saved);
      const player = new PlayerState();
      Object.assign(player, data);
      return player;
    }
    return new PlayerState();
  }

  // Exportar dados para JSON
  export() {
    return JSON.stringify(this, null, 2);
  }

  // Importar dados de JSON
  import(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      Object.assign(this, data);
      this.save();
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }
}

// Mensagens motivacionais para o início do dia
export const MOTIVATIONAL_MESSAGES = [
  "⚔️ Um novo dia de conquistas te aguarda, aventureiro! Suas quests estão prontas.",
  "🌟 O poder está em suas mãos. Que tipo de herói você será hoje?",
  "🔥 Cada quest completada te aproxima da grandeza. Comece sua jornada!",
  "⚡ Hoje é o dia de superar seus limites. Suas habilidades aguardam evolução!",
  "🏆 Grandes heróis são forjados através de pequenas vitórias diárias. Vamos começar!",
  "🎯 Foque na missão, mantenha a disciplina. A evolução é inevitável!",
  "💪 Sua força interior cresce a cada desafio aceito. Aceite suas quests!",
  "🌅 Um novo capítulo da sua saga começa agora. Escreva uma história épica!",
  "⭐ Cada nível conquistado é uma prova do seu potencial. Continue subindo!",
  "🚀 Transforme hoje em um dia lendário. Suas quests te aguardam!"
];

// Função para obter mensagem motivacional aleatória
export function getRandomMotivationalMessage() {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}

// Função para calcular dias desde última atividade
export function getDaysSinceLastActivity(lastActive) {
  const now = new Date();
  const last = new Date(lastActive);
  const diffTime = Math.abs(now - last);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Função para verificar se é um novo dia
export function isNewDay(lastActive) {
  const now = new Date();
  const last = new Date(lastActive);
  return now.toDateString() !== last.toDateString();
}
