from .models import Project, Category, ProjectImage, ProjectVideo


class CategorySerializer:
    @staticmethod
    def serialize(category):
        return {
            'id': str(category.id),
            'name': category.name,
            'slug': category.slug,
            'color': category.color,
            'description': category.description
        }


class ProjectImageSerializer:
    @staticmethod
    def serialize(image):
        return {
            'id': str(image.id),
            'image': image.image.url,
            'title': image.title,
            'alt_text': image.alt_text,
            'is_main': image.is_main,
            'order': image.order,
            'uploaded_at': image.uploaded_at.isoformat()
        }


class ProjectVideoSerializer:
    @staticmethod
    def serialize(video):
        return {
            'id': str(video.id),
            'video': video.video.url,
            'title': video.title,
            'description': video.description,
            'thumbnail': video.thumbnail.url if video.thumbnail else None,
            'order': video.order,
            'file_size_mb': video.file_size_mb,
            'uploaded_at': video.uploaded_at.isoformat()
        }


class ProjectSerializer:
    @staticmethod
    def serialize(project):
        return {
            'id': str(project.id),
            'title': project.title,
            'slug': project.slug,
            'category': CategorySerializer.serialize(project.category),
            'description': project.description,
            'short_description': project.short_description,
            'tags': project.tags,
            'featured': project.featured,
            'status': project.status,
            'order': project.order,
            'created_at': project.created_at.isoformat(),
            'updated_at': project.updated_at.isoformat(),
            'images': [ProjectImageSerializer.serialize(img) for img in project.images.all()],
            'videos': [ProjectVideoSerializer.serialize(vid) for vid in project.videos.all()],
            'main_image': project.main_image.image.url if project.main_image else None,
            'thumbnail': project.thumbnail
        }
