import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGameStateAPI } from '../hooks/useGameStateAPI';
import { usePWA } from '../hooks/usePWA';
import { Navigation } from './Navigation';
import { PlayerStats } from './PlayerStats';
import { DailyQuests } from './DailyQuests';
import { Achievements } from './Achievements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LogOut, Download, Upload, RotateCcw, Loader2 } from 'lucide-react';

export function QuestSupremacyGame() {
  const { user, logout } = useAuth();
  const {
    playerState,
    dailyQuests,
    achievements,
    settings,
    loading,
    error,
    completeQuest,
    failQuest,
    generateNewQuests,
    updateSettings,
    exportData,
    importData,
    resetForNewDay,
    getGameStats
  } = useGameStateAPI();

  const { installPWA, canInstall } = usePWA();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(settings?.darkMode ?? true);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importDataText, setImportDataText] = useState('');
  const [dailyMessage, setDailyMessage] = useState('');

  // Atualizar modo escuro quando settings mudarem
  useEffect(() => {
    if (settings?.darkMode !== undefined) {
      setDarkMode(settings.darkMode);
    }
  }, [settings]);

  // Gerar mensagem motivacional diária
  useEffect(() => {
    const messages = [
      "🔥 UM NOVO CAPÍTULO DA SUA SAGA COMEÇA AGORA. ESCREVA UMA HISTÓRIA ÉPICA!",
      "⚡ O PODER FLUI ATRAVÉS DE VOCÊ. CANALIZE-O PARA ALCANÇAR A SUPREMACIA!",
      "🌟 AS ESTRELAS SUSSURRAM SOBRE SEU POTENCIAL. MOSTRE AO MUNDO SUA FORÇA!",
      "⚔️ CADA DIA É UMA BATALHA. CADA VITÓRIA, UM PASSO RUMO À LENDA!",
      "🏆 SUA DETERMINAÇÃO TRANSCENDE OS LIMITES MORTAIS. ALCANCE A SUPREMACIA!"
    ];
    
    const today = new Date().getDate();
    setDailyMessage(messages[today % messages.length]);
  }, []);

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    try {
      await updateSettings({ ...settings, darkMode: newDarkMode });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  const handleExportData = () => {
    exportData();
  };

  const handleImportData = async () => {
    try {
      const data = JSON.parse(importDataText);
      await importData(data);
      setShowImportDialog(false);
      setImportDataText('');
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      alert('Erro ao importar dados. Verifique o formato do arquivo.');
    }
  };

  const handleCompleteQuest = async (questId) => {
    try {
      await completeQuest(questId);
      // Aqui você pode adicionar lógica para notificações, conquistas, etc.
    } catch (error) {
      console.error('Erro ao completar quest:', error);
    }
  };

  // Frases narrativas do mestre
  const masterQuotes = {
    dashboard: [
      "⚔️ Um novo capítulo da sua saga começa agora. Escreva uma história épica!",
      "🌟 As estrelas sussurram sobre seu potencial. Mostre ao mundo sua força!",
      "🔥 O fogo da determinação arde em seus olhos. Que suas conquistas ecoem pela eternidade!",
      "⚡ O poder flui através de você. Canalize-o para alcançar a supremacia!",
      "🗡️ Cada dia é uma batalha. Cada vitória, um passo rumo à lenda!"
    ],
    quests: [
      "🗡️ As sombras se movem... você tem missões hoje. Cumpra-as ou caia nas trevas.",
      "⚔️ O destino chama. Suas quests aguardam um verdadeiro guerreiro.",
      "🔥 Hoje você forja seu caminho. Cada missão completada é uma vitória contra o caos.",
      "⚡ O poder está ao seu alcance. Complete suas quests e ascenda!",
      "🌟 A glória espera pelos corajosos. Suas missões são o caminho para a imortalidade."
    ],
    achievements: [
      "🏆 Cada vitória grava seu nome nas páginas da lenda.",
      "👑 Suas conquistas ecoam através dos tempos. Continue sua jornada épica!",
      "⭐ O panteão dos heróis aguarda sua chegada. Mostre-se digno!",
      "🔥 Sua determinação transcende os limites mortais. Alcance a supremacia!",
      "💎 Raros são aqueles que chegam tão longe. Você é verdadeiramente especial."
    ],
    history: [
      "📜 As páginas do tempo guardam seus feitos. Relembre suas vitórias gloriosas!",
      "⏳ O passado é o espelho do futuro. Veja como evoluiu em sua jornada!",
      "📚 Cada dia vivido é uma lição aprendida. Sua história inspira outros!",
      "🎭 O teatro da vida registra suas performances. Que espetáculo magnífico!",
      "🗂️ Seus registros contam uma saga de superação. Continue escrevendo!"
    ],
    settings: [
      "⚙️ Ajuste suas ferramentas, guerreiro. A perfeição está nos detalhes!",
      "🔧 Personalize sua experiência. Cada herói tem suas preferências!",
      "🎛️ Configure seu destino. O poder de escolha está em suas mãos!",
      "📱 Adapte a interface ao seu estilo. Conforto é essencial para a vitória!",
      "🛠️ Otimize sua jornada. Eficiência é a marca dos verdadeiros mestres!"
    ]
  };

  const getCurrentQuote = (tab) => {
    const quotes = masterQuotes[tab] || masterQuotes.dashboard;
    const today = new Date().getDate();
    return quotes[today % quotes.length];
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados do jogo...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-12">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <p className="text-center text-red-600 mb-4">Erro ao carregar dados: {error}</p>
              <Button onClick={() => window.location.reload()} className="w-full">
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {dailyMessage && (
              <div className="motivational-message fade-in">
                {dailyMessage}
              </div>
            )}
            <PlayerStats playerState={playerState} />
          </div>
        );
        
      case 'quests':
        return (
          <DailyQuests
            quests={dailyQuests}
            playerState={playerState}
            onCompleteQuest={handleCompleteQuest}
            onFailQuest={failQuest}
            onGenerateNew={generateNewQuests}
          />
        );
        
      case 'history':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidade em desenvolvimento. Em breve você poderá ver todo seu histórico de progresso!
                </p>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'achievements':
        return <Achievements achievements={achievements} />;
        
      case 'settings':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Usuário</h4>
                    <p className="text-sm text-muted-foreground">
                      Logado como: {user?.username}
                    </p>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Exportar Dados</h4>
                    <p className="text-sm text-muted-foreground">Fazer backup dos seus dados</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Importar Dados</h4>
                    <p className="text-sm text-muted-foreground">Restaurar backup</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                  </Button>
                </div>
                
                {canInstall && (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Instalar App</h4>
                      <p className="text-sm text-muted-foreground">Instalar como aplicativo</p>
                    </div>
                    <Button variant="outline" onClick={installPWA}>
                      📱 Instalar
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Resetar Dia</h4>
                    <p className="text-sm text-muted-foreground">Gerar novas quests para hoje</p>
                  </div>
                  <Button variant="outline" onClick={resetForNewDay}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Resetar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`app-container min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="main-content">
        {/* Header Épico */}
        <div className="epic-header">
          <h1 className="logo-title manhwa-title">
            Quest Supremacy IRL
          </h1>
          <p className="text-muted-foreground manhwa-subtitle">RPG da Vida Real</p>
          
          {/* Frase Narrativa do Mestre */}
          <div className="master-quote manhwa-text">
            {getCurrentQuote(activeTab)}
          </div>
        </div>

        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          gameStats={getGameStats()}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onExportData={handleExportData}
          onImportData={() => setShowImportDialog(true)}
        />
        
        <main className="py-6">
          {renderContent()}
        </main>
      </div>

      {/* Dialog de Importação */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Dados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Dados JSON:</label>
              <Textarea
                value={importDataText}
                onChange={(e) => setImportDataText(e.target.value)}
                placeholder="Cole aqui o conteúdo do arquivo JSON..."
                rows={6}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleImportData} disabled={!importDataText.trim()}>
                Importar
              </Button>
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
