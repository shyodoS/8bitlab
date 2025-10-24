#!/bin/bash

# Script para inicializar o projeto Django com Docker

echo "🐳 Iniciando configuração do projeto Django com Docker..."

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes antigos (opcional - descomente se quiser limpar dados)
# echo "🗑️ Removendo volumes antigos..."
# docker-compose down -v

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar o banco de dados estar pronto
echo "⏳ Aguardando banco de dados..."
sleep 10

# Executar migrações
echo "📊 Executando migrações..."
docker-compose exec web python manage.py migrate

# Criar superusuário (opcional)
echo "👤 Criando superusuário..."
docker-compose exec web python manage.py createsuperuser --noinput --username admin --email admin@example.com || echo "Superusuário já existe ou erro na criação"

# Coletar arquivos estáticos
echo "📁 Coletando arquivos estáticos..."
docker-compose exec web python manage.py collectstatic --noinput

echo "✅ Configuração concluída!"
echo "🌐 Acesse: http://localhost:8000"
echo "👨‍💼 Admin: http://localhost:8000/admin"
echo ""
echo "📋 Comandos úteis:"
echo "  docker-compose up -d          # Iniciar containers"
echo "  docker-compose down           # Parar containers"
echo "  docker-compose logs web       # Ver logs da aplicação"
echo "  docker-compose exec web bash # Acessar container da aplicação"
