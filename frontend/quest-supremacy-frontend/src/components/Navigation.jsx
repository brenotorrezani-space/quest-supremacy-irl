import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, Sword, ScrollText, Trophy, Settings, 
  Moon, Sun, Download, Upload, Calendar, Target, TrendingUp
} from 'lucide-react';

export function Navigation({ 
  activeTab, 
  onTabChange, 
  gameStats, 
  darkMode, 
  onToggleDarkMode,
  onExportData,
  onImportData 
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'quests', label: 'Quests', icon: Sword },
    { id: 'history', label: 'Histórico', icon: ScrollText },
    { id: 'achievements', label: 'Conquistas', icon: Trophy },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Estatísticas do Jogo - Estilo Manhwa */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 status-card">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
            <span className="font-bold text-gradient manhwa-subtitle">{gameStats?.totalDays || 0}</span>
            <span className="text-muted-foreground manhwa-text">Dias</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
            <span className="font-bold text-gradient manhwa-subtitle">{gameStats?.questsCompleted || 0}</span>
            <span className="text-muted-foreground manhwa-text">Quests</span>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
            <span className="font-bold text-gradient manhwa-subtitle">{gameStats?.successRate?.toFixed(1) || 0}%</span>
            <span className="text-muted-foreground manhwa-text">Taxa</span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExportData}
            title="Exportar Dados"
            className="nav-button w-9 h-9 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onImportData}
            title="Importar Dados"
            className="nav-button w-9 h-9 p-0"
          >
            <Upload className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="nav-button w-9 h-9 p-0"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navegação Principal - Estilo Manhwa */}
      <div className="epic-navigation">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => onTabChange(tab.id)}
              className={`nav-button ${isActive ? 'active' : ''}`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              <span className="manhwa-subtitle">{tab.label}</span>
              
              {/* Badges para indicadores */}
              {tab.id === 'quests' && gameStats?.pendingQuests > 0 && (
                <span className="nav-badge">
                  {gameStats.pendingQuests}
                </span>
              )}
              
              {tab.id === 'achievements' && gameStats?.achievements > 0 && (
                <span className="nav-badge">
                  {gameStats.achievements}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
