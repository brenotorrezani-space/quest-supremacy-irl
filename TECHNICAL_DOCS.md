# 📚 Documentação Técnica - Quest Supremacy IRL

## 🏗️ Arquitetura do Sistema

### Visão Geral
Quest Supremacy IRL é uma aplicação full-stack PWA que implementa um sistema de gamificação da vida real. A arquitetura segue o padrão de separação entre frontend e backend, com comunicação via APIs RESTful.

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (React PWA)   │     REST API     │   (Flask API)   │
│   Vercel        │                  │   Render        │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   Database      │
                                     │  PostgreSQL     │
                                     │   Render        │
                                     └─────────────────┘
```

## 🔧 Backend (Flask API)

### Estrutura de Arquivos
```
backend/quest_supremacy_api/
├── src/
│   ├── main.py              # Aplicação principal (desenvolvimento)
│   ├── main_prod.py         # Aplicação para produção
│   ├── main_simple.py       # Versão simplificada para testes
│   ├── models/
│   │   └── user.py          # Modelos SQLAlchemy
│   └── routes/
│       ├── auth.py          # Rotas de autenticação
│       └── game.py          # Rotas do sistema de jogo
├── database/                # Banco SQLite local
├── requirements.txt         # Dependências Python
├── render.yaml             # Configuração Render
└── .env.example            # Exemplo de variáveis de ambiente
```

### Tecnologias
- **Flask 3.1.1**: Framework web minimalista
- **SQLAlchemy 2.0.41**: ORM para banco de dados
- **Flask-CORS**: Gerenciamento de CORS
- **Werkzeug**: Utilitários e segurança (hash de senhas)
- **Gunicorn**: Servidor WSGI para produção
- **PostgreSQL**: Banco de dados em produção
- **SQLite**: Banco de dados em desenvolvimento

### APIs Principais

#### Autenticação (`/api/auth`)
```python
POST /api/auth/register    # Criar nova conta
POST /api/auth/login       # Fazer login
POST /api/auth/logout      # Fazer logout
GET  /api/auth/check-auth  # Verificar autenticação
```

#### Sistema de Jogo (`/api/game`)
```python
GET  /api/game/game-data      # Dados gerais do jogo
GET  /api/game/player-stats   # Status do jogador
POST /api/game/player-stats   # Atualizar status
GET  /api/game/daily-quests   # Quests diárias
POST /api/game/daily-quests   # Completar quest
GET  /api/game/achievements   # Conquistas
GET  /api/game/settings       # Configurações
```

### Modelos de Dados

#### User
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
```

#### GameData
```python
class GameData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    player_stats = db.Column(db.Text, default='{}')  # JSON
    daily_quests = db.Column(db.Text, default='[]')  # JSON
    achievements = db.Column(db.Text, default='[]')  # JSON
    # ... outros campos
```

## ⚛️ Frontend (React PWA)

### Estrutura de Arquivos
```
frontend/quest-supremacy-frontend/
├── public/
│   ├── manifest.json        # Manifest PWA
│   ├── sw.js               # Service Worker
│   └── icon-*.png          # Ícones PWA
├── src/
│   ├── App.jsx             # Componente principal
│   ├── App.css             # Estilos tema manhwa
│   ├── components/         # Componentes React
│   ├── contexts/           # Context API
│   ├── hooks/              # Hooks customizados
│   └── lib/                # Utilitários e sistemas
├── package.json
├── vite.config.js
└── vercel.json             # Configuração Vercel
```

### Tecnologias
- **React 18**: Biblioteca UI
- **Vite 6.3.5**: Build tool e dev server
- **Tailwind CSS**: Framework CSS utilitário
- **Shadcn/UI**: Componentes UI modernos
- **Lucide React**: Ícones
- **Context API**: Gerenciamento de estado
- **Service Workers**: Funcionalidade offline

### Componentes Principais

#### App.jsx
Componente raiz que gerencia autenticação e roteamento básico.

#### Sistema de Gamificação
```javascript
// lib/gameSystem.js
export const PLAYER_STATS = {
  FORCA: 'Força',
  SAUDE_MENTAL: 'Saúde Mental',
  INTELIGENCIA: 'Inteligência',
  // ... outros status
};

export const LEVEL_HIERARCHY = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
```

#### Sistema de Quests
```javascript
// lib/questSystem.js
export const generateDailyQuests = (playerStats, day) => {
  // Gera 15 quests baseadas no perfil do jogador
};
```

### PWA Features

#### Manifest (manifest.json)
```json
{
  "name": "Quest Supremacy IRL",
  "short_name": "QuestIRL",
  "description": "Transforme sua vida em um RPG épico",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#b00020",
  "icons": [...]
}
```

