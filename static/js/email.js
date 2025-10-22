// static/js/email.js - VERSÃO CORRIGIDA

// Aguarda tudo carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Página carregada');
    
    // Verifica se EmailJS está disponível
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS não carregado! Verifique a ordem dos scripts.');
        alert('Erro: EmailJS não carregou. Recarregue a página.');
        return;
    }
    
    console.log('✅ EmailJS disponível');
    
    // ✅ CORREÇÃO: init() é síncrono, não retorna Promise
    emailjs.init('6qlRtRdtPtJ307vPQ');
    console.log('✅ EmailJS inicializado com sucesso');
    
    // Chama setupForm diretamente
    setupForm();
});

function setupForm() {
    console.log('🔧 Configurando formulário...');
    
    const serviceID = 'service_svya8ak';
    const templateID = 'template_aomq9la';
    const toEmail = 'chuckzinnnnn@gmail.com';

    const form = document.getElementById('contactForm');
    
    if (!form) {
        console.error('❌ Formulário não encontrado!');
        return;
    }
    
    console.log('✅ Formulário encontrado');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('🎯 Formulário enviado!');

        const nome = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const tipo = document.getElementById('projectType').value || 'Não especificado';
        const mensagem = document.getElementById('message').value.trim();

        console.log('📝 Dados capturados:', { nome, email, tipo, mensagem });

        // Verifica campos obrigatórios
        if (!nome || !email || !mensagem) {
            alert('❌ Preencha todos os campos obrigatórios!');
            return;
        }

        const params = {
            to_email: toEmail,
            from_name: nome,
            reply_to: email,
            project_type: tipo,
            message: mensagem
        };

        console.log('📤 Enviando para EmailJS...', params);

        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        button.disabled = true;
        button.innerHTML = '<span class="win95-button-inner">Enviando...</span>';

        // Envio com function tradicional
        emailjs.send(serviceID, templateID, params)
            .then(function(response) {
                console.log('✅ Sucesso! Response:', response);
                alert('✅ Mensagem enviada com sucesso!');
                form.reset();
            })
            .catch(function(error) {
                console.error('❌ Erro no envio:', error);
                alert('❌ Erro ao enviar: ' + (error.text || 'Tente novamente'));
            })
            .finally(function() {
                button.disabled = false;
                button.innerHTML = originalText;
            });
    });
}