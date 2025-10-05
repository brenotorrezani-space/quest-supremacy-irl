import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sword, Shield, Zap } from 'lucide-react';
import './App.css';

// URL do backend deployado
const API_BASE_URL = 'https://quest-supremacy-api.onrender.com';

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-white">Carregando Quest Supremacy IRL</h2>
          <p className="text-gray-400">Preparando sua jornada épica...</p>
        </div>
      </div>
    );
  }

  // Dashboard do jogo
  if (user && gameData) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
              Quest Supremacy IRL
            </h1>
            <p className="text-gray-400">
              ⚔️ Bem-vindo, {user.username}! Sua jornada épica continua...
            </p>
            <Button onClick={handleLogout} variant="outline" className="mt-4">
              Sair
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status do Jogador */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5" />
                    Status do Herói
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(gameData.stats).map(([key, stat]) => (
                      <div key={key} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium capitalize text-white">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                            {stat.level}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-600 to-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stat.xp / stat.max_xp) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
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
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sword className="w-5 h-5" />
                    Quests do Dia
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Complete suas missões diárias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gameData.quests.map((quest) => (
                      <div 
                        key={quest.id} 
                        className={`p-3 rounded-lg border ${
                          quest.completed ? 'bg-green-900/20 border-green-600' : 'bg-gray-800/50 border-gray-600'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm text-white">{quest.title}</h4>
                          <span className="text-xs bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                            +{quest.xp_reward} XP
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          {quest.description}
                        </p>
                        {!quest.completed ? (
                          <Button
                            size="sm"
                            onClick={() => completeQuest(quest.id)}
                            className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700"
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
            <p className="text-sm text-gray-400 italic">
              "⚔️ Cada quest completada te aproxima da supremacia absoluta..."
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tela de login/registro
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-yellow-600 rounded-lg flex items-center justify-center">
              <Sword className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
            Quest Supremacy IRL
          </h1>
          <p className="text-gray-400 mt-2">
            {authMode === 'login' ? 'Entre na sua jornada épica' : 'Inicie sua jornada épica'}
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">
              {authMode === 'login' ? 'Acesso ao Reino' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="text-gray-400">
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
                <Label htmlFor="username" className="text-white">
                  Nome de Usuário
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={authMode === 'login' ? 'Digite seu username' : 'Escolha seu nome de herói'}
                  className="bg-gray-800 border-gray-600 text-white"
                  disabled={loading}
                />
              </div>
              
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu.email@exemplo.com"
                    className="bg-gray-800 border-gray-600 text-white"
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={authMode === 'login' ? 'Digite sua senha' : 'Crie uma senha forte'}
                  className="bg-gray-800 border-gray-600 text-white"
                  disabled={loading}
                />
              </div>
              
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                    className="bg-gray-800 border-gray-600 text-white"
                    disabled={loading}
                  />
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700"
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
              <p className="text-sm text-gray-400">
                {authMode === 'login' ? 'Não possui uma conta?' : 'Já possui uma conta?'}{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent"
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
          <p className="text-sm text-gray-400 italic">
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
