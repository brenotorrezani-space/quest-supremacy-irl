import { STATS, STAT_LABELS, LEVELS } from './gameSystem.js';

// Templates de quests para cada status
export const QUEST_TEMPLATES = {
  [STATS.STRENGTH]: [
    {
      name: "Treino do Guerreiro",
      description: "Complete 30 minutos de exercícios físicos",
      difficulty: 1,
      xpReward: 3
    },
    {
      name: "Forja do Titã",
      description: "Faça 50 flexões ou agachamentos",
      difficulty: 2,
      xpReward: 4
    },
    {
      name: "Ritual da Força",
      description: "Vá à academia ou faça treino de força",
      difficulty: 3,
      xpReward: 5
    },
    {
      name: "Desafio do Colosso",
      description: "Supere seu recorde pessoal em algum exercício",
      difficulty: 4,
      xpReward: 8
    }
  ],
  
  [STATS.MENTAL_HEALTH]: [
    {
      name: "Ritual da Serenidade",
      description: "Medite por 10 minutos",
      difficulty: 1,
      xpReward: 3
    },
    {
      name: "Jornada Interior",
      description: "Escreva 3 coisas pelas quais é grato",
      difficulty: 1,
      xpReward: 2
    },
    {
      name: "Templo da Paz",
      description: "Pratique respiração profunda por 15 minutos",
      difficulty: 2,
      xpReward: 4
    },
    {
      name: "Cura do Espírito",
      description: "Tenha uma conversa significativa com alguém querido",
      difficulty: 3,
      xpReward: 5
    }
  ],
  
  [STATS.INTELLIGENCE]: [
    {
      name: "Busca pelo Conhecimento",
      description: "Leia 20 páginas de um livro",
      difficulty: 1,
      xpReward: 3
    },
    {
      name: "Sabedoria Ancestral",
      description: "Assista a um documentário educativo",
      difficulty: 2,
      xpReward: 4
    },
    {
      name: "Mente Afiada",
      description: "Resolva puzzles ou jogos de lógica por 30 min",
      difficulty: 2,
      xpReward: 4
    },
    {
      name: "Mestre do Saber",
      description: "Aprenda algo novo e ensine para alguém",
      difficulty: 4,
      xpReward: 7
    }
  ],
  
  [STATS.ADDICTION_CONTROL]: [
    {
      name: "Resistência Férrea",
      description: "Passe 24h sem seus vícios principais",
      difficulty: 3,
      xpReward: 6
    },
    {
      name: "Escudo da Disciplina",
      description: "Substitua um hábito ruim por um saudável",
      difficulty: 2,
      xpReward: 4
    },
    {
      name: "Quebra de Correntes",
      description: "Identifique e evite um gatilho de vício",
      difficulty: 2,
      xpReward: 5
    },
    {
      name: "Liberdade Total",
      description: "Complete uma semana sem vícios",
      difficulty: 5,
      xpReward: 10
    }
  ],
  
  [STATS.NUTRITION]: [
    {
      name: "Banquete Sagrado",
      description: "Coma 5 porções de frutas e vegetais",
      difficulty: 2,
      xpReward: 3
    },
    {
      name: "Hidratação Divina",
      description: "Beba 2 litros de água",
      difficulty: 1,
      xpReward: 2
    },
    {
      name: "Alquimia Nutricional",
      description: "Prepare uma refeição saudável do zero",
      difficulty: 3,
      xpReward: 5
    },
    {
      name: "Jejum do Guerreiro",
      description: "Evite açúcar e processados por 24h",
      difficulty: 3,
      xpReward: 6
    }
  ],
  
  [STATS.ENDURANCE]: [
    {
      name: "Maratona do Herói",
      description: "Caminhe 10.000 passos",
      difficulty: 2,
      xpReward: 3
    },
    {
      name: "Coração de Dragão",
      description: "Faça 20 minutos de cardio",
      difficulty: 2,
      xpReward: 4
    },
    {
      name: "Resistência Infinita",
      description: "Suba escadas em vez de usar elevador",
      difficulty: 1,
      xpReward: 2
    },
    {
      name: "Prova de Ferro",
      description: "Complete um treino HIIT de 30 minutos",
      difficulty: 4,
      xpReward: 7
    }
  ],
  
  [STATS.SPEED]: [
    {
      name: "Velocidade do Trovão",
      description: "Faça sprints por 15 minutos",
      difficulty: 3,
      xpReward: 5
    },
    {
      name: "Reflexos Ninja",
      description: "Pratique exercícios de agilidade",
      difficulty: 2,
      xpReward: 4
    },
    {
      name: "Rajada Relâmpago",
      description: "Complete tarefas rápidas em tempo recorde",
      difficulty: 2,
      xpReward: 3
    },
    {
      name: "Mestre da Velocidade",
      description: "Melhore seu tempo em corrida/caminhada",
      difficulty: 4,
      xpReward: 6
    }
  ],
  
  [STATS.CHARISMA]: [
    {
      name: "Charme do Diplomata",
      description: "Inicie 3 conversas com pessoas novas",
      difficulty: 3,
      xpReward: 5
    },
    {
      name: "Presença Magnética",
      description: "Faça um elogio genuíno para alguém",
      difficulty: 1,
      xpReward: 2
    },
    {
      name: "Oratória Divina",
      description: "Pratique falar em público por 10 minutos",
      difficulty: 3,
      xpReward: 4
    },
    {
      name: "Líder Nato",
      description: "Organize ou lidere uma atividade em grupo",
      difficulty: 4,
      xpReward: 7
    }
  ],
  
  [STATS.SKILLS]: [
    {
      name: "Forja de Talentos",
      description: "Pratique uma habilidade por 30 minutos",
      difficulty: 2,
      xpReward: 4
    },
    {
      name: "Mestre Artesão",
      description: "Crie algo com suas próprias mãos",
      difficulty: 3,
      xpReward: 5
    },
    {
      name: "Evolução Técnica",
      description: "Aprenda uma nova técnica ou ferramenta",
      difficulty: 3,
      xpReward: 6
    },
    {
      name: "Virtuose Supremo",
      description: "Demonstre maestria em sua habilidade principal",
      difficulty: 5,
      xpReward: 8
    }
  ],
  
  [STATS.SEXUALITY]: [
    {
      name: "Autoconhecimento Íntimo",
      description: "Dedique tempo para autoconhecimento pessoal",
      difficulty: 2,
      xpReward: 4
    },
    {
      name: "Conexão Profunda",
      description: "Tenha uma conversa íntima e honesta",
      difficulty: 3,
      xpReward: 5
    },
    {
      name: "Energia Vital",
      description: "Pratique autocuidado e amor próprio",
      difficulty: 2,
      xpReward: 3
    },
    {
      name: "Harmonia Interior",
      description: "Reflita sobre seus desejos e limites",
      difficulty: 2,
      xpReward: 4
    }
  ]
};

