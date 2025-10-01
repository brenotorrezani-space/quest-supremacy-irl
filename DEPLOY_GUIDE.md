# 🚀 Guia Completo de Deploy - Quest Supremacy IRL

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Render (render.com)
- Conta no Vercel (vercel.com)
- GitHub CLI instalado (opcional)

## 🔧 1. Deploy no GitHub

### Opção A: Via GitHub CLI (Recomendado)
```bash
# 1. Fazer login no GitHub CLI
gh auth login

# 2. Criar repositório e fazer push
cd quest-supremacy-fullstack
gh repo create quest-supremacy-irl --public --description "🎮 Quest Supremacy IRL - PWA Full-Stack que transforma sua vida em um RPG épico! ⚔️ React + Flask + PWA + Gamificação" --push
```

### Opção B: Via Interface Web
1. Acesse [github.com/new](https://github.com/new)
2. Nome: `quest-supremacy-irl`
3. Descrição: `🎮 Quest Supremacy IRL - PWA Full-Stack que transforma sua vida em um RPG épico! ⚔️`
4. Marque como **Público**
5. **NÃO** inicialize com README (já temos um)
6. Clique em "Create repository"

```bash
# Adicionar remote e fazer push
cd quest-supremacy-fullstack
git remote add origin https://github.com/SEU_USERNAME/quest-supremacy-irl.git
git push -u origin main
```

## 🖥️ 2. Deploy do Backend (Render)

### Passo 1: Conectar Repositório
1. Acesse [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte sua conta GitHub
4. Selecione o repositório `quest-supremacy-irl`

### Passo 2: Configurar Serviço
- **Name**: `quest-supremacy-api`
- **Environment**: `Python 3`
- **Build Command**: `cd backend/quest_supremacy_api && pip install -r requirements.txt`
- **Start Command**: `cd backend/quest_supremacy_api && gunicorn --bind 0.0.0.0:$PORT src.main_prod:app`
- **Instance Type**: `Free`

### Passo 3: Variáveis de Ambiente
Adicione as seguintes variáveis:
```
FLASK_ENV=production
SECRET_KEY=[Render gerará automaticamente]
CORS_ORIGINS=https://quest-supremacy-irl.vercel.app
```

### Passo 4: Banco de Dados PostgreSQL
1. Clique em "New +" → "PostgreSQL"
2. **Name**: `quest-supremacy-db`
3. **Database Name**: `quest_supremacy`
4. **User**: `quest_user`
5. Após criado, copie a `DATABASE_URL` e adicione nas variáveis do Web Service

## 🌐 3. Deploy do Frontend (Vercel)

### Passo 1: Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório `quest-supremacy-irl`

### Passo 2: Configurar Build
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend/quest-supremacy-frontend`
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### Passo 3: Variáveis de Ambiente
```
VITE_API_BASE_URL=https://quest-supremacy-api.onrender.com
```

### Passo 4: Deploy
1. Clique em "Deploy"
2. Aguarde o build completar
3. Sua aplicação estará disponível em: `https://quest-supremacy-irl.vercel.app`

## 🔄 4. Configurar CI/CD (GitHub Actions)

O arquivo `.github/workflows/deploy.yml` já está configurado e executará automaticamente:
- Testes do backend
- Build do frontend
- Notificações de deploy

## 🛠️ 5. Configurações Pós-Deploy

### Backend (Render)
1. Acesse o dashboard do Render
2. Vá em "Environment" → "Environment Variables"
3. Atualize `CORS_ORIGINS` com a URL real do Vercel:
   ```
   CORS_ORIGINS=https://quest-supremacy-irl.vercel.app,http://localhost:5173
   ```

### Frontend (Vercel)
1. Acesse o dashboard do Vercel
2. Vá em "Settings" → "Environment Variables"
3. Atualize `VITE_API_BASE_URL` com a URL real do Render:
   ```
   VITE_API_BASE_URL=https://quest-supremacy-api.onrender.com
   ```

## 📱 6. Configurar PWA

### Manifest e Service Worker
Os arquivos já estão configurados:
- `public/manifest.json` - Configurações do PWA
- `public/sw.js` - Service Worker para cache offline
- Ícones em `public/icon-*.png`

### Testar PWA
1. Acesse a aplicação no Chrome/Edge
2. Clique no ícone de "Instalar" na barra de endereços
3. Teste funcionalidade offline

## 🔍 7. Monitoramento e Logs

### Render (Backend)
- Logs: Dashboard → Logs
- Métricas: Dashboard → Metrics
- Health Check: `https://quest-supremacy-api.onrender.com/health`

### Vercel (Frontend)
- Analytics: Dashboard → Analytics
- Logs: Dashboard → Functions (se houver)
- Performance: Lighthouse integrado

## 🚨 8. Solução de Problemas

### Backend não inicia
```bash
# Verificar logs no Render
# Comum: problemas com dependências ou variáveis de ambiente
```

### Frontend não conecta com Backend
1. Verificar `VITE_API_BASE_URL` no Vercel
2. Verificar `CORS_ORIGINS` no Render
3. Testar endpoints: `https://quest-supremacy-api.onrender.com/health`

### PWA não instala
1. Verificar HTTPS (obrigatório)
2. Verificar `manifest.json`
3. Verificar Service Worker no DevTools

## 🎯 9. URLs Finais

Após o deploy completo:
- **Frontend**: `https://quest-supremacy-irl.vercel.app`
- **Backend**: `https://quest-supremacy-api.onrender.com`
- **GitHub**: `https://github.com/SEU_USERNAME/quest-supremacy-irl`
- **API Health**: `https://quest-supremacy-api.onrender.com/health`

## 🔄 10. Atualizações Futuras

### Deploy Automático
Qualquer push para a branch `main` acionará:
1. GitHub Actions (testes)
2. Render (rebuild automático do backend)
3. Vercel (rebuild automático do frontend)

### Deploy Manual
```bash
# Fazer mudanças
git add .
git commit -m "✨ Nova funcionalidade"
git push origin main
```

## 🎮 Pronto!

Seu **Quest Supremacy IRL** está agora rodando como um PWA profissional full-stack na nuvem! 

⚔️ **Que a jornada épica comece!** ✨
