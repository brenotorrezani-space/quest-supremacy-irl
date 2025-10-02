import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, Brain, BookOpen, Shield, Apple, 
  Heart, Zap, Users, Target, Heart as HeartIcon 
} from 'lucide-react';
import { STATS, STAT_LABELS, LEVELS, LEVEL_COLORS } from '../lib/gameSystem.js';

// Mapeamento de ícones
const STAT_ICONS = {
  [STATS.STRENGTH]: Dumbbell,
  [STATS.MENTAL_HEALTH]: Brain,
  [STATS.INTELLIGENCE]: BookOpen,
  [STATS.ADDICTION_CONTROL]: Shield,
  [STATS.NUTRITION]: Apple,
  [STATS.ENDURANCE]: Heart,
  [STATS.SPEED]: Zap,
  [STATS.CHARISMA]: Users,
  [STATS.SKILLS]: Target,
  [STATS.SEXUALITY]: HeartIcon
};

export function PlayerStats({ playerState }) {
  if (!playerState) return null;

  const renderStatCard = (statKey) => {
    const stat = playerState.stats[statKey];
    const level = LEVELS[stat.level];
    const IconComponent = STAT_ICONS[statKey];
    const levelColor = LEVEL_COLORS[level];
    
    return (
      <Card key={statKey} className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
        {stat.crisisMode && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-red-500">
            <span className="absolute -top-4 -right-3 text-white text-xs font-bold transform rotate-45">!</span>
          </div>
        )}
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <IconComponent className="w-4 h-4" style={{ color: levelColor }} />
              <span className="truncate">{STAT_LABELS[statKey]}</span>
            </div>
            <Badge 
              variant="outline" 
              className="text-xs font-bold"
              style={{ 
                borderColor: levelColor, 
                color: levelColor,
                backgroundColor: `${levelColor}10`
              }}
            >
              {level}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Progress 
              value={stat.xp} 
              className="h-2"
              style={{
                '--progress-background': `${levelColor}20`,
                '--progress-foreground': levelColor
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stat.xp.toFixed(1)}%</span>
              <span>
                {stat.crisisMode && (
                  <span className="text-red-500 font-bold mr-1">CRISE</span>
                )}
                {stat.consecutiveFailures > 0 && (
                  <span className="text-orange-500">
                    {stat.consecutiveFailures} falhas
                  </span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Calcular estatísticas gerais
  const totalLevel = Object.values(playerState.stats).reduce((sum, stat) => sum + stat.level, 0);
  const averageXP = Object.values(playerState.stats).reduce((sum, stat) => sum + stat.xp, 0) / 10;
  const crisisCount = Object.values(playerState.stats).filter(stat => stat.crisisMode).length;
  
  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-purple-400" />
            Status do Aventureiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">{totalLevel}</div>
              <div className="text-xs text-muted-foreground">Níveis Totais</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{averageXP.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">XP Médio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{playerState.totalDays}</div>
              <div className="text-xs text-muted-foreground">Dias Jogados</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${crisisCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {crisisCount}
              </div>
              <div className="text-xs text-muted-foreground">Status em Crise</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Object.values(STATS).map(renderStatCard)}
      </div>

      {/* Legenda de Níveis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Hierarquia de Níveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((level, index) => (
              <Badge
                key={level}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: LEVEL_COLORS[level],
                  color: LEVEL_COLORS[level],
                  backgroundColor: `${LEVEL_COLORS[level]}10`
                }}
              >
                {level}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Cada nível requer 100% de XP. Quests de nível superior dão XP dobrado!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
