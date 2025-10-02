import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, XCircle, Clock, Sword, Trophy, 
  AlertTriangle, Sparkles, RefreshCw 
} from 'lucide-react';
import { STAT_LABELS, LEVELS, LEVEL_COLORS } from '../lib/gameSystem.js';
import { getQuestMotivation, getQuestColor } from '../lib/questSystem.js';

export function DailyQuests({ 
  quests, 
  playerState, 
  onCompleteQuest, 
  onFailQuest, 
  onGenerateNew,
  dailyProgress 
}) {
  const [selectedQuests, setSelectedQuests] = useState(new Set());

  if (!quests || !playerState) return null;

  const handleQuestToggle = (questId, completed) => {
    if (completed) {
      onCompleteQuest(questId);
    } else {
      // Adicionar à seleção para falha em lote
      const newSelected = new Set(selectedQuests);
      if (newSelected.has(questId)) {
        newSelected.delete(questId);
      } else {
        newSelected.add(questId);
      }
      setSelectedQuests(newSelected);
    }
  };

  const handleFailSelected = () => {
    selectedQuests.forEach(questId => {
      onFailQuest(questId);
    });
    setSelectedQuests(new Set());
  };

  const renderQuest = (quest) => {
    const playerLevel = playerState.stats[quest.stat].level;
    const questColor = getQuestColor(quest.difficulty);
    const motivation = getQuestMotivation(quest, playerLevel);
    const isSelected = selectedQuests.has(quest.id);
    
    return (
      <Card 
        key={quest.id} 
        className={`transition-all duration-300 hover:shadow-md ${
          quest.completed ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
          quest.failed ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
          isSelected ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' :
          'hover:scale-102'
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sword className="w-4 h-4" style={{ color: questColor }} />
                {quest.name}
                {quest.difficulty > playerLevel && (
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                )}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {STAT_LABELS[quest.stat]}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: questColor, 
                    color: questColor,
                    backgroundColor: `${questColor}10`
                  }}
                >
                  Nível {quest.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs text-green-600">
                  +{quest.xpReward}% XP
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {quest.completed && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {quest.failed && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              {!quest.completed && !quest.failed && (
                <Clock className="w-5 h-5 text-orange-500" />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">
            {quest.description}
          </p>
          
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-3 font-medium">
            {motivation}
          </div>
          
          {!quest.completed && !quest.failed && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleQuestToggle(quest.id, true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Completar
              </Button>
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleQuestToggle(quest.id, false)}
                className="mt-1"
              />
            </div>
          )}
          
          {quest.completed && (
            <div className="text-xs text-green-600 font-medium">
              ✅ Completada em {new Date(quest.completedAt).toLocaleTimeString()}
            </div>
          )}
          
          {quest.failed && (
            <div className="text-xs text-red-600 font-medium">
              ❌ Falhada em {new Date(quest.failedAt).toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const pendingQuests = quests.filter(q => !q.completed && !q.failed);
  const completedQuests = quests.filter(q => q.completed);
  const failedQuests = quests.filter(q => q.failed);

  return (
    <div className="space-y-6">
      {/* Progresso Diário */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Progresso do Dia
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateNew}
              className="text-xs"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Novas Quests
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completadas: {dailyProgress?.completed || 0}/{dailyProgress?.total || 0}</span>
                <span>{(dailyProgress?.completionRate || 0).toFixed(1)}%</span>
              </div>
              <Progress value={dailyProgress?.completionRate || 0} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-lg font-bold text-green-500">{completedQuests.length}</div>
                <div className="text-xs text-muted-foreground">Completadas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-500">{pendingQuests.length}</div>
                <div className="text-xs text-muted-foreground">Pendentes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-500">{failedQuests.length}</div>
                <div className="text-xs text-muted-foreground">Falhadas</div>
              </div>
            </div>
            
            {completedQuests.length >= 7 && (
              <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700">
                <div className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                  🎉 BÔNUS DIÁRIO ATIVADO! +1% em todos os status!
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações em Lote */}
      {selectedQuests.size > 0 && (
        <Card className="border-orange-300 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-700 dark:text-orange-300">
                  {selectedQuests.size} quest(s) selecionada(s) para falha
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuests(new Set())}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleFailSelected}
                >
                  Marcar como Falhadas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quests Pendentes */}
      {pendingQuests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Quests Pendentes ({pendingQuests.length})
          </h3>
          <div className="grid gap-4">
            {pendingQuests.map(renderQuest)}
          </div>
        </div>
      )}

      {/* Quests Completadas */}
      {completedQuests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Quests Completadas ({completedQuests.length})
          </h3>
          <div className="grid gap-4">
            {completedQuests.map(renderQuest)}
          </div>
        </div>
      )}

      {/* Quests Falhadas */}
      {failedQuests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Quests Falhadas ({failedQuests.length})
          </h3>
          <div className="grid gap-4">
            {failedQuests.map(renderQuest)}
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {quests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Sword className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Nenhuma Quest Disponível</h3>
            <p className="text-muted-foreground mb-4">
              Clique em "Novas Quests" para gerar suas missões diárias!
            </p>
            <Button onClick={onGenerateNew}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar Quests Diárias
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