// Classe para gerenciar quests
export class QuestManager {
  constructor(playerState) {
    this.playerState = playerState;
    this.dailyQuests = [];
    this.completedQuests = [];
    this.failedQuests = [];
  }

  // Gerar quests diárias baseadas no nível do jogador
  generateDailyQuests() {
    const quests = [];
    const stats = Object.values(STATS);
    
    // Gerar 1-2 quests por status (10-20 total)
    stats.forEach(stat => {
      const templates = QUEST_TEMPLATES[stat];
      const playerLevel = this.playerState.stats[stat].level;
      
      // Filtrar quests baseadas no nível do jogador
      const availableQuests = templates.filter(quest => {
        const levelDiff = quest.difficulty - playerLevel;
        return levelDiff >= -2 && levelDiff <= 3; // Quests próximas ao nível
      });
      
      // Selecionar 1-2 quests aleatórias
      const questCount = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < questCount && availableQuests.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableQuests.length);
        const selectedQuest = availableQuests.splice(randomIndex, 1)[0];
        
        quests.push({
          id: `${stat}_${Date.now()}_${i}`,
          stat,
          ...selectedQuest,
          completed: false,
          failed: false,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    this.dailyQuests = quests;
    this.saveQuests();
    return quests;
  }

  // Completar uma quest
  completeQuest(questId) {
    const quest = this.dailyQuests.find(q => q.id === questId);
    if (!quest || quest.completed || quest.failed) return false;
    
    quest.completed = true;
    quest.completedAt = new Date().toISOString();
    
    // Calcular XP baseado no nível da quest vs nível do jogador
    const playerLevel = this.playerState.stats[quest.stat].level;
    const levelDiff = quest.difficulty - playerLevel;
    let xpGain = quest.xpReward;
    
    // Dobrar XP se quest for de nível superior
    if (levelDiff > 0) {
      xpGain *= 2;
    }
    
    // Aplicar XP
    this.playerState.addXP(quest.stat, xpGain);
    this.completedQuests.push(quest);
    
    // Verificar bônus diário (7+ quests completadas)
    const completedToday = this.dailyQuests.filter(q => q.completed).length;
    if (completedToday >= 7) {
      this.playerState.applyDailyBonus();
    }
    
    this.playerState.questsCompleted++;
    this.playerState.save();
    this.saveQuests();
    
    return true;
  }

  // Falhar em uma quest
  failQuest(questId) {
    const quest = this.dailyQuests.find(q => q.id === questId);
    if (!quest || quest.completed || quest.failed) return false;
    
    quest.failed = true;
    quest.failedAt = new Date().toISOString();
    
    // Aplicar penalidade
    const penalty = Math.min(quest.xpReward, 5); // Máximo -5%
    this.playerState.removeXP(quest.stat, penalty);
    this.failedQuests.push(quest);
    
    this.playerState.questsFailed++;
    this.playerState.save();
    this.saveQuests();
    
    return true;
  }

  // Obter quests pendentes
  getPendingQuests() {
    return this.dailyQuests.filter(q => !q.completed && !q.failed);
  }

  // Obter quests completadas hoje
  getCompletedQuests() {
    return this.dailyQuests.filter(q => q.completed);
  }

  // Obter quests falhadas hoje
  getFailedQuests() {
    return this.dailyQuests.filter(q => q.failed);
  }

  // Calcular progresso do dia
  getDailyProgress() {
    const total = this.dailyQuests.length;
    const completed = this.getCompletedQuests().length;
    const failed = this.getFailedQuests().length;
    const pending = this.getPendingQuests().length;
    
    return {
      total,
      completed,
      failed,
      pending,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }

  // Salvar quests no localStorage
  saveQuests() {
    const questData = {
      dailyQuests: this.dailyQuests,
      completedQuests: this.completedQuests,
      failedQuests: this.failedQuests,
      lastGenerated: new Date().toDateString()
    };
    localStorage.setItem('questSupremacyQuests', JSON.stringify(questData));
  }

  // Carregar quests do localStorage
  loadQuests() {
    const saved = localStorage.getItem('questSupremacyQuests');
    if (saved) {
      const data = JSON.parse(saved);
      
      // Verificar se as quests são do dia atual
      const today = new Date().toDateString();
      if (data.lastGenerated === today) {
        this.dailyQuests = data.dailyQuests || [];
        this.completedQuests = data.completedQuests || [];
        this.failedQuests = data.failedQuests || [];
        return true;
      }
    }
    
    // Gerar novas quests se não houver ou se for um novo dia
    this.generateDailyQuests();
    return false;
  }

  // Resetar quests para um novo dia
  resetForNewDay() {
    // Mover quests não completadas para histórico
    const unfinishedQuests = this.getPendingQuests();
    unfinishedQuests.forEach(quest => {
      this.failQuest(quest.id);
    });
    
    // Gerar novas quests
    this.generateDailyQuests();
  }
}

// Função para obter descrição motivacional da quest
export function getQuestMotivation(quest, playerLevel) {
  const levelDiff = quest.difficulty - playerLevel;
  
  if (levelDiff > 2) {
    return "⚠️ QUEST ÉPICA - Recompensa dobrada por ser de nível superior!";
  } else if (levelDiff > 0) {
    return "🔥 DESAFIO - Quest acima do seu nível atual!";
  } else if (levelDiff === 0) {
    return "⚔️ Quest perfeita para seu nível atual";
  } else {
    return "✨ Quest básica - Ideal para manter o progresso";
  }
}

// Função para obter cor da quest baseada na dificuldade
export function getQuestColor(difficulty) {
  const colors = {
    1: '#10B981', // Verde - Fácil
    2: '#F59E0B', // Amarelo - Médio
    3: '#EF4444', // Vermelho - Difícil
    4: '#8B5CF6', // Roxo - Muito Difícil
    5: '#FFD700'  // Dourado - Épico
  };
  return colors[difficulty] || colors[1];
}
