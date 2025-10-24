#!/usr/bin/env python3
"""
Script para popular o banco de dados com dados de exemplo
"""

from portfolio_app.models import Category, Project, ProjectImage, PortfolioSettings
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bitlab_portfolio.settings')
django.setup()


def create_categories():
    """Cria categorias padrão"""
    categories = [
        {'name': 'Web Design', 'slug': 'web-design', 'color': '#ea532e'},
        {'name': 'Branding', 'slug': 'branding', 'color': '#0096ff'},
        {'name': 'E-commerce', 'slug': 'e-commerce', 'color': '#00ff88'},
        {'name': 'Sistemas', 'slug': 'sistemas', 'color': '#ff6b35'},
        {'name': 'UI/UX', 'slug': 'ui-ux', 'color': '#8b5cf6'},
        {'name': 'Motion', 'slug': 'motion', 'color': '#f59e0b'},
    ]

    for cat_data in categories:
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        if created:
            print(f"Categoria criada: {category.name}")
        else:
            print(f"Categoria ja existe: {category.name}")


def create_sample_projects():
    """Cria projetos de exemplo"""
    projects_data = [
        {
            'title': 'CasaClick',
            'slug': 'casaclick',
            'category_slug': 'sistemas',
            'description': 'Plataforma completa de gestão imobiliária com interface moderna e funcionalidades avançadas para corretores e clientes.',
            'short_description': 'Sistema imersivo para imobiliárias com interface moderna e funcionalidades avançadas.',
            'tags': ['WEB DESIGN', 'UI/UX', 'SISTEMA'],
            'featured': True,
            'status': 'published'
        },
        {
            'title': '8Bit Store',
            'slug': '8bit-store',
            'category_slug': 'e-commerce',
            'description': 'Loja online especializada em produtos geek e cultura pop, com design retrô e experiência de compra única.',
            'short_description': 'E-commerce com produtos geek e cultura pop, design retrô e experiência única.',
            'tags': ['E-COMMERCE', 'BRANDING', 'DESIGN'],
            'featured': True,
            'status': 'published'
        },
        {
            'title': 'Tech Platform',
            'slug': 'tech-platform',
            'category_slug': 'sistemas',
            'description': 'Plataforma de desenvolvimento web com APIs robustas e interface moderna para desenvolvedores e empresas.',
            'short_description': 'Plataforma de desenvolvimento web com APIs robustas e interface moderna.',
            'tags': ['WEB DEV', 'API', 'TECH'],
            'featured': False,
            'status': 'published'
        },
        {
            'title': 'Brand Identity',
            'slug': 'brand-identity',
            'category_slug': 'branding',
            'description': 'Desenvolvimento de identidade visual completa com animações e motion design para marcas inovadoras.',
            'short_description': 'Identidade visual completa com animações e motion design para marcas inovadoras.',
            'tags': ['BRANDING', 'MOTION', 'IDENTITY'],
            'featured': False,
            'status': 'published'
        }
    ]

    for proj_data in projects_data:
        try:
            category = Category.objects.get(slug=proj_data['category_slug'])

            project, created = Project.objects.get_or_create(
                slug=proj_data['slug'],
                defaults={
                    'title': proj_data['title'],
                    'category': category,
                    'description': proj_data['description'],
                    'short_description': proj_data['short_description'],
                    'tags': proj_data['tags'],
                    'featured': proj_data['featured'],
                    'status': proj_data['status']
                }
            )

            if created:
                print(f"Projeto criado: {project.title}")
            else:
                print(f"Projeto ja existe: {project.title}")

        except Category.DoesNotExist:
            print(f"Categoria nao encontrada: {proj_data['category_slug']}")


def create_portfolio_settings():
    """Cria configurações padrão do portfólio"""
    settings, created = PortfolioSettings.objects.get_or_create(
        pk=1,
        defaults={
            'auto_generate_thumbnails': True,
            'max_file_size_mb': 50,
            'allowed_image_formats': ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            'allowed_video_formats': ['mp4', 'webm', 'mov', 'avi']
        }
    )

    if created:
        print("Configuracoes do portfolio criadas")
    else:
        print("Configuracoes do portfolio ja existem")


def main():
    print("Iniciando populacao do banco de dados...")
    print("=" * 50)

    create_categories()
    print()

    create_sample_projects()
    print()

    create_portfolio_settings()
    print()

    print("Populacao do banco concluida!")
    print("\nProximos passos:")
    print("1. Execute: python manage.py runserver")
    print("2. Acesse: http://127.0.0.1:8000/admin/")
    print("3. Acesse: http://127.0.0.1:8000/admin/ (painel administrativo)")


if __name__ == "__main__":
    main()
