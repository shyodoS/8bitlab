from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import json
import os
from .models import Project, Category, ProjectImage, ProjectVideo, PortfolioSettings
from .serializers import ProjectSerializer, CategorySerializer


def home(request):
    """Página inicial"""
    return render(request, 'index.html')


def test(request):
    """Página de teste"""
    return render(request, 'test.html')


def portfolio(request):
    """Página de portfólio"""
    projects = Project.objects.filter(
        status='published').order_by('order', '-created_at')
    categories = Category.objects.all().order_by('name')

    context = {
        'projects': projects,
        'categories': categories,
    }
    return render(request, 'portfolio/portfolio.html', context)


def admin_panel(request):
    """Renderiza o painel administrativo"""
    return render(request, 'admin.html')


@csrf_exempt
@require_http_methods(["GET", "POST"])
def portfolio_api(request):
    """API para gerenciar dados do portfólio"""
    if request.method == 'GET':
        projects = Project.objects.filter(
            status='published').order_by('order', '-created_at')
        categories = Category.objects.all().order_by('name')
        settings = PortfolioSettings.get_settings()

        data = {
            'projects': [
                {
                    'id': str(project.id),
                    'title': project.title,
                    'slug': project.slug,
                    'category': project.category.slug,
                    'description': project.description,
                    'short_description': project.short_description,
                    'tags': project.tags,
                    'featured': project.featured,
                    'status': project.status,
                    'order': project.order,
                    'created_at': project.created_at.isoformat(),
                    'updated_at': project.updated_at.isoformat(),
                    'images': [
                        {
                            'id': str(img.id),
                            'filename': os.path.basename(img.image.name),
                            'path': img.image.url,
                            'title': img.title,
                            'alt_text': img.alt_text,
                            'is_main': img.is_main,
                            'order': img.order,
                            'uploaded_at': img.uploaded_at.isoformat()
                        }
                        for img in project.images.all()
                    ],
                    'videos': [
                        {
                            'id': str(vid.id),
                            'filename': os.path.basename(vid.video.name),
                            'path': vid.video.url,
                            'title': vid.title,
                            'description': vid.description,
                            'thumbnail': vid.thumbnail.url if vid.thumbnail else None,
                            'order': vid.order,
                            'file_size_mb': vid.file_size_mb,
                            'uploaded_at': vid.uploaded_at.isoformat()
                        }
                        for vid in project.videos.all()
                    ],
                    'main_image': project.main_image.image.url if project.main_image else None,
                    'thumbnail': project.thumbnail
                }
                for project in projects
            ],
            'categories': [
                {
                    'id': str(cat.id),
                    'name': cat.name,
                    'slug': cat.slug,
                    'color': cat.color,
                    'description': cat.description
                }
                for cat in categories
            ],
            'settings': {
                'auto_generate_thumbnails': settings.auto_generate_thumbnails,
                'max_file_size_mb': settings.max_file_size_mb,
                'allowed_image_formats': settings.allowed_image_formats,
                'allowed_video_formats': settings.allowed_video_formats
            }
        }

        return JsonResponse(data)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Aqui você pode implementar a lógica para salvar dados
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def projects_api(request):
    """API para gerenciar projetos"""
    if request.method == 'GET':
        projects = Project.objects.all().order_by('order', '-created_at')
        data = [ProjectSerializer.serialize(project) for project in projects]
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Criar categoria se não existir
            category_slug = data.get('category')
            category, created = Category.objects.get_or_create(
                slug=category_slug,
                defaults={'name': category_slug.title(), 'color': '#ea532e'}
            )

            # Criar projeto
            project = Project.objects.create(
                title=data.get('title'),
                slug=data.get('title').lower().replace(' ', '-'),
                category=category,
                description=data.get('description', ''),
                short_description=data.get('short_description', ''),
                tags=data.get('tags', []),
                featured=data.get('featured', False),
                status=data.get('status', 'draft')
            )

            data = ProjectSerializer.serialize(project)
            return JsonResponse(data, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def project_detail_api(request, project_id):
    """API para gerenciar um projeto específico"""
    project = get_object_or_404(Project, id=project_id)

    if request.method == 'GET':
        data = ProjectSerializer.serialize(project)
        return JsonResponse(data)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)

            # Atualizar campos
            project.title = data.get('title', project.title)
            project.description = data.get('description', project.description)
            project.short_description = data.get(
                'short_description', project.short_description)
            project.tags = data.get('tags', project.tags)
            project.featured = data.get('featured', project.featured)
            project.status = data.get('status', project.status)

            # Atualizar categoria se fornecida
            if 'category' in data:
                category_slug = data['category']
                category, created = Category.objects.get_or_create(
                    slug=category_slug,
                    defaults={'name': category_slug.title(),
                              'color': '#ea532e'}
                )
                project.category = category

            project.save()

            data = ProjectSerializer.serialize(project)
            return JsonResponse(data)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        project.delete()
        return JsonResponse({'status': 'deleted'})