#### Service Worker (sw.js)
- Cache de recursos estáticos
- Funcionamento offline
- Estratégia cache-first para assets
- Network-first para APIs

## 🎨 Design System

### Paleta de Cores
```css
:root {
  --color-background: #0a0a0a;      /* Preto profundo */
  --color-primary: #b00020;         /* Vermelho sangue */
  --color-secondary: #d4af37;       /* Dourado */
  --color-text: #f5f5f5;           /* Branco gelo */
  --color-muted: #6b7280;          /* Cinza médio */
}
```

### Tipografia
```css
.manhwa-title {
  font-family: 'Cinzel', serif;     /* Títulos épicos */
  font-weight: 700;
}

.manhwa-subtitle {
  font-family: 'Oswald', sans-serif; /* Subtítulos */
  font-weight: 600;
}

.manhwa-text {
  font-family: 'Inter', sans-serif;  /* Texto corpo */
}
```

### Componentes Estilizados
- **Cards**: Bordas vermelhas, fundo translúcido
- **Botões**: Gradientes vermelho→dourado
- **Barras de Progresso**: Shimmer effect
- **Inputs**: Tema dark com bordas coloridas

## 🔐 Segurança

### Backend
- **Hash de Senhas**: Werkzeug PBKDF2
- **Sessões Seguras**: Cookies HttpOnly
- **CORS**: Configurado para domínios específicos
- **Validação**: Input validation em todas as APIs
- **SQL Injection**: Prevenção via SQLAlchemy ORM

### Frontend
- **XSS**: Prevenção via React (escape automático)
- **CSRF**: Proteção via SameSite cookies
- **HTTPS**: Obrigatório em produção
- **Content Security Policy**: Headers de segurança

## 📊 Performance

### Backend
- **Gunicorn**: Servidor WSGI multi-worker
- **Connection Pooling**: SQLAlchemy
- **JSON Responses**: Serialização otimizada
- **Error Handling**: Logs estruturados

### Frontend
- **Code Splitting**: Vite automático
- **Tree Shaking**: Remoção de código não usado
- **Asset Optimization**: Compressão automática
- **Service Worker**: Cache inteligente
- **Lazy Loading**: Componentes sob demanda

## 🧪 Testes

### Backend
```python
# Teste básico de criação da aplicação
from src.main_prod import create_app
app = create_app()
assert app is not None
```

### Frontend
```javascript
// Testes de build
npm run build
# Verifica se dist/ foi criado com sucesso
```

### CI/CD (GitHub Actions)
- Testes automáticos em push/PR
- Build verification
- Deploy notifications

## 🔄 Fluxo de Dados

### Autenticação
```
1. User → Frontend: Credenciais
2. Frontend → Backend: POST /api/auth/login
3. Backend → Database: Verificar usuário
4. Backend → Frontend: Set-Cookie + user data
5. Frontend: Armazenar estado do usuário
```

### Sistema de Jogo
```
1. Frontend → Backend: GET /api/game/player-stats
2. Backend → Database: Buscar dados do usuário
3. Backend → Frontend: JSON com status
4. Frontend: Renderizar interface
5. User: Completar quest
6. Frontend → Backend: POST /api/game/daily-quests
7. Backend → Database: Atualizar progresso
```

## 🚀 Deploy e DevOps

### Ambientes
- **Desenvolvimento**: Local (SQLite + Vite dev server)
- **Produção**: Render + Vercel (PostgreSQL + CDN)

### CI/CD Pipeline
```
Git Push → GitHub Actions → Tests → Deploy Notification
    ↓                                      ↓
Render Auto-Deploy              Vercel Auto-Deploy
    ↓                                      ↓
Backend Live                    Frontend Live
```

### Monitoramento
- **Health Checks**: `/health` endpoint
- **Logs**: Render dashboard
- **Analytics**: Vercel analytics
- **Error Tracking**: Console logs

## 📈 Escalabilidade

### Backend
- **Horizontal**: Adicionar mais workers Gunicorn
- **Database**: PostgreSQL com connection pooling
- **Cache**: Redis (futuro)
- **CDN**: Para assets estáticos

### Frontend
- **CDN Global**: Vercel Edge Network
- **Service Worker**: Cache distribuído
- **Code Splitting**: Carregamento sob demanda
- **Image Optimization**: Vercel automático

## 🔮 Roadmap Técnico

### Próximas Implementações
1. **Sistema de Notificações Push**
2. **Modo Offline Completo**
3. **Sincronização de Dados**
4. **Analytics Avançados**
5. **Temas Customizáveis**
6. **API Rate Limiting**
7. **Backup Automático**
8. **Multi-idioma (i18n)**

---

**Quest Supremacy IRL** - Arquitetura robusta para uma jornada épica! ⚔️✨
