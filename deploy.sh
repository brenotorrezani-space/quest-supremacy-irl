#!/bin/bash

# Script de deploy para Quest Supremacy IRL
# Uso: ./deploy.sh [backend|frontend|all]

set -e

echo "🚀 Quest Supremacy IRL - Deploy Script"
echo "======================================"

# Função para deploy do backend
deploy_backend() {
    echo "📦 Fazendo deploy do backend..."
    
    if [ ! -f "backend/main.py" ]; then
        echo "❌ Erro: Arquivo backend/main.py não encontrado!"
        exit 1
    fi
    
    echo "✅ Backend pronto para deploy no Render"
    echo "   1. Conecte seu repositório GitHub ao Render"
    echo "   2. Configure Build Command: pip install -r requirements.txt"
    echo "   3. Configure Start Command: python main.py"
    echo "   4. Defina Environment: Python 3.11+"
}

# Função para deploy do frontend
deploy_frontend() {
    echo "🌐 Fazendo deploy do frontend..."
    
    if [ ! -f "frontend/package.json" ]; then
        echo "❌ Erro: Arquivo frontend/package.json não encontrado!"
        exit 1
    fi
    
    cd frontend
    
    # Instalar dependências se não existirem
    if [ ! -d "node_modules" ]; then
        echo "📥 Instalando dependências..."
        if command -v pnpm &> /dev/null; then
            pnpm install
        else
            npm install
        fi
    fi
    
    # Build do projeto
    echo "🔨 Fazendo build do projeto..."
    if command -v pnpm &> /dev/null; then
        pnpm run build
    else
        npm run build
    fi
    
    cd ..
    
    echo "✅ Frontend pronto para deploy no Vercel"
    echo "   1. Conecte seu repositório GitHub ao Vercel"
    echo "   2. Configure Root Directory: frontend"
    echo "   3. Build Command: pnpm run build (ou npm run build)"
    echo "   4. Output Directory: dist"
    echo ""
    echo "⚠️  IMPORTANTE: Atualize a variável API_BASE_URL no App.jsx"
    echo "   com a URL do seu backend no Render!"
}

# Função para verificar dependências
check_dependencies() {
    echo "🔍 Verificando dependências..."
    
    # Verificar Python
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 não encontrado! Instale Python 3.8+"
        exit 1
    fi
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js não encontrado! Instale Node.js 18+"
        exit 1
    fi
    
    echo "✅ Dependências verificadas"
}

# Função principal
main() {
    check_dependencies
    
    case "${1:-all}" in
        "backend")
            deploy_backend
            ;;
        "frontend")
            deploy_frontend
            ;;
        "all")
            deploy_backend
            echo ""
            deploy_frontend
            ;;
        *)
            echo "❌ Uso: $0 [backend|frontend|all]"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 Deploy concluído com sucesso!"
    echo "📚 Consulte o README.md para mais informações"
}

# Executar função principal
main "$@"