@csrf_exempt
@require_http_methods(["POST"])
def upload_media_api(request):
    """API para upload de mídia"""
    if request.method == 'POST':
        try:
            file = request.FILES.get('file')
            project_id = request.POST.get('project_id')
            media_type = request.POST.get('type', 'image')

            if not file:
                return JsonResponse({'error': 'Nenhum arquivo fornecido'}, status=400)

            if not project_id:
                return JsonResponse({'error': 'ID do projeto não fornecido'}, status=400)

            project = get_object_or_404(Project, id=project_id)

            # Validar tamanho do arquivo
            settings_obj = PortfolioSettings.get_settings()
            file_size_mb = file.size / (1024 * 1024)
            if file_size_mb > settings_obj.max_file_size_mb:
                return JsonResponse({
                    'error': f'Arquivo muito grande. Máximo: {settings_obj.max_file_size_mb}MB'
                }, status=400)

            # Salvar arquivo baseado no tipo
            if media_type == 'image':
                project_image = ProjectImage.objects.create(
                    project=project,
                    image=file,
                    title=file.name
                )

                return JsonResponse({
                    'id': str(project_image.id),
                    'filename': os.path.basename(project_image.image.name),
                    'path': project_image.image.url,
                    'title': project_image.title,
                    'is_main': project_image.is_main,
                    'uploaded_at': project_image.uploaded_at.isoformat()
                })

            elif media_type == 'video':
                project_video = ProjectVideo.objects.create(
                    project=project,
                    video=file,
                    title=file.name
                )

                return JsonResponse({
                    'id': str(project_video.id),
                    'filename': os.path.basename(project_video.video.name),
                    'path': project_video.video.url,
                    'title': project_video.title,
                    'file_size_mb': project_video.file_size_mb,
                    'uploaded_at': project_video.uploaded_at.isoformat()
                })

            else:
                return JsonResponse({'error': 'Tipo de mídia inválido'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_media_api(request, media_path):
    """API para deletar mídia"""
    try:
        # Decodificar o caminho
        decoded_path = media_path.replace('%2F', '/')

        # Procurar e deletar o arquivo
        project_image = ProjectImage.objects.filter(
            image__icontains=decoded_path).first()
        if project_image:
            project_image.delete()
            return JsonResponse({'status': 'deleted'})

        project_video = ProjectVideo.objects.filter(
            video__icontains=decoded_path).first()
        if project_video:
            project_video.delete()
            return JsonResponse({'status': 'deleted'})

        return JsonResponse({'error': 'Arquivo não encontrado'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def generate_portfolio_html(request):
    """Gera HTML do portfólio para o carrossel"""
    projects = Project.objects.filter(
        status='published').order_by('order', '-created_at')

    html_parts = []
    for i, project in enumerate(projects):
        main_image = project.main_image
        image_url = main_image.image.url if main_image else ''

        tags_html = ''.join(
            [f'<span class="tag">{tag}</span>' for tag in project.tags])

        project_html = f'''
        <div class="portfolio-card" data-category="{project.category.slug}">
            <div class="card-image">
                <img src="{image_url}" alt="{project.title}" loading="lazy" />
                <div class="card-overlay">
                    <div class="overlay-content">
                        <div class="project-number">{(i + 1):02d}</div>
                        <h3 class="project-title">{project.title}</h3>
                        <p class="project-category">{project.category.name.upper()}</p>
                        <p class="project-description">{project.short_description}</p>
                        <div class="project-tags">
                            {tags_html}
                        </div>
                        <a href="portfolio.html" class="project-link">VER PORTFÓLIO →</a>
                    </div>
                </div>
            </div>
        </div>
        '''

        html_parts.append(project_html)

    return HttpResponse('\n'.join(html_parts))
