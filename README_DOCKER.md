# 🐳 Configuração Docker - BitLab Portfolio

Este documento explica como configurar e executar o projeto BitLab Portfolio usando Docker.

## 📋 Pré-requisitos

- Docker instalado
- Docker Compose instalado

## 🚀 Início Rápido

### 1. Configuração Automática

Execute o script de configuração:

```bash
# No Windows (PowerShell)
.\docker-setup.sh

# No Linux/Mac
chmod +x docker-setup.sh
./docker-setup.sh
```

### 2. Configuração Manual

```bash
# Construir e iniciar containers
docker-compose up --build -d

# Executar migrações
docker-compose exec web python manage.py migrate

# Criar superusuário (opcional)
docker-compose exec web python manage.py createsuperuser

# Coletar arquivos estáticos
docker-compose exec web python manage.py collectstatic --noinput
```

## 🌐 Acesso

- **Aplicação**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin
- **Banco PostgreSQL**: localhost:5432

## 📁 Estrutura Docker

```
├── Dockerfile              # Configuração da imagem Django
├── docker-compose.yml      # Orquestração dos serviços
├── .dockerignore          # Arquivos ignorados no build
├── docker-setup.sh        # Script de configuração automática
└── requirements.txt       # Dependências Python
```

## 🔧 Serviços Configurados

### Web (Django)

- **Porta**: 8000
- **Imagem**: Baseada em Python 3.11-slim
- **Volumes**: Código fonte, arquivos estáticos e media

### Database (PostgreSQL)

- **Porta**: 5432
- **Banco**: bitlab_portfolio
- **Usuário**: postgres
- **Senha**: postgres

## 📝 Comandos Úteis

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs web
docker-compose logs db

# Acessar container da aplicação
docker-compose exec web bash

# Executar comandos Django
docker-compose exec web python manage.py shell
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate

# Reconstruir containers
docker-compose up --build

# Limpar volumes (remove dados do banco)
docker-compose down -v
```

## 🔒 Variáveis de Ambiente

O projeto usa as seguintes variáveis de ambiente:

- `DEBUG`: Modo debug (padrão: True)
- `SECRET_KEY`: Chave secreta do Django
- `ALLOWED_HOSTS`: Hosts permitidos
- `POSTGRES_DB`: Nome do banco de dados
- `POSTGRES_USER`: Usuário do banco
- `POSTGRES_PASSWORD`: Senha do banco
- `POSTGRES_HOST`: Host do banco (padrão: db)
- `POSTGRES_PORT`: Porta do banco (padrão: 5432)

## 🐛 Troubleshooting

### Problema: Container não inicia

```bash
# Verificar logs
docker-compose logs web

# Reconstruir sem cache
docker-compose build --no-cache
```

### Problema: Erro de conexão com banco

```bash
# Verificar se o banco está rodando
docker-compose ps

# Reiniciar apenas o banco
docker-compose restart db
```

### Problema: Migrações não executam

```bash
# Executar migrações manualmente
docker-compose exec web python manage.py migrate --run-syncdb
```

## 📊 Monitoramento

```bash
# Ver uso de recursos
docker stats

# Ver containers ativos
docker-compose ps

# Ver imagens
docker images
```

## 🔄 Desenvolvimento

Para desenvolvimento com hot-reload:

```bash
# O volume está configurado para sincronizar mudanças automaticamente
# Basta editar os arquivos e as mudanças serão refletidas no container
```

## 🚀 Produção

Para deploy em produção, considere:

1. Usar variáveis de ambiente seguras
2. Configurar HTTPS
3. Usar um servidor web (Nginx) como proxy reverso
4. Configurar backup do banco de dados
5. Usar secrets management
