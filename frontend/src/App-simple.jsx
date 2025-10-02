import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sword } from 'lucide-react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

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
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        setError(data.error || 'Erro na autenticação');
      }
    } catch (error) {
      setError('Erro de conexão: ' + error.message);
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
    } catch (error) {
      console.error('Erro no logout:', error);
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

  if (user) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 manhwa-title text-gradient">
              Quest Supremacy IRL
            </h1>
            <p className="text-muted-foreground">Bem-vindo, {user.username}!</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard do Herói</CardTitle>
              <CardDescription>
                Sua jornada épica começa aqui!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>✅ Sistema de autenticação funcionando!</p>
                <p>✅ Backend integrado com sucesso!</p>
                <p>✅ Banco de dados configurado!</p>
                <p>🎮 Interface do jogo será carregada em breve...</p>
                
                <Button onClick={handleLogout} variant="outline">
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
