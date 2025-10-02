import { useState, useEffect, useCallback } from 'react';
import { PlayerState, getDaysSinceLastActivity, isNewDay, getRandomMotivationalMessage } from '../lib/gameSystem.js';
import { QuestManager } from '../lib/questSystem.js';

export function useGameState() {
  const [playerState, setPlayerState] = useState(null);
  const [questManager, setQuestManager] = useState(null);
  const [dailyMessage, setDailyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Inicializar estado do jogo
  useEffect(() => {
    const initializeGame = () => {
      // Carregar estado do jogador
      const player = PlayerState.load();
      
      // Verificar inatividade
      const daysSinceLastActivity = getDaysSinceLastActivity(player.lastActive);
      if (daysSinceLastActivity >= 7) {
        player.applyInactivityPenalty();
      }
      
      // Atualizar última atividade
      player.lastActive = new Date().toISOString();
      
      // Verificar se é um novo dia
      if (isNewDay(player.lastActive)) {
        player.totalDays++;
      }
      
      player.save();
      setPlayerState(player);
      
      // Inicializar gerenciador de quests
      const questMgr = new QuestManager(player);
      questMgr.loadQuests();
      setQuestManager(questMgr);
      
      // Definir mensagem motivacional do dia
      setDailyMessage(getRandomMotivationalMessage());
      
      setIsLoading(false);
    };

    initializeGame();
  }, []);

  // Função para atualizar estado e forçar re-render
  const forceUpdate = useCallback(() => {
    setLastUpdate(Date.now());
  }, []);

  // Completar quest
  const completeQuest = useCallback((questId) => {
    if (!questManager) return false;
    
    const success = questManager.completeQuest(questId);
    if (success) {
      forceUpdate();
    }
    return success;
  }, [questManager, forceUpdate]);

  // Falhar quest
  const failQuest = useCallback((questId) => {
    if (!questManager) return false;
    
    const success = questManager.failQuest(questId);
    if (success) {
      forceUpdate();
    }
    return success;
  }, [questManager, forceUpdate]);

  // Gerar novas quests
  const generateNewQuests = useCallback(() => {
    if (!questManager) return [];
    
    const quests = questManager.generateDailyQuests();
    forceUpdate();
    return quests;
  }, [questManager, forceUpdate]);

  // Resetar para novo dia
  const resetForNewDay = useCallback(() => {
    if (!questManager || !playerState) return;
    
    questManager.resetForNewDay();
    playerState.totalDays++;
    playerState.lastActive = new Date().toISOString();
    playerState.save();
    
    setDailyMessage(getRandomMotivationalMessage());
    forceUpdate();
  }, [questManager, playerState, forceUpdate]);

  // Exportar dados do jogo
  const exportGameData = useCallback(() => {
    if (!playerState) return null;
    return playerState.export();
  }, [playerState]);

  // Importar dados do jogo
  const importGameData = useCallback((jsonData) => {
    if (!playerState) return false;
    
    const success = playerState.import(jsonData);
    if (success) {
      // Recriar quest manager com novo estado
      const questMgr = new QuestManager(playerState);
      questMgr.loadQuests();
      setQuestManager(questMgr);
      forceUpdate();
    }
    return success;
  }, [playerState, forceUpdate]);

  // Obter estatísticas do jogo
  const getGameStats = useCallback(() => {
    if (!playerState || !questManager) return null;
    
    const dailyProgress = questManager.getDailyProgress();
    
    return {
      totalDays: playerState.totalDays,
      questsCompleted: playerState.questsCompleted,
      questsFailed: playerState.questsFailed,
      successRate: playerState.questsCompleted > 0 
        ? (playerState.questsCompleted / (playerState.questsCompleted + playerState.questsFailed)) * 100 
        : 0,
      dailyProgress,
      titles: playerState.titles.length,
      artifacts: playerState.artifacts.length,
      achievements: playerState.achievements.length
    };
  }, [playerState, questManager, lastUpdate]);

  // Obter quests do dia
  const getDailyQuests = useCallback(() => {
    if (!questManager) return [];
    return questManager.dailyQuests;
  }, [questManager, lastUpdate]);

  // Obter quests pendentes
  const getPendingQuests = useCallback(() => {
    if (!questManager) return [];
    return questManager.getPendingQuests();
  }, [questManager, lastUpdate]);

  // Obter quests completadas
  const getCompletedQuests = useCallback(() => {
    if (!questManager) return [];
    return questManager.getCompletedQuests();
  }, [questManager, lastUpdate]);

  // Obter quests falhadas
  const getFailedQuests = useCallback(() => {
    if (!questManager) return [];
    return questManager.getFailedQuests();
  }, [questManager, lastUpdate]);

  return {
    // Estado
    playerState,
    questManager,
    dailyMessage,
    isLoading,
    
    // Ações
    completeQuest,
    failQuest,
    generateNewQuests,
    resetForNewDay,
    exportGameData,
    importGameData,
    
    // Getters
    getGameStats,
    getDailyQuests,
    getPendingQuests,
    getCompletedQuests,
    getFailedQuests,
    
    // Utilitários
    forceUpdate
  };
}
