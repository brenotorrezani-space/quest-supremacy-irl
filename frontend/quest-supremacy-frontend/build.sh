#!/bin/bash

# Script de build para produção
echo "🚀 Iniciando build do Quest Supremacy IRL Frontend..."

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install

# Fazer build
echo "🔨 Fazendo build para produção..."
pnpm run build

# Verificar se build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Arquivos de produção em: ./dist/"
    ls -la dist/
else
    echo "❌ Erro no build!"
    exit 1
fi

echo "🎮 Quest Supremacy IRL Frontend pronto para deploy!"
