from django.urls import path
from . import views

urlpatterns = [
    # Páginas principais
    path('', views.home, name='home'),
    path('test/', views.test, name='test'),
    path('portfolio/', views.portfolio, name='portfolio'),
    path('admin/', views.admin_panel, name='admin_panel'),

    # APIs
    path('api/portfolio/', views.portfolio_api, name='portfolio_api'),
    path('api/projects/', views.projects_api, name='projects_api'),
    path('api/projects/<uuid:project_id>/',
         views.project_detail_api, name='project_detail_api'),
    path('api/upload/', views.upload_media_api, name='upload_media_api'),
    path('api/media/<path:media_path>/',
         views.delete_media_api, name='delete_media_api'),
    path('api/generate-html/', views.generate_portfolio_html,
         name='generate_portfolio_html'),
]
