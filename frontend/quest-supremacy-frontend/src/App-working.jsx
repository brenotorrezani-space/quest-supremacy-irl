import React, { useState } from 'react';
import './App.css';

function App() {
  const [step, setStep] = useState('test'); // 'test', 'register', 'success'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // URLs para testar
  const API_URLS = [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    import.meta.env.VITE_API_BASE_URL,
    'https://quest-supremacy-api.onrender.com'
  ].filter(Boolean);

  const [currentApiUrl, setCurrentApiUrl] = useState(API_URLS[0]);

  const testConnection = async (url) => {
    try {
      console.log(`Testando conexão com: ${url}`);
      
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Conexão OK com ${url}:`, data);
        return { success: true, data };
      } else {
        console.log(`❌ Erro HTTP ${response.status} com ${url}`);
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      console.log(`❌ Erro de conexão com ${url}:`, error.message);
      return { success: false, error: error.message };
    }
  };

  const testAllConnections = async () => {
    setLoading(true);
    setMessage('Testando conexões...');
    
    for (const url of API_URLS) {
      const result = await testConnection(url);
      if (result.success) {
        setCurrentApiUrl(url);
        setMessage(`✅ Conectado com sucesso: ${url}`);
        setStep('register');
        setLoading(false);
        return;
      }
    }
    
    setMessage('❌ Nenhum servidor encontrado. Verifique se o backend está rodando.');
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      setMessage('❌ Preencha todos os campos');
      return;
    }

    setLoading(true);
    setMessage('Registrando usuário...');

    try {
      console.log(`Registrando em: ${currentApiUrl}/api/auth/register`);
      console.log('Dados:', formData);

      const response = await fetch(`${currentApiUrl}/api/auth/register`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Registro bem-sucedido:', data);
        setMessage(`✅ Usuário ${data.user?.username || formData.username} registrado com sucesso!`);
        setStep('success');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        console.log('❌ Erro no registro:', errorData);
        setMessage(`❌ Erro: ${errorData.error || `HTTP ${response.status}`}`);
      }
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      setMessage(`❌ Erro de conexão: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: '#f5f5f5', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#d4af37', 
          marginBottom: '30px',
          fontSize: '2.5rem'
        }}>
          ⚔️ Quest Supremacy IRL
        </h1>

        {step === 'test' && (
          <div style={{ 
            backgroundColor: '#1a1a1a', 
            padding: '30px', 
            borderRadius: '10px',
            border: '2px solid #b00020'
          }}>
            <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>
              🔧 Teste de Conexão
            </h2>
            
            <p style={{ marginBottom: '20px' }}>
              Vamos testar a conexão com o backend antes de prosseguir.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <strong>URLs que serão testadas:</strong>
              <ul style={{ marginTop: '10px' }}>
                {API_URLS.map((url, index) => (
                  <li key={index} style={{ margin: '5px 0' }}>{url}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={testAllConnections}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#666' : '#b00020',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Testando...' : 'Testar Conexão'}
            </button>

            {message && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#2a2a2a',
                borderRadius: '5px',
                border: '1px solid #444'
              }}>
                {message}
              </div>
            )}
          </div>
        )}

        {step === 'register' && (
          <div style={{ 
            backgroundColor: '#1a1a1a', 
            padding: '30px', 
            borderRadius: '10px',
            border: '2px solid #b00020'
          }}>
            <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>
              📝 Criar Conta
            </h2>
            
            <p style={{ marginBottom: '20px', color: '#90EE90' }}>
              ✅ Conectado: {currentApiUrl}
            </p>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Nome de Usuário:
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Escolha seu nome de herói"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  color: '#f5f5f5',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  color: '#f5f5f5',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Senha:
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crie uma senha forte"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  color: '#f5f5f5',
                  fontSize: '16px'
                }}
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#666' : '#d4af37',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Criando Conta...' : 'Começar Jornada'}
            </button>

            <button
              onClick={() => setStep('test')}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                color: '#d4af37',
                border: '1px solid #d4af37',
                borderRadius: '5px',
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              ← Voltar ao Teste
            </button>

            {message && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#2a2a2a',
                borderRadius: '5px',
                border: '1px solid #444'
              }}>
                {message}
              </div>
            )}
          </div>
        )}

        {step === 'success' && (
          <div style={{ 
            backgroundColor: '#1a1a1a', 
            padding: '30px', 
            borderRadius: '10px',
            border: '2px solid #90EE90',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#90EE90', marginBottom: '20px' }}>
              🎉 Sucesso!
            </h2>
            
            <p style={{ marginBottom: '20px', fontSize: '18px' }}>
              Sua conta foi criada com sucesso!
            </p>

            <p style={{ color: '#d4af37' }}>
              ⚔️ Sua jornada épica está pronta para começar!
            </p>

            <button
              onClick={() => {
                setStep('test');
                setFormData({ username: '', email: '', password: '' });
                setMessage('');
              }}
              style={{
                marginTop: '20px',
                padding: '15px 30px',
                backgroundColor: '#d4af37',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Testar Novamente
            </button>
          </div>
        )}

        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#666' 
        }}>
          <p>🔧 Versão de Debug - Quest Supremacy IRL</p>
          <p>Abra o Console (F12) para ver logs detalhados</p>
        </div>
      </div>
    </div>
  );
}

export default App;
