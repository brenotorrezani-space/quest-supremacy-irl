import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sword, Eye, EyeOff, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Register({ onToggleMode }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { register, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLocalError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Todos os campos são obrigatórios');
      return false;
    }

    if (formData.username.length < 3) {
      setLocalError('Username deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Email inválido');
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    
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
            Inicie sua jornada épica
          </p>
        </div>

        <Card className="status-card">
          <CardHeader className="text-center">
            <CardTitle className="manhwa-subtitle">Criar Conta</CardTitle>
            <CardDescription className="manhwa-text">
              Registre-se para começar sua saga de desenvolvimento pessoal
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
                <div className="relative">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Escolha seu nome de herói"
                    className="manhwa-text pl-10"
                    disabled={loading}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="manhwa-subtitle">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu.email@exemplo.com"
                    className="manhwa-text pl-10"
                    disabled={loading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
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
                    placeholder="Crie uma senha forte"
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="manhwa-subtitle">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                    className="manhwa-text pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
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
                    Criando Conta...
                  </>
                ) : (
                  'Começar Jornada'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground manhwa-text">
                Já possui uma conta?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-gradient"
                  onClick={onToggleMode}
                  disabled={loading}
                >
                  Fazer Login
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Frase Motivacional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground manhwa-text italic">
            "🌟 Toda lenda começa com um primeiro passo corajoso..."
          </p>
        </div>
      </div>
    </div>
  );
}
