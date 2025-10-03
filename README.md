# Quest Supremacy IRL - Aplicação PWA Completa

Uma aplicação PWA (Progressive Web App) gamificada para desenvolvimento pessoal, inspirada em manhwas de RPG. Os usuários podem criar contas, acompanhar estatísticas pessoais e completar quests diárias para evoluir seus atributos da vida real.

## 🚀 Tecnologias Utilizadas

### Backend
- **Flask** - Framework web Python
- **Flask-CORS** - Gerenciamento de CORS
- **JSON** - Armazenamento de dados simples
- **Render** - Plataforma de deploy

### Frontend
- **React 18** - Biblioteca JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Vercel** - Plataforma de deploy

## 📁 Estrutura do Projeto

```
quest-supremacy-irl/
├── backend/
│   ├── main.py              # Aplicação Flask principal
│   ├── requirements.txt     # Dependências Python
│   └── render.yaml         # Configuração de deploy Render
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Componente principal React
│   │   ├── App.css         # Estilos da aplicação
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML principal
│   ├── package.json        # Dependências Node.js
│   └── vite.config.js      # Configuração Vite
└── README.md               # Este arquivo
```

## 🛠️ Configuração e Instalação

### Backend (Flask)

1. **Navegue para o diretório backend:**
   ```bash
   cd backend
   ```

2. **Crie um ambiente virtual:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute localmente:**
   ```bash
   python main.py
   ```
   O backend estará disponível em `http://localhost:5000`

### Frontend (React)

1. **Navegue para o diretório frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   pnpm run dev --host
   # ou
   npm run dev -- --host
   ```
   O frontend estará disponível em `http://localhost:5173`

## 🚀 Deploy

### Backend no Render

1. **Conecte seu repositório GitHub ao Render**
2. **Configure as seguintes variáveis:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python main.py`
   - **Environment:** Python 3.11+

3. **Variáveis de ambiente (opcionais):**
   - `SECRET_KEY` - Chave secreta para sessões (padrão: auto-gerada)
   - `PORT` - Porta do servidor (padrão: 5000)

### Frontend no Vercel

1. **Conecte seu repositório GitHub ao Vercel**
2. **Configure o diretório raiz como `frontend`**
3. **Build Command:** `pnpm run build` ou `npm run build`
4. **Output Directory:** `dist`

**⚠️ IMPORTANTE:** Após fazer deploy do backend, atualize a variável `API_BASE_URL` no arquivo `frontend/src/App.jsx` com a URL do seu backend no Render.

## 🎮 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login/logout
- ✅ Sessões persistentes
- ✅ Validação de dados

### Sistema de RPG
- ✅ 10 atributos diferentes (Força, Saúde Mental, Inteligência, etc.)
- ✅ Sistema de níveis (F, E, D, C, B, A, S, SS, SSS)
- ✅ Experiência (XP) e progressão
- ✅ Quests diárias

### Interface
- ✅ Design dark inspirado em manhwas
- ✅ Gradientes vermelho/laranja
- ✅ Responsivo (mobile-first)
- ✅ Componentes UI modernos
- ✅ Animações suaves

## 🔧 Configurações Importantes

### CORS
O backend está configurado com CORS permissivo para desenvolvimento. Para produção, recomenda-se restringir as origens:

```python
CORS(app, 
     origins=[
         'https://seu-dominio-vercel.app',
         'http://localhost:5173'  # apenas para desenvolvimento
     ],
     supports_credentials=True)
```

### Armazenamento de Dados
Atualmente utiliza arquivo JSON local (`users_data.json`). Para produção, considere migrar para:
- PostgreSQL
- MongoDB
- SQLite com backup automático

## 🐛 Solução de Problemas

### Erro "Failed to fetch"
- Verifique se o backend está rodando
- Confirme a URL do backend no frontend
- Verifique configurações de CORS

### Erro de CORS
- Certifique-se de que `supports_credentials=True` está configurado
- Verifique se o frontend está usando `credentials: 'include'`

### Problemas de Build
- Limpe o cache: `rm -rf node_modules package-lock.json && npm install`
- Verifique versões do Node.js (recomendado: 18+)

## 📝 Próximos Passos

### Melhorias Sugeridas
1. **Banco de dados real** (PostgreSQL/MongoDB)
2. **Sistema de achievements** mais robusto
3. **Notificações push** para quests
4. **Modo offline** (PWA completo)
5. **Dashboard de estatísticas** avançado
6. **Sistema de amigos/ranking**
7. **Integração com wearables** (Fitbit, Apple Watch)

### Segurança
1. **Rate limiting** para APIs
2. **Validação de entrada** mais rigorosa
3. **Criptografia de senhas** com salt
4. **JWT tokens** em vez de sessões simples
5. **HTTPS obrigatório** em produção

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação das tecnologias utilizadas
- Verifique os logs do servidor para debugging

---

**Desenvolvido com ❤️ para gamificar o desenvolvimento pessoal**
