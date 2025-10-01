# Quest Supremacy IRL - Full Stack PWA

## 🎮 Sobre o Projeto

Quest Supremacy IRL é um Progressive Web App (PWA) gamificado que transforma a vida real em um RPG épico. O sistema permite aos usuários criar contas, fazer login, e gerenciar seu desenvolvimento pessoal através de um sistema de quests, níveis e conquistas.

## 🏗️ Arquitetura

### Backend (Flask)
- **Framework**: Flask com SQLAlchemy
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação**: Sistema de sessões com cookies seguros
- **APIs**: RESTful endpoints para autenticação e dados do jogo

### Frontend (React)
- **Framework**: React 18 com Vite
- **UI**: Tailwind CSS + Shadcn/UI
- **Tema**: Manhwa dark com paleta vermelho/dourado
- **PWA**: Service Workers, manifest, notificações

## 🚀 Deploy

### Render (Backend)
- Deploy automático via GitHub
- Banco PostgreSQL gerenciado
- Variáveis de ambiente configuradas

### Vercel (Frontend)
- Deploy automático via GitHub
- CDN global
- HTTPS automático

### Dashboard
- Monitoramento de performance
- Analytics de usuário
- Logs centralizados

## 📁 Estrutura do Projeto

```
quest-supremacy-fullstack/
├── backend/
│   └── quest_supremacy_api/
│       ├── src/
│       │   ├── main.py              # Aplicação Flask principal
│       │   ├── models/
│       │   │   └── user.py          # Modelos de dados
│       │   └── routes/
│       │       ├── auth.py          # Rotas de autenticação
│       │       └── game.py          # Rotas do jogo
│       ├── requirements.txt         # Dependências Python
│       └── render.yaml             # Configuração Render
├── frontend/
│   └── quest-supremacy-frontend/
│       ├── src/
│       │   ├── App.jsx             # Componente principal
│       │   ├── App.css             # Estilos manhwa
│       │   └── lib/
│       │       └── api.js          # Cliente API
│       ├── public/
│       │   ├── manifest.json       # Manifest PWA
│       │   └── sw.js              # Service Worker
│       ├── package.json
│       └── vercel.json            # Configuração Vercel
└── README.md
```

## 🛠️ Desenvolvimento Local

### Backend
```bash
cd backend/quest_supremacy_api
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python src/main.py
```

### Frontend
```bash
cd frontend/quest-supremacy-frontend
pnpm install
pnpm run dev
```

## 🌐 URLs de Deploy

- **Frontend (Vercel)**: https://quest-supremacy-irl.vercel.app
- **Backend (Render)**: https://quest-supremacy-api.onrender.com
- **GitHub**: https://github.com/usuario/quest-supremacy-irl

## 🔧 Variáveis de Ambiente

### Backend (.env)
```
FLASK_ENV=production
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://quest-supremacy-irl.vercel.app
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=https://quest-supremacy-api.onrender.com
```

## 📱 Funcionalidades PWA

- ✅ Instalação como app nativo
- ✅ Funcionamento offline
- ✅ Notificações push
- ✅ Ícones e splash screens
- ✅ Manifest configurado

## 🎨 Design System

### Paleta de Cores
- **Primária**: Vermelho Sangue (#b00020)
- **Secundária**: Dourado (#d4af37)
- **Background**: Preto (#0a0a0a)
- **Texto**: Branco Gelo (#f5f5f5)

### Tipografia
- **Títulos**: Cinzel (manhwa style)
- **Corpo**: Oswald
- **UI**: Inter

## 🔐 Segurança

- Senhas hasheadas com Werkzeug
- Sessões seguras com cookies HttpOnly
- CORS configurado para domínios específicos
- Validação de entrada em todas as APIs
- Rate limiting implementado

## 📊 Monitoramento

- Logs estruturados
- Métricas de performance
- Alertas de erro
- Analytics de usuário

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Quest Supremacy IRL** - Transforme sua vida em uma aventura épica! ⚔️✨
