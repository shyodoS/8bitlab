from django.db import models
from django.utils import timezone
from django.core.validators import FileExtensionValidator


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    color = models.CharField(max_length=7, default='#ea532e')  # Hex color
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Project(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('published', 'Publicado'),
        ('archived', 'Arquivado'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='projects')
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    tags = models.JSONField(default=list, blank=True)
    featured = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='draft')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    @property
    def main_image(self):
        """Retorna a imagem principal do projeto"""
        return self.images.filter(is_main=True).first() or self.images.first()

    @property
    def thumbnail(self):
        """Retorna o thumbnail do projeto"""
        main_img = self.main_image
        return main_img.thumbnail if main_img else None


class MediaFile(models.Model):
    MEDIA_TYPES = [
        ('image', 'Imagem'),
        ('video', 'Vídeo'),
    ]

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='media_files')
    file = models.FileField(
        upload_to='portfolio/%Y/%m/',
        validators=[
            FileExtensionValidator(
                allowed_extensions=['jpg', 'jpeg', 'png',
                                    'webp', 'gif', 'mp4', 'webm', 'mov', 'avi']
            )
        ]
    )
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'uploaded_at']

    def __str__(self):
        return f"{self.project.title} - {self.title or self.file.name}"

    @property
    def thumbnail(self):
        """Retorna o thumbnail se for imagem"""
        if self.media_type == 'image':
            return self.file.url
        return None

    @property
    def file_size_mb(self):
        """Retorna o tamanho do arquivo em MB"""
        try:
            return round(self.file.size / (1024 * 1024), 2)
        except:
            return 0


class ProjectImage(models.Model):
    """Modelo específico para imagens do projeto"""
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(
        upload_to='portfolio/images/%Y/%m/',
        validators=[FileExtensionValidator(
            allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'gif'])]
    )
    title = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'uploaded_at']

    def __str__(self):
        return f"{self.project.title} - {self.title or self.image.name}"

    @property
    def thumbnail(self):
        """Retorna o thumbnail da imagem"""
        return self.image.url


class ProjectVideo(models.Model):
    """Modelo específico para vídeos do projeto"""
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='videos')
    video = models.FileField(
        upload_to='portfolio/videos/%Y/%m/',
        validators=[FileExtensionValidator(
            allowed_extensions=['mp4', 'webm', 'mov', 'avi'])]
    )
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    thumbnail = models.ImageField(
        upload_to='portfolio/thumbnails/%Y/%m/',
        blank=True,
        null=True
    )
    order = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'uploaded_at']

    def __str__(self):
        return f"{self.project.title} - {self.title or self.video.name}"

    @property
    def file_size_mb(self):
        """Retorna o tamanho do arquivo em MB"""
        try:
            return round(self.video.size / (1024 * 1024), 2)
        except:
            return 0


class PortfolioSettings(models.Model):
    """Configurações do portfólio"""
    auto_generate_thumbnails = models.BooleanField(default=True)
    max_file_size_mb = models.PositiveIntegerField(default=50)
    allowed_image_formats = models.JSONField(default=list)
    allowed_video_formats = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Portfolio Settings'
        verbose_name_plural = 'Portfolio Settings'

    def save(self, *args, **kwargs):
        if not self.pk and PortfolioSettings.objects.exists():
            # Se já existe uma instância, não criar nova
            return
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """Retorna as configurações do portfólio"""
        settings, created = cls.objects.get_or_create(pk=1)
        if created:
            # Configurações padrão
            settings.allowed_image_formats = [
                'jpg', 'jpeg', 'png', 'webp', 'gif']
            settings.allowed_video_formats = ['mp4', 'webm', 'mov', 'avi']
            settings.save()
        return settings
