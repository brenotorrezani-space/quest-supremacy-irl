import { LEVELS, STATS, STAT_LABELS } from './gameSystem.js';

// Tipos de conquistas
export const ACHIEVEMENT_TYPES = {
  LEVEL_MILESTONE: 'level_milestone',
  QUEST_STREAK: 'quest_streak',
  DAILY_BONUS: 'daily_bonus',
  PERFECT_DAY: 'perfect_day',
  COMEBACK: 'comeback',
  DEDICATION: 'dedication',
  MASTERY: 'mastery',
  SPECIAL: 'special'
};

// Definições de conquistas
export const ACHIEVEMENTS = {
  // Marcos de Nível
  first_level_up: {
    id: 'first_level_up',
    type: ACHIEVEMENT_TYPES.LEVEL_MILESTONE,
    title: 'Primeiro Passo',
    description: 'Suba qualquer status para o nível E',
    icon: '🌟',
    rarity: 'common',
    condition: (playerState) => {
      return Object.values(playerState.stats).some(stat => stat.level >= 1);
    }
  },
  
  reach_rank_d: {
    id: 'reach_rank_d',
    type: ACHIEVEMENT_TYPES.LEVEL_MILESTONE,
    title: 'Aventureiro Determinado',
    description: 'Alcance o nível D em qualquer status',
    icon: '⚔️',
    rarity: 'common',
    condition: (playerState) => {
      return Object.values(playerState.stats).some(stat => stat.level >= 2);
    }
  },
  
  reach_rank_c: {
    id: 'reach_rank_c',
    type: ACHIEVEMENT_TYPES.LEVEL_MILESTONE,
    title: 'Guerreiro Competente',
    description: 'Alcance o nível C em qualquer status',
    icon: '🛡️',
    rarity: 'uncommon',
    condition: (playerState) => {
      return Object.values(playerState.stats).some(stat => stat.level >= 3);
    }
  },
  
  reach_rank_b: {
    id: 'reach_rank_b',
    type: ACHIEVEMENT_TYPES.LEVEL_MILESTONE,
    title: 'Herói Habilidoso',
    description: 'Alcance o nível B em qualquer status',
    icon: '🏆',
    rarity: 'rare',
    condition: (playerState) => {
      return Object.values(playerState.stats).some(stat => stat.level >= 4);
    }
  },
  
  reach_rank_a: {
    id: 'reach_rank_a',
    type: ACHIEVEMENT_TYPES.LEVEL_MILESTONE,
    title: 'Campeão Elite',
    description: 'Alcance o nível A em qualquer status',
    icon: '👑',
    rarity: 'epic',
    condition: (playerState) => {
      return Object.values(playerState.stats).some(stat => stat.level >= 5);
    }
  },
  
  reach_rank_s: {
    id: 'reach_rank_s',
    type: ACHIEVEMENT_TYPES.LEVEL_MILESTONE,
    title: 'Lenda Suprema',
    description: 'Alcance o nível S em qualquer status',
    icon: '⭐',
    rarity: 'legendary',
    condition: (playerState) => {
      return Object.values(playerState.stats).some(stat => stat.level >= 6);
    }
  },
  
  // Streaks de Quests
  quest_streak_7: {
    id: 'quest_streak_7',
    type: ACHIEVEMENT_TYPES.QUEST_STREAK,
    title: 'Semana Vitoriosa',
    description: 'Complete quests por 7 dias consecutivos',
    icon: '🔥',
    rarity: 'uncommon',
    condition: (playerState) => {
      return playerState.streaks?.daily >= 7;
    }
  },
  
  quest_streak_30: {
    id: 'quest_streak_30',
    type: ACHIEVEMENT_TYPES.QUEST_STREAK,
    title: 'Mestre da Disciplina',
    description: 'Complete quests por 30 dias consecutivos',
    icon: '💪',
    rarity: 'epic',
    condition: (playerState) => {
      return playerState.streaks?.daily >= 30;
    }
  },
  
  quest_streak_100: {
    id: 'quest_streak_100',
    type: ACHIEVEMENT_TYPES.QUEST_STREAK,
    title: 'Imortal da Persistência',
    description: 'Complete quests por 100 dias consecutivos',
    icon: '🔥',
    rarity: 'legendary',
    condition: (playerState) => {
      return playerState.streaks?.daily >= 100;
    }
  },
  
  // Bônus Diários
  daily_bonus_10: {
    id: 'daily_bonus_10',
    type: ACHIEVEMENT_TYPES.DAILY_BONUS,
    title: 'Workaholic Épico',
    description: 'Ganhe o bônus diário (7+ quests) 10 vezes',
    icon: '⚡',
    rarity: 'rare',
    condition: (playerState) => {
      return playerState.dailyBonusCount >= 10;
    }
  },
  
  // Dia Perfeito
  perfect_day: {
    id: 'perfect_day',
    type: ACHIEVEMENT_TYPES.PERFECT_DAY,
    title: 'Dia Perfeito',
    description: 'Complete todas as quests de um dia sem falhas',
    icon: '✨',
    rarity: 'rare',
    condition: (playerState, questManager) => {
      if (!questManager) return false;
      const progress = questManager.getDailyProgress();
      return progress.total > 0 && progress.completed === progress.total && progress.failed === 0;
    }
  },
  
  // Comeback
  crisis_recovery: {
    id: 'crisis_recovery',
    type: ACHIEVEMENT_TYPES.COMEBACK,
    title: 'Fênix Renascida',
    description: 'Saia do modo crise em qualquer status',
    icon: '🔥',
    rarity: 'uncommon',
    condition: (playerState) => {
      return playerState.crisisRecoveries >= 1;
    }
  },
  
  // Dedicação
  total_quests_100: {
    id: 'total_quests_100',
    type: ACHIEVEMENT_TYPES.DEDICATION,
    title: 'Veterano das Quests',
    description: 'Complete 100 quests no total',
    icon: '🎯',
    rarity: 'uncommon',
    condition: (playerState) => {
      return playerState.questsCompleted >= 100;
    }
  },
  
  total_quests_500: {
    id: 'total_quests_500',
    type: ACHIEVEMENT_TYPES.DEDICATION,
    title: 'Mestre das Missões',
    description: 'Complete 500 quests no total',
    icon: '🏅',
    rarity: 'epic',
    condition: (playerState) => {
      return playerState.questsCompleted >= 500;
    }
  },
  
  total_quests_1000: {
    id: 'total_quests_1000',
    type: ACHIEVEMENT_TYPES.DEDICATION,
    title: 'Lenda Imortal',
    description: 'Complete 1000 quests no total',
    icon: '👑',
    rarity: 'legendary',
    condition: (playerState) => {
      return playerState.questsCompleted >= 1000;
    }
  },
  
  // Maestria
  all_stats_level_5: {
    id: 'all_stats_level_5',
    type: ACHIEVEMENT_TYPES.MASTERY,
    title: 'Mestre Equilibrado',
    description: 'Tenha todos os status no nível B ou superior',
    icon: '⚖️',
    rarity: 'legendary',
    condition: (playerState) => {
      return Object.values(playerState.stats).every(stat => stat.level >= 4);
    }
  },
  
  // Especiais
  first_week: {
    id: 'first_week',
    type: ACHIEVEMENT_TYPES.SPECIAL,
    title: 'Sobrevivente da Primeira Semana',
    description: 'Jogue por 7 dias',
    icon: '🗓️',
    rarity: 'common',
    condition: (playerState) => {
      return playerState.totalDays >= 7;
    }
  },
  
  month_warrior: {
    id: 'month_warrior',
    type: ACHIEVEMENT_TYPES.SPECIAL,
    title: 'Guerreiro do Mês',
    description: 'Jogue por 30 dias',
    icon: '📅',
    rarity: 'rare',
    condition: (playerState) => {
      return playerState.totalDays >= 30;
    }
  }
};

