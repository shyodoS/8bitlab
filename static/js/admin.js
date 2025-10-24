// ============================================
// ADMIN PANEL - JAVASCRIPT
// ============================================

class AdminPanel {
    constructor() {
        this.currentSection = 'projects';
        this.currentProject = null;
        this.portfolioData = null;
        
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.bindEvents();
        this.renderProjects();
        this.renderCategories();
        this.renderMedia();
    }
    
    async loadData() {
        try {
            const response = await fetch('/api/portfolio');
            this.portfolioData = await response.json();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showToast('Erro ao carregar dados do portfólio', 'error');
        }
    }
    
    async saveData() {
        try {
            const response = await fetch('/api/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.portfolioData)
            });
            
            if (response.ok) {
                this.showToast('Dados salvos com sucesso!', 'success');
            } else {
                throw new Error('Erro ao salvar dados');
            }
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            this.showToast('Erro ao salvar dados', 'error');
        }
    }
    
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Buttons
        document.getElementById('addProjectBtn').addEventListener('click', () => {
            this.openProjectModal();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveData();
        });
        
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeProjectModal();
        });
        
        document.getElementById('cancelProject').addEventListener('click', () => {
            this.closeProjectModal();
        });
        
        document.getElementById('saveProject').addEventListener('click', () => {
            this.saveProject();
        });
        
        // File uploads
        this.setupFileUploads();
        
        // Settings
        this.setupSettings();
    }
    
    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');
        
        this.currentSection = section;
    }
    
    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        const projects = this.portfolioData?.projects || [];
        
        grid.innerHTML = projects.map(project => `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-image">
                    ${project.images?.length > 0 ? 
                        `<img src="${project.images[0].path}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">` :
                        '<i class="fas fa-image"></i>'
                    }
                </div>
                <div class="project-status ${project.status}">${project.status}</div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-category">${project.category}</p>
                <p class="project-description">${project.short_description || project.description}</p>
                <div class="project-actions">
                    <button class="btn-admin" onclick="adminPanel.editProject('${project.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-admin" onclick="adminPanel.deleteProject('${project.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        const categories = this.portfolioData?.categories || [];
        
        grid.innerHTML = categories.map(category => `
            <div class="category-card">
                <div class="category-color" style="background-color: ${category.color}"></div>
                <h3>${category.name}</h3>
                <p>${category.id}</p>
            </div>
        `).join('');
    }
    
    renderMedia() {
        const grid = document.getElementById('mediaGrid');
        const projects = this.portfolioData?.projects || [];
        const allMedia = [];
        
        projects.forEach(project => {
            if (project.images) {
                project.images.forEach(img => {
                    allMedia.push({...img, type: 'image', projectTitle: project.title});
                });
            }
            if (project.videos) {
                project.videos.forEach(vid => {
                    allMedia.push({...vid, type: 'video', projectTitle: project.title});
                });
            }
        });
        
        grid.innerHTML = allMedia.map(media => `
            <div class="media-item">
                <div class="media-preview">
                    ${media.type === 'image' ? 
                        `<img src="${media.path}" alt="${media.filename}" style="width: 100%; height: 100%; object-fit: cover;">` :
                        `<i class="fas fa-video"></i>`
                    }
                </div>
                <div class="media-info">
                    <div class="media-filename">${media.filename}</div>
                    <div class="media-size">${media.size_mb}MB</div>
                </div>
                <div class="media-actions">
                    <button onclick="adminPanel.deleteMedia('${media.path}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    openProjectModal(projectId = null) {
        this.currentProject = projectId;
        const modal = document.getElementById('projectModal');
        const title = document.getElementById('modalTitle');
        
        if (projectId) {
            const project = this.portfolioData.projects.find(p => p.id === projectId);
            if (project) {
                title.textContent = 'Editar Projeto';
                this.fillProjectForm(project);
            }
        } else {
            title.textContent = 'Novo Projeto';
            this.clearProjectForm();
        }
        
        // Populate categories
        this.populateCategories();
        
        modal.classList.add('active');
    }
    
    closeProjectModal() {
        document.getElementById('projectModal').classList.remove('active');
        this.currentProject = null;
    }
    
    fillProjectForm(project) {
        document.getElementById('projectTitle').value = project.title || '';
        document.getElementById('projectCategory').value = project.category || '';
        document.getElementById('projectDescription').value = project.description || '';
        document.getElementById('projectShortDescription').value = project.short_description || '';
        document.getElementById('projectTags').value = project.tags?.join(', ') || '';
        document.getElementById('projectStatus').value = project.status || 'draft';
        document.getElementById('projectFeatured').checked = project.featured || false;
        
        // Render uploaded files
        this.renderUploadedFiles('uploadedImages', project.images || []);
        this.renderUploadedFiles('uploadedVideos', project.videos || []);
    }
    
    clearProjectForm() {
        document.getElementById('projectForm').reset();
        document.getElementById('uploadedImages').innerHTML = '';
        document.getElementById('uploadedVideos').innerHTML = '';
    }
    
    populateCategories() {
        const select = document.getElementById('projectCategory');
        const categories = this.portfolioData?.categories || [];
        
        select.innerHTML = '<option value="">Selecione uma categoria</option>' +
            categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }
    
    renderUploadedFiles(containerId, files) {
        const container = document.getElementById(containerId);
        container.innerHTML = files.map(file => `
            <div class="uploaded-file">
                <i class="fas fa-${file.type === 'image' ? 'image' : 'video'}"></i>
                <span>${file.filename}</span>
                <span class="remove-file" onclick="adminPanel.removeFile('${file.path}', '${containerId}')">×</span>
            </div>
        `).join('');
    }
    
    setupFileUploads() {
        // Image upload
        const imageUploadArea = document.getElementById('imageUploadArea');
        const imageInput = document.getElementById('imageInput');
        
        imageUploadArea.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', (e) => this.handleFileUpload(e, 'image'));
        
        // Video upload
        const videoUploadArea = document.getElementById('videoUploadArea');
        const videoInput = document.getElementById('videoInput');
        
        videoUploadArea.addEventListener('click', () => videoInput.click());
        videoInput.addEventListener('change', (e) => this.handleFileUpload(e, 'video'));
        
        // Drag and drop
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-red)';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'rgba(234, 83, 46, 0.3)';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(234, 83, 46, 0.3)';
            this.handleFileUpload(e, 'media');
        });
    }
    
    async handleFileUpload(event, type) {
        const files = event.target.files || event.dataTransfer.files;
        
        for (const file of files) {
            await this.uploadFile(file, type);
        }
    }
    
    async uploadFile(file, type) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        
        if (this.currentProject) {
            formData.append('project_id', this.currentProject);
        }
        
        try {
            this.showLoading(true);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showToast('Arquivo enviado com sucesso!', 'success');
                
                // Update UI
                if (this.currentProject) {
                    this.loadData().then(() => {
                        this.renderProjects();
                        this.renderMedia();
                    });
                }
            } else {
                throw new Error('Erro no upload');
            }
        } catch (error) {
            console.error('Erro no upload:', error);
            this.showToast('Erro no upload do arquivo', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    async saveProject() {
        const formData = {
            title: document.getElementById('projectTitle').value,
            category: document.getElementById('projectCategory').value,
            description: document.getElementById('projectDescription').value,
            short_description: document.getElementById('projectShortDescription').value,
            tags: document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t),
            status: document.getElementById('projectStatus').value,
            featured: document.getElementById('projectFeatured').checked
        };
        
        try {
            this.showLoading(true);
            
            let response;
            if (this.currentProject) {
                // Update existing project
                response = await fetch(`/api/projects/${this.currentProject}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                // Create new project
                response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }
            
            if (response.ok) {
                this.showToast('Projeto salvo com sucesso!', 'success');
                this.closeProjectModal();
                await this.loadData();
                this.renderProjects();
                this.renderMedia();
            } else {
                throw new Error('Erro ao salvar projeto');
            }
        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            this.showToast('Erro ao salvar projeto', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    async editProject(projectId) {
        this.openProjectModal(projectId);
    }
    
    async deleteProject(projectId) {
        if (confirm('Tem certeza que deseja deletar este projeto?')) {
            try {
                this.showLoading(true);
                
                const response = await fetch(`/api/projects/${projectId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    this.showToast('Projeto deletado com sucesso!', 'success');
                    await this.loadData();
                    this.renderProjects();
                    this.renderMedia();
                } else {
                    throw new Error('Erro ao deletar projeto');
                }
            } catch (error) {
                console.error('Erro ao deletar projeto:', error);
                this.showToast('Erro ao deletar projeto', 'error');
            } finally {
                this.showLoading(false);
            }
        }
    }
    
    async deleteMedia(mediaPath) {
        if (confirm('Tem certeza que deseja deletar este arquivo?')) {
            try {
                this.showLoading(true);
                
                const response = await fetch(`/api/media/${encodeURIComponent(mediaPath)}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    this.showToast('Arquivo deletado com sucesso!', 'success');
                    await this.loadData();
                    this.renderMedia();
                } else {
                    throw new Error('Erro ao deletar arquivo');
                }
            } catch (error) {
                console.error('Erro ao deletar arquivo:', error);
                this.showToast('Erro ao deletar arquivo', 'error');
            } finally {
                this.showLoading(false);
            }
        }
    }
    
    removeFile(filePath, containerId) {
        // Remove from UI only (actual deletion happens on save)
        const container = document.getElementById(containerId);
        const fileElement = container.querySelector(`[data-path="${filePath}"]`);
        if (fileElement) {
            fileElement.remove();
        }
    }
    
    setupSettings() {
        const settings = this.portfolioData?.settings || {};
        
        document.getElementById('maxFileSize').value = settings.max_file_size_mb || 50;
        document.getElementById('autoThumbnails').checked = settings.auto_generate_thumbnails || true;
        
        // Setup settings save
        document.querySelectorAll('#settings input, #settings select').forEach(input => {
            input.addEventListener('change', () => {
                this.saveSettings();
            });
        });
    }
    
    async saveSettings() {
        const settings = {
            max_file_size_mb: parseInt(document.getElementById('maxFileSize').value),
            auto_generate_thumbnails: document.getElementById('autoThumbnails').checked,
            allowed_image_formats: Array.from(document.querySelectorAll('#settings input[type="checkbox"]:checked'))
                .map(cb => cb.value)
        };
        
        this.portfolioData.settings = settings;
        await this.saveData();
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.toggle('active', show);
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
