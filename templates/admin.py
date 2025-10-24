#!/usr/bin/env python3
"""
8Bit Lab - Sistema de Administração de Portfólio
Painel para gerenciar projetos, imagens e vídeos
"""

import os
import json
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
import mimetypes

class PortfolioAdmin:
    def __init__(self, base_path: str = "."):
        self.base_path = Path(base_path)
        self.portfolio_data_file = self.base_path / "data" / "portfolio.json"
        self.uploads_dir = self.base_path / "static" / "uploads"
        self.images_dir = self.uploads_dir / "images"
        self.videos_dir = self.uploads_dir / "videos"
        self.thumbnails_dir = self.uploads_dir / "thumbnails"
        
        # Criar diretórios se não existirem
        self._create_directories()
        
        # Carregar dados existentes
        self.portfolio_data = self._load_portfolio_data()
    
    def _create_directories(self):
        """Cria os diretórios necessários"""
        directories = [
            self.base_path / "data",
            self.uploads_dir,
            self.images_dir,
            self.videos_dir,
            self.thumbnails_dir
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
    
    def _load_portfolio_data(self) -> Dict:
        """Carrega os dados do portfólio do arquivo JSON"""
        if self.portfolio_data_file.exists():
            try:
                with open(self.portfolio_data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                pass
        
        # Estrutura padrão se não existir arquivo
        return {
            "projects": [],
            "categories": [
                {"id": "web-design", "name": "Web Design", "color": "#ea532e"},
                {"id": "branding", "name": "Branding", "color": "#0096ff"},
                {"id": "e-commerce", "name": "E-commerce", "color": "#00ff88"},
                {"id": "sistemas", "name": "Sistemas", "color": "#ff6b35"},
                {"id": "ui-ux", "name": "UI/UX", "color": "#8b5cf6"},
                {"id": "motion", "name": "Motion", "color": "#f59e0b"}
            ],
            "settings": {
                "auto_generate_thumbnails": True,
                "max_file_size_mb": 50,
                "allowed_image_formats": ["jpg", "jpeg", "png", "webp", "gif"],
                "allowed_video_formats": ["mp4", "webm", "mov", "avi"]
            }
        }
    
    def _save_portfolio_data(self):
        """Salva os dados do portfólio no arquivo JSON"""
        with open(self.portfolio_data_file, 'w', encoding='utf-8') as f:
            json.dump(self.portfolio_data, f, indent=2, ensure_ascii=False)
    
    def _generate_thumbnail(self, file_path: Path, output_path: Path, size: tuple = (400, 300)):
        """Gera thumbnail para imagem ou vídeo"""
        try:
            from PIL import Image, ImageOps
            
            if file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
                # Thumbnail para imagem
                with Image.open(file_path) as img:
                    img.thumbnail(size, Image.Resampling.LANCZOS)
                    img = ImageOps.fit(img, size, Image.Resampling.LANCZOS)
                    img.save(output_path, optimize=True, quality=85)
            else:
                # Para vídeos, usar frame do meio (requer ffmpeg)
                import subprocess
                cmd = [
                    'ffmpeg', '-i', str(file_path), '-ss', '00:00:01',
                    '-vframes', '1', '-vf', f'scale={size[0]}:{size[1]}',
                    '-y', str(output_path)
                ]
                subprocess.run(cmd, capture_output=True, check=True)
                
        except ImportError:
            print("PIL não instalado. Instale com: pip install Pillow")
        except Exception as e:
            print(f"Erro ao gerar thumbnail: {e}")
    
    def _validate_file(self, file_path: Path, file_type: str = "image") -> bool:
        """Valida se o arquivo é permitido"""
        settings = self.portfolio_data["settings"]
        
        if file_type == "image":
            allowed_formats = settings["allowed_image_formats"]
        else:
            allowed_formats = settings["allowed_video_formats"]
        
        file_ext = file_path.suffix.lower().lstrip('.')
        return file_ext in allowed_formats
    
    def _get_file_size_mb(self, file_path: Path) -> float:
        """Retorna o tamanho do arquivo em MB"""
        return file_path.stat().st_size / (1024 * 1024)
    
    def add_project(self, project_data: Dict) -> Dict:
        """Adiciona um novo projeto ao portfólio"""
        project_id = f"project_{len(self.portfolio_data['projects']) + 1}_{int(datetime.now().timestamp())}"
        
        project = {
            "id": project_id,
            "title": project_data.get("title", ""),
            "category": project_data.get("category", ""),
            "description": project_data.get("description", ""),
            "short_description": project_data.get("short_description", ""),
            "tags": project_data.get("tags", []),
            "images": [],
            "videos": [],
            "thumbnail": "",
            "featured": project_data.get("featured", False),
            "status": project_data.get("status", "draft"),  # draft, published, archived
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "order": len(self.portfolio_data['projects'])
        }
        
        self.portfolio_data["projects"].append(project)
        self._save_portfolio_data()
        
        return project
    
    def update_project(self, project_id: str, project_data: Dict) -> bool:
        """Atualiza um projeto existente"""
        for i, project in enumerate(self.portfolio_data["projects"]):
            if project["id"] == project_id:
                # Preserva dados importantes
                project_data["id"] = project["id"]
                project_data["created_at"] = project["created_at"]
                project_data["images"] = project.get("images", [])
                project_data["videos"] = project.get("videos", [])
                project_data["updated_at"] = datetime.now().isoformat()
                
                self.portfolio_data["projects"][i] = project_data
                self._save_portfolio_data()
                return True
        return False
    
    def delete_project(self, project_id: str) -> bool:
        """Remove um projeto do portfólio"""
        for i, project in enumerate(self.portfolio_data["projects"]):
            if project["id"] == project_id:
                # Remove arquivos associados
                for image in project.get("images", []):
                    self._delete_file(image["path"])
                for video in project.get("videos", []):
                    self._delete_file(video["path"])
                
                del self.portfolio_data["projects"][i]
                self._save_portfolio_data()
                return True
        return False
    
    def _delete_file(self, file_path: str):
        """Remove arquivo do sistema"""
        try:
            Path(file_path).unlink(missing_ok=True)
        except Exception as e:
            print(f"Erro ao deletar arquivo {file_path}: {e}")
    
    def upload_media(self, file_path: Path, project_id: str, media_type: str = "image") -> Dict:
        """Faz upload de imagem ou vídeo para um projeto"""
        if not self._validate_file(file_path, media_type):
            raise ValueError(f"Formato de arquivo não permitido para {media_type}")
        
        file_size_mb = self._get_file_size_mb(file_path)
        max_size = self.portfolio_data["settings"]["max_file_size_mb"]
        
        if file_size_mb > max_size:
            raise ValueError(f"Arquivo muito grande. Máximo: {max_size}MB")
        
        # Determina diretório de destino
        if media_type == "image":
            dest_dir = self.images_dir
        else:
            dest_dir = self.videos_dir
        
        # Gera nome único para o arquivo
        timestamp = int(datetime.now().timestamp())
        file_ext = file_path.suffix
        new_filename = f"{project_id}_{timestamp}{file_ext}"
        dest_path = dest_dir / new_filename
        
        # Copia arquivo
        shutil.copy2(file_path, dest_path)
        
        # Gera thumbnail se configurado
        thumbnail_path = None
        if self.portfolio_data["settings"]["auto_generate_thumbnails"]:
            thumbnail_filename = f"thumb_{new_filename}"
            thumbnail_path = self.thumbnails_dir / thumbnail_filename
            self._generate_thumbnail(dest_path, thumbnail_path)
        
        # Adiciona ao projeto
        media_data = {
            "filename": new_filename,
            "path": str(dest_path.relative_to(self.base_path)),
            "size_mb": round(file_size_mb, 2),
            "uploaded_at": datetime.now().isoformat()
        }
        
        if thumbnail_path:
            media_data["thumbnail"] = str(thumbnail_path.relative_to(self.base_path))
        
        # Encontra e atualiza o projeto
        for project in self.portfolio_data["projects"]:
            if project["id"] == project_id:
                if media_type == "image":
                    project["images"].append(media_data)
                else:
                    project["videos"].append(media_data)
                break
        
        self._save_portfolio_data()
        return media_data
    
    def get_projects(self, status: str = None, category: str = None) -> List[Dict]:
        """Retorna lista de projetos com filtros opcionais"""
        projects = self.portfolio_data["projects"]
        
        if status:
            projects = [p for p in projects if p.get("status") == status]
        
        if category:
            projects = [p for p in projects if p.get("category") == category]
        
        return sorted(projects, key=lambda x: x.get("order", 0))
    
    def get_project(self, project_id: str) -> Optional[Dict]:
        """Retorna um projeto específico"""
        for project in self.portfolio_data["projects"]:
            if project["id"] == project_id:
                return project
        return None
    
    def reorder_projects(self, project_ids: List[str]):
        """Reordena os projetos"""
        for i, project_id in enumerate(project_ids):
            for project in self.portfolio_data["projects"]:
                if project["id"] == project_id:
                    project["order"] = i
                    break
        
        self._save_portfolio_data()
    
    def generate_portfolio_html(self) -> str:
        """Gera o HTML do portfólio baseado nos dados"""
        projects = self.get_projects(status="published")
        
        html_parts = []
        
        for project in projects:
            # Determina imagem principal
            main_image = ""
            if project.get("images"):
                main_image = project["images"][0]["path"]
            elif project.get("thumbnail"):
                main_image = project["thumbnail"]
            
            # Gera tags HTML
            tags_html = ""
            for tag in project.get("tags", []):
                tags_html += f'<span class="tag">{tag}</span>\n'
            
            # Gera HTML do projeto
            project_html = f'''
            <div class="portfolio-card" data-category="{project.get('category', '')}">
                <div class="card-image">
                    <img src="{main_image}" alt="{project.get('title', '')}" loading="lazy" />
                    <div class="card-overlay">
                        <div class="overlay-content">
                            <div class="project-number">{project.get('order', 0) + 1:02d}</div>
                            <h3 class="project-title">{project.get('title', '')}</h3>
                            <p class="project-category">{project.get('category', '').upper()}</p>
                            <p class="project-description">{project.get('short_description', '')}</p>
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
        
        return '\n'.join(html_parts)
    
    def export_data(self, format: str = "json") -> str:
        """Exporta dados do portfólio"""
        if format == "json":
            return json.dumps(self.portfolio_data, indent=2, ensure_ascii=False)
        elif format == "csv":
            # Implementar exportação CSV se necessário
            pass
        return ""
    
    def import_data(self, data: str, format: str = "json"):
        """Importa dados do portfólio"""
        if format == "json":
            imported_data = json.loads(data)
            self.portfolio_data.update(imported_data)
            self._save_portfolio_data()


def main():
    """Função principal para demonstração"""
    admin = PortfolioAdmin()
    
    print("🎨 8Bit Lab - Sistema de Administração de Portfólio")
    print("=" * 50)
    
    # Exemplo de uso
    project_data = {
        "title": "Novo Projeto",
        "category": "web-design",
        "description": "Descrição completa do projeto",
        "short_description": "Descrição curta para o card",
        "tags": ["HTML", "CSS", "JavaScript"],
        "featured": True,
        "status": "published"
    }
    
    # Adiciona projeto
    project = admin.add_project(project_data)
    print(f"✅ Projeto adicionado: {project['id']}")
    
    # Lista projetos
    projects = admin.get_projects()
    print(f"📁 Total de projetos: {len(projects)}")
    
    for project in projects:
        print(f"  - {project['title']} ({project['category']})")


if __name__ == "__main__":
    main()