// Títulos que podem ser conquistados
export const TITLES = {
  novice: {
    id: 'novice',
    name: 'Novato',
    description: 'Primeiro título de todo aventureiro',
    requirement: 'Completar primeira quest',
    rarity: 'common'
  },
  
  dedicated: {
    id: 'dedicated',
    name: 'Dedicado',
    description: 'Para aqueles que não desistem',
    requirement: 'Streak de 7 dias',
    rarity: 'uncommon'
  },
  
  disciplined: {
    id: 'disciplined',
    name: 'Disciplinado',
    description: 'Mestre do autocontrole',
    requirement: 'Streak de 30 dias',
    rarity: 'rare'
  },
  
  legendary: {
    id: 'legendary',
    name: 'Lendário',
    description: 'Poucos alcançam tal grandeza',
    requirement: 'Alcançar nível S',
    rarity: 'legendary'
  },
  
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'A perfeição é o padrão',
    requirement: '10 dias perfeitos',
    rarity: 'epic'
  },
  
  phoenix: {
    id: 'phoenix',
    name: 'Fênix',
    description: 'Renasce das cinzas',
    requirement: 'Sair de 5 crises',
    rarity: 'rare'
  }
};

// Artefatos simbólicos
export const ARTIFACTS = {
  sword_of_discipline: {
    id: 'sword_of_discipline',
    name: 'Espada da Disciplina',
    description: 'Forjada através de 30 dias de dedicação',
    icon: '⚔️',
    requirement: 'Streak de 30 dias',
    rarity: 'epic'
  },
  
  shield_of_resilience: {
    id: 'shield_of_resilience',
    name: 'Escudo da Resistência',
    description: 'Protege contra as adversidades',
    icon: '🛡️',
    requirement: 'Sair de modo crise 5 vezes',
    rarity: 'rare'
  },
  
  crown_of_mastery: {
    id: 'crown_of_mastery',
    name: 'Coroa da Maestria',
    description: 'Símbolo de domínio total',
    icon: '👑',
    requirement: 'Todos os status nível B+',
    rarity: 'legendary'
  },
  
  amulet_of_balance: {
    id: 'amulet_of_balance',
    name: 'Amuleto do Equilíbrio',
    description: 'Harmonia entre corpo, mente e espírito',
    icon: '🔮',
    requirement: 'Nível A em 5 status diferentes',
    rarity: 'epic'
  }
};

