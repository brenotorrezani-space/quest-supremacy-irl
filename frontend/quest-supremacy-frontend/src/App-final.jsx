import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sword, Shield, Zap } from 'lucide-react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [gameData, setGameData] = useState(null);

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-auth`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
        await loadGameData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGameData = async () => {
    try {
      const [statsResponse, questsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/game/player-stats`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/game/daily-quests`, { credentials: 'include' })
      ]);

      const stats = await statsResponse.json();
      const quests = await questsResponse.json();

      setGameData({ stats, quests });
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação
    if (!formData.username || !formData.password) {
      setError('Username e senha são obrigatórios');
      setLoading(false);
      return;
    }

    if (authMode === 'register') {
      if (!formData.email) {
        setError('Email é obrigatório para registro');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Senhas não coincidem');
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = authMode === 'login' 
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setUser(data.user);
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      
      if (authMode === 'register') {
        await loadGameData();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setGameData(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setGameData(null);
    }
  };

  const completeQuest = async (questId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/game/complete-quest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quest_id: questId })
      });

      if (response.ok) {
        await loadGameData(); // Recarregar dados
      }
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Carregando Quest Supremacy IRL</h2>
          <p className="text-muted-foreground">Preparando sua jornada épica...</p>
        </div>
      </div>
    );
  }

  // Dashboard do jogo
  if (user && gameData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 manhwa-title text-gradient">
              Quest Supremacy IRL
            </h1>
            <p className="text-muted-foreground manhwa-subtitle">
              ⚔️ Bem-vindo, {user.username}! Sua jornada épica continua...
            </p>
            <Button onClick={handleLogout} variant="outline" className="mt-4">
              Sair
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status do Jogador */}
            <div className="lg:col-span-2">
              <Card className="status-card">
                <CardHeader>
                  <CardTitle className="manhwa-subtitle flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Status do Herói
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(gameData.stats).map(([key, stat]) => (
                      <div key={key} className="stat-card p-4 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium capitalize">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-bold text-gradient">
                            {stat.level}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-600 to-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stat.xp / stat.max_xp) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {stat.xp} / {stat.max_xp} XP
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quests Diárias */}
            <div>
              <Card className="status-card">
                <CardHeader>
                  <CardTitle className="manhwa-subtitle flex items-center gap-2">
                    <Sword className="w-5 h-5" />
                    Quests do Dia
                  </CardTitle>
                  <CardDescription className="manhwa-text">
                    Complete suas missões diárias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gameData.quests.map((quest) => (
                      <div 
                        key={quest.id} 
                        className={`quest-card p-3 rounded-lg border ${
                          quest.completed ? 'bg-green-900/20 border-green-600' : 'bg-gray-800/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{quest.title}</h4>
                          <span className="text-xs text-gradient">
                            +{quest.xp_reward} XP
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {quest.description}
                        </p>
                        {!quest.completed ? (
                          <Button
                            size="sm"
                            onClick={() => completeQuest(quest.id)}
                            className="w-full nav-button"
                          >
                            Completar
                          </Button>
                        ) : (
                          <div className="text-center text-green-400 text-sm font-medium">
                            ✅ Completada
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Frase motivacional */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground manhwa-text italic">
              "⚔️ Cada quest completada te aproxima da supremacia absoluta..."
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tela de login/registro
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-yellow-600 rounded-lg flex items-center justify-center">
              <Sword className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold manhwa-title text-gradient">
            Quest Supremacy IRL
          </h1>
          <p className="text-muted-foreground manhwa-subtitle mt-2">
            {authMode === 'login' ? 'Entre na sua jornada épica' : 'Inicie sua jornada épica'}
          </p>
        </div>

        <Card className="status-card">
          <CardHeader className="text-center">
            <CardTitle className="manhwa-subtitle">
              {authMode === 'login' ? 'Acesso ao Reino' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="manhwa-text">
              {authMode === 'login' 
                ? 'Digite suas credenciais para continuar sua saga'
                : 'Registre-se para começar sua saga de desenvolvimento pessoal'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="manhwa-subtitle">
                  Nome de Usuário
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={authMode === 'login' ? 'Digite seu username' : 'Escolha seu nome de herói'}
                  className="manhwa-text"
                  disabled={loading}
                />
              </div>
              
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="manhwa-subtitle">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu.email@exemplo.com"
                    className="manhwa-text"
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password" className="manhwa-subtitle">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={authMode === 'login' ? 'Digite sua senha' : 'Crie uma senha forte'}
                  className="manhwa-text"
                  disabled={loading}
                />
              </div>
              
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="manhwa-subtitle">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                    className="manhwa-text"
                    disabled={loading}
                  />
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full nav-button manhwa-subtitle"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {authMode === 'login' ? 'Entrando...' : 'Criando Conta...'}
                  </>
                ) : (
                  authMode === 'login' ? 'Entrar no Reino' : 'Começar Jornada'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground manhwa-text">
                {authMode === 'login' ? 'Não possui uma conta?' : 'Já possui uma conta?'}{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-gradient"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  disabled={loading}
                >
                  {authMode === 'login' ? 'Criar Conta' : 'Fazer Login'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground manhwa-text italic">
            "⚔️ {authMode === 'login' 
              ? 'Todo herói precisa começar sua jornada em algum lugar...' 
              : 'Toda lenda começa com um primeiro passo corajoso...'}"
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
