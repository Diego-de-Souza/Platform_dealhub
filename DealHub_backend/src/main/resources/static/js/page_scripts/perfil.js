document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const senhaInput = document.getElementById('senha');
    const confirmSenhaInput = document.getElementById('confirmSenha');
    const formElement = document.getElementById('updateUserForm');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
            senhaInput.setAttribute('type', type);
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmSenhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmSenhaInput.setAttribute('type', type);
        });
    }
    if (senhaInput && confirmSenhaInput) {
        function validatePasswords() {
            const senha = senhaInput.value;
            const confirmSenha = confirmSenhaInput.value;
            
            if (senha || confirmSenha) {
                if (senha !== confirmSenha) {
                    confirmSenhaInput.setCustomValidity('As senhas não coincidem');
                    
                    let errorSpan = confirmSenhaInput.parentElement.querySelector('.error-message');
                    if (!errorSpan) {
                        errorSpan = document.createElement('span');
                        errorSpan.className = 'error-message';
                        confirmSenhaInput.parentElement.appendChild(errorSpan);
                    }
                    errorSpan.textContent = 'As senhas não coincidem';
                    confirmSenhaInput.classList.add('error');
                } else {
                    confirmSenhaInput.setCustomValidity('');
                    
                    const errorSpan = confirmSenhaInput.parentElement.querySelector('.error-message');
                    if (errorSpan) {
                        errorSpan.textContent = '';
                    }
                    confirmSenhaInput.classList.remove('error');
                }
            } else {
                confirmSenhaInput.setCustomValidity('');
                const errorSpan = confirmSenhaInput.parentElement.querySelector('.error-message');
                if (errorSpan) {
                    errorSpan.textContent = '';
                }
                confirmSenhaInput.classList.remove('error');
            }
        }

        senhaInput.addEventListener('input', validatePasswords);
        confirmSenhaInput.addEventListener('input', validatePasswords);
        
        if (formElement) {
            formElement.addEventListener('submit', function(e) {
                validatePasswords();
                
                if (!confirmSenhaInput.validity.valid) {
                    e.preventDefault();
                }
            });
        }
    }
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', showDeleteConfirmationModal);
    }
    
    function showDeleteConfirmationModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">Excluir conta</h3>
            </div>
            <div class="modal-body">
                <p>Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
                <p>Todos os seus dados serão removidos permanentemente do sistema.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="modal-btn modal-btn-cancel">Cancelar</button>
                <button type="button" class="modal-btn modal-btn-confirm">Confirmar exclusão</button>
            </div>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        setTimeout(() => {
            modalOverlay.classList.add('active');
        }, 10);
        
        const cancelBtn = modalContent.querySelector('.modal-btn-cancel');
        const confirmBtn = modalContent.querySelector('.modal-btn-confirm');
        
        cancelBtn.addEventListener('click', () => {
            closeModal(modalOverlay);
        });
        
        confirmBtn.addEventListener('click', () => {
            deleteAccount();
            closeModal(modalOverlay);
        });
    }
    
    function closeModal(modalOverlay) {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
        }, 300);
    }
    
    function deleteAccount() {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/api/usuarios/perfil/excluir';
        
        const csrfInput = document.querySelector('input[name="_csrf"]') ||
                         document.querySelector(`input[name="${document.querySelector('meta[name="_csrf_parameter"]')?.content || '_csrf'}"]`);
        
        if (csrfInput) {
            const csrfField = document.createElement('input');
            csrfField.type = 'hidden';
            csrfField.name = csrfInput.name;
            csrfField.value = csrfInput.value;
            form.appendChild(csrfField);
        }
        
        document.body.appendChild(form);
        form.submit();
    }
});