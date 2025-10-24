from django.contrib import admin
from .models import Project, Category, ProjectImage, ProjectVideo, PortfolioSettings


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 0
    fields = ['image', 'title', 'alt_text', 'is_main', 'order']


class ProjectVideoInline(admin.TabularInline):
    model = ProjectVideo
    extra = 0
    fields = ['video', 'title', 'description', 'thumbnail', 'order']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status',
                    'featured', 'order', 'created_at']
    list_filter = ['status', 'featured', 'category', 'created_at']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProjectImageInline, ProjectVideoInline]
    list_editable = ['status', 'featured', 'order']

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('title', 'slug', 'category', 'status', 'featured', 'order')
        }),
        ('Conteúdo', {
            'fields': ('description', 'short_description', 'tags')
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at', 'updated_at']


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ['project', 'title', 'is_main', 'order', 'uploaded_at']
    list_filter = ['is_main', 'uploaded_at']
    search_fields = ['project__title', 'title']
    list_editable = ['is_main', 'order']


@admin.register(ProjectVideo)
class ProjectVideoAdmin(admin.ModelAdmin):
    list_display = ['project', 'title', 'file_size_mb', 'order', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['project__title', 'title']
    list_editable = ['order']


@admin.register(PortfolioSettings)
class PortfolioSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Configurações de Upload', {
            'fields': ('auto_generate_thumbnails', 'max_file_size_mb')
        }),
        ('Formatos Permitidos', {
            'fields': ('allowed_image_formats', 'allowed_video_formats')
        }),
    )

    def has_add_permission(self, request):
        # Só permite uma instância de configurações
        return not PortfolioSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
