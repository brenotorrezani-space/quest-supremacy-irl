import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Crown, Sword, Shield, Star, 
  Target, Calendar, Zap, Award, Lock 
} from 'lucide-react';
import { AchievementSystem, RARITY_COLORS, ACHIEVEMENT_TYPES } from '../lib/achievementSystem.js';

export function Achievements({ playerState, questManager }) {
  const [selectedTab, setSelectedTab] = useState('achievements');
  
  if (!playerState) return null;
  
  const achievementSystem = new AchievementSystem(playerState);
  const stats = achievementSystem.getAchievementStats();
  const nextAchievements = achievementSystem.getNextAchievements();

  const renderAchievement = (achievement, isUnlocked = true) => {
    const rarityColor = RARITY_COLORS[achievement.rarity];
    
    return (
      <Card 
        key={achievement.id} 
        className={`transition-all duration-300 hover:scale-105 ${
          isUnlocked 
            ? 'hover:shadow-lg' 
            : 'opacity-60 grayscale'
        }`}
        style={{
          borderColor: isUnlocked ? rarityColor : '#6B7280',
          borderWidth: '2px'
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div>
                <CardTitle className="text-sm font-bold">
                  {achievement.title}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className="text-xs mt-1"
                  style={{ 
                    borderColor: rarityColor, 
                    color: rarityColor,
                    backgroundColor: `${rarityColor}20`
                  }}
                >
                  {achievement.rarity.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            {isUnlocked ? (
              <Trophy className="w-5 h-5 text-yellow-500" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-2">
            {achievement.description}
          </p>
          
          {isUnlocked && achievement.unlockedAt && (
            <div className="text-xs text-green-600 font-medium">
              ✅ Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTitle = (title) => {
    const rarityColor = RARITY_COLORS[title.rarity];
    
    return (
      <Card key={title.id} className="transition-all duration-300 hover:scale-105">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6" style={{ color: rarityColor }} />
            <div className="flex-1">
              <h4 className="font-bold text-sm">{title.name}</h4>
              <p className="text-xs text-muted-foreground">{title.description}</p>
              <Badge 
                variant="outline" 
                className="text-xs mt-1"
                style={{ 
                  borderColor: rarityColor, 
                  color: rarityColor,
                  backgroundColor: `${rarityColor}20`
                }}
              >
                {title.rarity.toUpperCase()}
              </Badge>
            </div>
            <div className="text-xs text-green-600">
              {new Date(title.unlockedAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderArtifact = (artifact) => {
    const rarityColor = RARITY_COLORS[artifact.rarity];
    
    return (
      <Card key={artifact.id} className="transition-all duration-300 hover:scale-105">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{artifact.icon}</div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{artifact.name}</h4>
              <p className="text-xs text-muted-foreground">{artifact.description}</p>
              <Badge 
                variant="outline" 
                className="text-xs mt-1"
                style={{ 
                  borderColor: rarityColor, 
                  color: rarityColor,
                  backgroundColor: `${rarityColor}20`
                }}
              >
                {artifact.rarity.toUpperCase()}
              </Badge>
            </div>
            <div className="text-xs text-green-600">
              {new Date(artifact.unlockedAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Resumo de Conquistas */}
      <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Resumo de Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-yellow-500">{stats.unlocked}</div>
              <div className="text-xs text-muted-foreground">Desbloqueadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{stats.score}</div>
              <div className="text-xs text-muted-foreground">Pontos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">{stats.titles}</div>
              <div className="text-xs text-muted-foreground">Títulos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{stats.artifacts}</div>
              <div className="text-xs text-muted-foreground">Artefatos</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso Geral</span>
              <span>{stats.completion.toFixed(1)}%</span>
            </div>
            <Progress value={stats.completion} className="h-2" />
          </div>
          
          {/* Contadores por Raridade */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(stats.rarityCount).map(([rarity, count]) => (
              <Badge
                key={rarity}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: RARITY_COLORS[rarity],
                  color: RARITY_COLORS[rarity],
                  backgroundColor: `${RARITY_COLORS[rarity]}20`
                }}
              >
                {rarity.toUpperCase()}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Abas de Conquistas */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="titles">Títulos</TabsTrigger>
          <TabsTrigger value="artifacts">Artefatos</TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          {/* Conquistas Desbloqueadas */}
          {achievementSystem.unlockedAchievements.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Conquistas Desbloqueadas ({achievementSystem.unlockedAchievements.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {achievementSystem.unlockedAchievements.map(achievement => 
                  renderAchievement(achievement, true)
                )}
              </div>
            </div>
          )}
          
          {/* Próximas Conquistas */}
          {nextAchievements.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Próximas Conquistas
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {nextAchievements.map(achievement => 
                  renderAchievement(achievement, false)
                )}
              </div>
            </div>
          )}
          
          {/* Estado Vazio */}
          {achievementSystem.unlockedAchievements.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Nenhuma Conquista Ainda</h3>
                <p className="text-muted-foreground">
                  Continue completando quests para desbloquear suas primeiras conquistas!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="titles" className="space-y-4">
          {achievementSystem.unlockedTitles.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-500" />
                Títulos Conquistados ({achievementSystem.unlockedTitles.length})
              </h3>
              <div className="space-y-3">
                {achievementSystem.unlockedTitles.map(renderTitle)}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Crown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Nenhum Título Conquistado</h3>
                <p className="text-muted-foreground">
                  Desbloqueie conquistas para ganhar títulos épicos!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="artifacts" className="space-y-4">
          {achievementSystem.unlockedArtifacts.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sword className="w-5 h-5 text-orange-500" />
                Artefatos Lendários ({achievementSystem.unlockedArtifacts.length})
              </h3>
              <div className="space-y-3">
                {achievementSystem.unlockedArtifacts.map(renderArtifact)}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Sword className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Nenhum Artefato Conquistado</h3>
                <p className="text-muted-foreground">
                  Alcance marcos épicos para forjar artefatos lendários!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Progresso por Tipo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Progresso por Categoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.values(ACHIEVEMENT_TYPES).map(type => {
                  const typeAchievements = achievementSystem.getAchievementsByType(type);
                  const totalOfType = Object.values(achievementSystem.unlockedAchievements)
                    .filter(a => a.type === type).length;
                  
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize">{type.replace('_', ' ')}</span>
                        <span>{typeAchievements.length}</span>
                      </div>
                      <Progress 
                        value={totalOfType > 0 ? (typeAchievements.length / totalOfType) * 100 : 0} 
                        className="h-1" 
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Estatísticas Gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Conclusão</span>
                  <span className="font-bold">{stats.completion.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pontuação Total</span>
                  <span className="font-bold text-yellow-600">{stats.score}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conquistas Restantes</span>
                  <span className="font-bold">{stats.total - stats.unlocked}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rank Atual</span>
                  <span className="font-bold text-purple-600">
                    {stats.score >= 1000 ? 'Lendário' :
                     stats.score >= 500 ? 'Épico' :
                     stats.score >= 200 ? 'Raro' :
                     stats.score >= 50 ? 'Incomum' : 'Comum'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
