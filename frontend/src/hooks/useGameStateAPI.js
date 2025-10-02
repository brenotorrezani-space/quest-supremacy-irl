import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function useGameStateAPI() {
  const { isAuthenticated } = useAuth();
  const [gameData, setGameData] = useState(null);
  const [playerState, setPlayerState] = useState({});
  const [dailyQuests, setDailyQuests] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [settings, setSettings] = useState({ darkMode: true, notifications: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados iniciais
  const loadGameData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Carregar todos os dados do jogo
      const [gameDataResponse, playerStatsResponse, questsResponse, achievementsResponse, settingsResponse] = await Promise.all([
        apiService.getGameData(),
        apiService.getPlayerStats(),
        apiService.getDailyQuests(),
        apiService.getAchievements(),
        apiService.getSettings()
      ]);

      setGameData(gameDataResponse);
      setPlayerState(playerStatsResponse);
      setDailyQuests(questsResponse);
      setAchievements(achievementsResponse);
      setSettings(settingsResponse);

    } catch (error) {
      console.error('Erro ao carregar dados do jogo:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Carregar dados quando autenticado
  useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  // Atualizar status do jogador
  const updatePlayerStats = async (newStats) => {
    try {
      await apiService.updatePlayerStats(newStats);
      setPlayerState(newStats);
    } catch (error) {
      console.error('Erro ao atualizar stats:', error);
      throw error;
    }
  };

  // Completar quest
  const completeQuest = async (questId) => {
    try {
      await apiService.completeQuest(questId);
      
      // Atualizar quests localmente
      const updatedQuests = dailyQuests.map(quest => 
        quest.id === questId 
          ? { ...quest, status: 'completed', completed_at: new Date().toISOString() }
          : quest
      );
      setDailyQuests(updatedQuests);
      
      // Recarregar dados para pegar atualizações do servidor
      await loadGameData();
      
    } catch (error) {
      console.error('Erro ao completar quest:', error);
      throw error;
    }
  };

  // Falhar quest
  const failQuest = async (questId) => {
    try {
      // Atualizar quest localmente
      const updatedQuests = dailyQuests.map(quest => 
        quest.id === questId 
          ? { ...quest, status: 'failed', failed_at: new Date().toISOString() }
          : quest
      );
      setDailyQuests(updatedQuests);
      
      // Salvar no servidor
      await apiService.updateDailyQuests(updatedQuests);
      
    } catch (error) {
      console.error('Erro ao falhar quest:', error);
      throw error;
    }
  };

  // Gerar novas quests
  const generateNewQuests = async () => {
    try {
      // Forçar geração de novas quests fazendo uma nova requisição
      const newQuests = await apiService.getDailyQuests();
      setDailyQuests(newQuests);
    } catch (error) {
      console.error('Erro ao gerar novas quests:', error);
      throw error;
    }
  };

  // Atualizar conquistas
  const updateAchievements = async (newAchievements) => {
    try {
      await apiService.updateAchievements(newAchievements);
      setAchievements(newAchievements);
    } catch (error) {
      console.error('Erro ao atualizar conquistas:', error);
      throw error;
    }
  };

  // Atualizar configurações
  const updateSettings = async (newSettings) => {
    try {
      await apiService.updateSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  };

  // Exportar dados
  const exportData = () => {
    const exportData = {
      playerState,
      dailyQuests,
      achievements,
      settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `quest-supremacy-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Importar dados
  const importData = async (importedData) => {
    try {
      if (importedData.playerState) {
        await updatePlayerStats(importedData.playerState);
      }
      if (importedData.dailyQuests) {
        await apiService.updateDailyQuests(importedData.dailyQuests);
        setDailyQuests(importedData.dailyQuests);
      }
      if (importedData.achievements) {
        await updateAchievements(importedData.achievements);
      }
      if (importedData.settings) {
        await updateSettings(importedData.settings);
      }
      
      // Recarregar todos os dados
      await loadGameData();
      
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  };

  // Resetar para novo dia
  const resetForNewDay = async () => {
    try {
      await generateNewQuests();
      await loadGameData();
    } catch (error) {
      console.error('Erro ao resetar dia:', error);
      throw error;
    }
  };

  // Calcular estatísticas do jogo
  const getGameStats = () => {
    if (!gameData) {
      return {
        totalDays: 0,
        questsCompleted: 0,
        successRate: 0,
        pendingQuests: 0,
        achievements: 0
      };
    }

    const pendingQuests = dailyQuests.filter(q => q.status === 'pending').length;
    
    return {
      totalDays: gameData.total_days || 0,
      questsCompleted: gameData.total_quests_completed || 0,
      successRate: gameData.total_quests_completed > 0 
        ? ((gameData.total_quests_completed / (gameData.total_quests_completed + pendingQuests)) * 100)
        : 0,
      pendingQuests,
      achievements: achievements.length
    };
  };

  return {
    // Estados
    gameData,
    playerState,
    dailyQuests,
    achievements,
    settings,
    loading,
    error,
    
    // Ações
    completeQuest,
    failQuest,
    generateNewQuests,
    updatePlayerStats,
    updateAchievements,
    updateSettings,
    exportData,
    importData,
    resetForNewDay,
    loadGameData,
    
    // Utilitários
    getGameStats,
    isAuthenticated
  };
}
