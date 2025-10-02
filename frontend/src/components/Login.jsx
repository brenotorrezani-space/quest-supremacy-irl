import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sword, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login({ onToggleMode }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setLocalError('Todos os campos são obrigatórios');
      return;
    }

    const result = await login(formData);
    
    if (!result.success) {
      setLocalError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Header Épico */}
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
            Entre na sua jornada épica
          </p>
        </div>

        <Card className="status-card">
          <CardHeader className="text-center">
            <CardTitle className="manhwa-subtitle">Acesso ao Reino</CardTitle>
            <CardDescription className="manhwa-text">
              Digite suas credenciais para continuar sua saga
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {localError && (
                <Alert variant="destructive">
                  <AlertDescription>{localError}</AlertDescription>
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
                  placeholder="Digite seu username"
                  className="manhwa-text"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="manhwa-subtitle">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    className="manhwa-text pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full nav-button manhwa-subtitle"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar no Reino'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground manhwa-text">
                Não possui uma conta?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-gradient"
                  onClick={onToggleMode}
                  disabled={loading}
                >
                  Criar Conta
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Frase Motivacional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground manhwa-text italic">
            "⚔️ Todo herói precisa começar sua jornada em algum lugar..."
          </p>
        </div>
      </div>
    </div>
  );
}
