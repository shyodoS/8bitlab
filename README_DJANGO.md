# 8Bit Lab - Sistema de Administração de Portfólio

Sistema completo de administração de portfólio desenvolvido com Django, incluindo painel administrativo web e API REST para gerenciamento de projetos, imagens e vídeos.

## 🚀 Funcionalidades

### Painel Administrativo

- ✅ **Gerenciamento de Projetos**: Criar, editar, deletar e organizar projetos
- ✅ **Upload de Mídia**: Suporte para imagens e vídeos com validação
- ✅ **Categorização**: Sistema de categorias personalizáveis
- ✅ **Configurações**: Ajustes de upload e formatos permitidos
- ✅ **Interface Responsiva**: Design moderno e adaptável

### API REST

- ✅ **Endpoints Completos**: CRUD para projetos, categorias e mídia
- ✅ **Upload de Arquivos**: API para upload de imagens e vídeos
- ✅ **Filtros e Busca**: Filtros por categoria, status e tags
- ✅ **CORS Habilitado**: Pronto para integração frontend

### Banco de Dados

- ✅ **Modelos Relacionais**: Projetos, categorias, imagens e vídeos
- ✅ **Validações**: Tamanho de arquivo, formatos permitidos
- ✅ **Admin Django**: Interface administrativa nativa
- ✅ **Migrações**: Sistema de versionamento do banco

## 📋 Pré-requisitos

- Python 3.8+
- Django 4.2+
- Pillow (para processamento de imagens)
- django-cors-headers

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd 8BITSITE
```

### 2. Crie e ative o ambiente virtual

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure o banco de dados

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Crie um superusuário

```bash
python manage.py createsuperuser
```

### 6. Popule o banco com dados de exemplo

```bash
python populate_data.py
```

### 7. Execute o servidor

```bash
python manage.py runserver
```

## 🌐 Acessos

- **Site Principal**: http://127.0.0.1:8000/
- **Admin Django**: http://127.0.0.1:8000/admin/
- **Painel Administrativo**: http://127.0.0.1:8000/admin/
- **API Portfolio**: http://127.0.0.1:8000/api/portfolio/

## 📁 Estrutura do Projeto

```
8BITSITE/
├── bitlab_portfolio/          # Configurações do Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── portfolio_app/             # App principal
│   ├── models.py              # Modelos do banco
│   ├── views.py               # Views e API
│   ├── admin.py               # Admin Django
│   ├── serializers.py         # Serializadores
│   └── urls.py                # URLs da app
├── templates/                 # Templates HTML
│   └── admin.html             # Painel administrativo
├── static/                    # Arquivos estáticos
│   ├── css/
│   ├── js/
│   └── img/
├── media/                     # Uploads de mídia
├── data/                      # Dados JSON (backup)
├── admin.py                   # Script Python standalone
├── populate_data.py           # Script de população
└── requirements.txt           # Dependências
```

## 🔧 API Endpoints

### Portfolio

- `GET /api/portfolio/` - Lista todos os dados do portfólio
- `POST /api/portfolio/` - Salva dados do portfólio

### Projetos

- `GET /api/projects/` - Lista todos os projetos
- `POST /api/projects/` - Cria novo projeto
- `GET /api/projects/{id}/` - Detalhes do projeto
- `PUT /api/projects/{id}/` - Atualiza projeto
- `DELETE /api/projects/{id}/` - Deleta projeto

### Mídia

- `POST /api/upload/` - Upload de arquivos
- `DELETE /api/media/{path}/` - Deleta arquivo

### HTML

- `GET /api/generate-html/` - Gera HTML do carrossel

## 📊 Modelos de Dados

### Project

- `title`: Título do projeto
- `slug`: URL amigável
- `category`: Categoria (FK)
- `description`: Descrição completa
- `short_description`: Descrição curta
- `tags`: Lista de tags (JSON)
- `featured`: Projeto em destaque
- `status`: draft/published/archived
- `order`: Ordem de exibição

### Category

- `name`: Nome da categoria
- `slug`: URL amigável
- `color`: Cor hexadecimal
- `description`: Descrição

### ProjectImage

- `project`: Projeto (FK)
- `image`: Arquivo de imagem
- `title`: Título da imagem
- `alt_text`: Texto alternativo
- `is_main`: Imagem principal
- `order`: Ordem de exibição

### ProjectVideo

- `project`: Projeto (FK)
- `video`: Arquivo de vídeo
- `title`: Título do vídeo
- `description`: Descrição
- `thumbnail`: Thumbnail do vídeo
- `order`: Ordem de exibição

## 🎨 Painel Administrativo

### Funcionalidades

1. **Dashboard**: Visão geral dos projetos
2. **Gerenciar Projetos**: CRUD completo
3. **Upload de Mídia**: Drag & drop para imagens/vídeos
4. **Categorias**: Gerenciar categorias
5. **Configurações**: Ajustes do sistema

### Recursos

- Interface responsiva
- Upload com drag & drop
- Preview de imagens
- Validação de arquivos
- Notificações toast
- Loading states

## 🔒 Segurança

- Validação de tipos de arquivo
- Limite de tamanho de upload
- Sanitização de dados
- CORS configurado
- CSRF protection

## 🚀 Deploy

### Produção

1. Configure `DEBUG = False`
2. Configure `ALLOWED_HOSTS`
3. Configure banco de dados PostgreSQL
4. Configure servidor web (Nginx + Gunicorn)
5. Configure arquivos estáticos

### Variáveis de Ambiente

```bash
SECRET_KEY=sua-chave-secreta
DEBUG=False
ALLOWED_HOSTS=seu-dominio.com
DATABASE_URL=postgresql://user:pass@host:port/db
```

## 📝 Uso

### 1. Acesse o painel administrativo

```
http://127.0.0.1:8000/admin/
```

### 2. Crie um projeto

- Clique em "Novo Projeto"
- Preencha os dados
- Faça upload de imagens/vídeos
- Salve o projeto

### 3. Configure categorias

- Acesse "Categorias"
- Crie novas categorias
- Defina cores e descrições

### 4. Gerencie mídia

- Acesse "Mídia"
- Visualize todos os arquivos
- Delete arquivos desnecessários

## 🐛 Troubleshooting

### Erro de Pillow

```bash
pip install Pillow
```

### Erro de CORS

```bash
pip install django-cors-headers
```

### Erro de migração

```bash
python manage.py makemigrations
python manage.py migrate
```

### Reset do banco

```bash
python manage.py flush
python populate_data.py
```

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do Django
2. Consulte a documentação do Django
3. Abra uma issue no repositório

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ pela 8Bit Lab**