// Cores por raridade
export const RARITY_COLORS = {
  common: '#9CA3AF',     // Cinza
  uncommon: '#10B981',   // Verde
  rare: '#3B82F6',       // Azul
  epic: '#8B5CF6',       // Roxo
  legendary: '#F59E0B'   // Dourado
};

// Sistema de conquistas
export class AchievementSystem {
  constructor(playerState) {
    this.playerState = playerState;
    this.unlockedAchievements = playerState.achievements || [];
    this.unlockedTitles = playerState.titles || [];
    this.unlockedArtifacts = playerState.artifacts || [];
  }

  // Verificar novas conquistas
  checkAchievements(questManager = null) {
    const newAchievements = [];
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      // Pular se já foi conquistada
      if (this.unlockedAchievements.some(a => a.id === achievement.id)) {
        return;
      }
      
      // Verificar condição
      if (achievement.condition(this.playerState, questManager)) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date().toISOString()
        };
        
        this.unlockedAchievements.push(unlockedAchievement);
        newAchievements.push(unlockedAchievement);
        
        // Verificar se desbloqueia título
        this.checkTitleUnlock(achievement.id);
        
        // Verificar se desbloqueia artefato
        this.checkArtifactUnlock(achievement.id);
      }
    });
    
    // Salvar no estado do jogador
    this.playerState.achievements = this.unlockedAchievements;
    this.playerState.titles = this.unlockedTitles;
    this.playerState.artifacts = this.unlockedArtifacts;
    this.playerState.save();
    
    return newAchievements;
  }

  // Verificar desbloqueio de título
  checkTitleUnlock(achievementId) {
    const titleMappings = {
      'first_level_up': 'novice',
      'quest_streak_7': 'dedicated',
      'quest_streak_30': 'disciplined',
      'reach_rank_s': 'legendary',
      'crisis_recovery': 'phoenix'
    };
    
    const titleId = titleMappings[achievementId];
    if (titleId && !this.unlockedTitles.some(t => t.id === titleId)) {
      const title = {
        ...TITLES[titleId],
        unlockedAt: new Date().toISOString()
      };
      this.unlockedTitles.push(title);
    }
  }

  // Verificar desbloqueio de artefato
  checkArtifactUnlock(achievementId) {
    const artifactMappings = {
      'quest_streak_30': 'sword_of_discipline',
      'crisis_recovery': 'shield_of_resilience',
      'all_stats_level_5': 'crown_of_mastery'
    };
    
    const artifactId = artifactMappings[achievementId];
    if (artifactId && !this.unlockedArtifacts.some(a => a.id === artifactId)) {
      const artifact = {
        ...ARTIFACTS[artifactId],
        unlockedAt: new Date().toISOString()
      };
      this.unlockedArtifacts.push(artifact);
    }
  }

  // Obter conquistas por tipo
  getAchievementsByType(type) {
    return this.unlockedAchievements.filter(a => a.type === type);
  }

  // Obter conquistas por raridade
  getAchievementsByRarity(rarity) {
    return this.unlockedAchievements.filter(a => a.rarity === rarity);
  }

  // Calcular pontuação total
  getTotalScore() {
    const rarityPoints = {
      common: 10,
      uncommon: 25,
      rare: 50,
      epic: 100,
      legendary: 250
    };
    
    return this.unlockedAchievements.reduce((total, achievement) => {
      return total + (rarityPoints[achievement.rarity] || 0);
    }, 0);
  }

  // Obter estatísticas de conquistas
  getAchievementStats() {
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    const unlockedCount = this.unlockedAchievements.length;
    
    const rarityCount = {};
    Object.keys(RARITY_COLORS).forEach(rarity => {
      rarityCount[rarity] = this.getAchievementsByRarity(rarity).length;
    });
    
    return {
      total: totalAchievements,
      unlocked: unlockedCount,
      completion: (unlockedCount / totalAchievements) * 100,
      score: this.getTotalScore(),
      rarityCount,
      titles: this.unlockedTitles.length,
      artifacts: this.unlockedArtifacts.length
    };
  }

  // Obter próximas conquistas disponíveis
  getNextAchievements() {
    return Object.values(ACHIEVEMENTS)
      .filter(achievement => !this.unlockedAchievements.some(a => a.id === achievement.id))
      .slice(0, 5); // Mostrar apenas as próximas 5
  }
}
