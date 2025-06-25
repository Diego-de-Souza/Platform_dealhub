document.addEventListener('DOMContentLoaded', function() {
    // Seleção múltipla
    const selectAllCheckbox = document.getElementById('selectAll');
    const userCheckboxes = document.querySelectorAll('.user-checkbox');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            userCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }

    // Busca de usuários
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.user-row');

            rows.forEach(row => {
                const userName = row.querySelector('.user-name').textContent.toLowerCase();
                const userEmail = row.querySelector('.email-cell').textContent.toLowerCase();

                if (userName.includes(searchTerm) || userEmail.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

/*para parte de cadastro*/
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('senha');
    const confirmPasswordInput = document.getElementById('confirmarSenha');
    const passwordStrengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    // Mostrar/ocultar senha
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.password-input').querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Alterar ícone
            const icon = this.querySelector('svg');
            if (type === 'text') {
                icon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>';
            } else {
                icon.innerHTML = '<path d="M12 5C5.64 5 2 12 2 12s3.64 7 10 7 10-7 10-7-3.64-7-10-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="currentColor"/><path d="M12 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" fill="currentColor"/>';
            }
        });
    });

    // Validar força da senha
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;

        // Verificar comprimento
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Verificar caracteres especiais
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        // Verificar números
        if (/\d/.test(password)) strength++;

        // Verificar maiúsculas e minúsculas
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

        // Atualizar barras de força
        passwordStrengthBars.forEach((bar, index) => {
            if (index < strength) {
                bar.style.backgroundColor = getStrengthColor(strength);
            } else {
                bar.style.backgroundColor = 'var(--gray)';
            }
        });

        // Atualizar texto
        const strengthMessages = ['Muito fraca', 'Fraca', 'Moderada', 'Forte', 'Muito forte'];
        strengthText.textContent = strength > 0 ? strengthMessages[strength - 1] : 'Força da senha';
        strengthText.style.color = getStrengthColor(strength);
    });

    function getStrengthColor(strength) {
        const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#28cd41', '#28cd41'];
        return colors[strength - 1] || '#999';
    }

    // Validar confirmação de senha
    confirmPasswordInput.addEventListener('input', function() {
        const confirmPassword = this.value;
        const password = passwordInput.value;
        const errorElement = document.getElementById('confirmarSenha-error');

        if (confirmPassword !== password) {
            this.classList.add('invalid');
            this.classList.remove('valid');
            errorElement.textContent = 'As senhas não coincidem';
        } else {
            this.classList.remove('invalid');
            this.classList.add('valid');
            errorElement.textContent = '';
        }
    });

    // Validação do formulário
    form.addEventListener('submit', function(e) {
        let isValid = true;

        // Validar campos obrigatórios
        form.querySelectorAll('[required]').forEach(input => {
            const errorElement = document.getElementById(`${input.id}-error`);

            if (!input.value.trim()) {
                input.classList.add('invalid');
                errorElement.textContent = 'Este campo é obrigatório';
                isValid = false;
            } else {
                input.classList.remove('invalid');
                errorElement.textContent = '';
            }

            // Validação específica para e-mail
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.classList.add('invalid');
                    errorElement.textContent = 'Por favor, insira um e-mail válido';
                    isValid = false;
                }
            }

            // Validação específica para termos
            if (input.type === 'checkbox' && !input.checked) {
                input.classList.add('invalid');
                errorElement.textContent = 'Você deve aceitar os termos';
                isValid = false;
            }
        });

        // Validar senha
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.classList.add('invalid');
            document.getElementById('confirmarSenha-error').textContent = 'As senhas não coincidem';
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();

            // Rolar até o primeiro erro
            const firstError = form.querySelector('.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    // Validação em tempo real
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(`${this.id}-error`);

            if (this.value.trim()) {
                this.classList.remove('invalid');
                errorElement.textContent = '';
            }
        });
    });
});

/*parte de atualização dos dados*/
document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const editButton = document.getElementById('editProfile');
    const cancelButton = document.getElementById('cancelEdit');
    const saveButton = document.getElementById('saveProfile');
    const profileForm = document.getElementById('profileForm');
    const menuItems = document.querySelectorAll('.menu-item');
    const profileSections = document.querySelectorAll('.profile-section');

    // Estado inicial
    let isEditing = false;
    let originalFormData = {};

    // Carregar dados do usuário (simulação)
    function loadUserData() {
        // Aqui você faria uma requisição AJAX para obter os dados reais
        // Estou simulando dados para demonstração
        const userData = {
            nome: "João Silva",
            username: "joaosilva",
            email: "joao.silva@example.com",
            telefone: "(11) 98765-4321",
            bio: "Desenvolvedor Full Stack apaixonado por criar soluções inovadoras.",
            dataNascimento: "1990-05-15",
            genero: "MASCULINO",
            idioma: "pt_BR",
            tema: "sistema",
            notificacoesEmail: true,
            newsletter: false
        };

        // Preencher formulário com os dados
        for (const key in userData) {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = userData[key];
                } else {
                    input.value = userData[key];
                }
            }
        }

        // Atualizar elementos de exibição
        document.getElementById('profileName').textContent = userData.nome;
        document.getElementById('profileEmail').textContent = userData.email;

        // Salvar dados originais para possível cancelamento
        originalFormData = {...userData};
    }

    // Alternar modo de edição
    function toggleEditMode() {
        isEditing = !isEditing;

        // Alternar visibilidade dos botões
        editButton.style.display = isEditing ? 'none' : 'flex';
        cancelButton.style.display = isEditing ? 'block' : 'none';
        saveButton.style.display = isEditing ? 'block' : 'none';

        // Alternar estado dos campos do formulário
        const inputs = profileForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.id !== 'imageUpload') {
                input.disabled = !isEditing;
            }
        });

        // Mostrar/ocultar botão de edição de avatar
        document.getElementById('avatarEditButton').style.display = isEditing ? 'flex' : 'none';
    }

    // Cancelar edição
    function cancelEdit() {
        // Restaurar valores originais
        for (const key in originalFormData) {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = originalFormData[key];
                } else {
                    input.value = originalFormData[key];
                }
            }
        }

        toggleEditMode();
    }

    // Alternar entre seções
    function switchSection(sectionId) {
        // Desativar todas as seções
        profileSections.forEach(section => {
            section.classList.remove('active');
        });

        // Ativar seção selecionada
        document.getElementById(`${sectionId}-section`).classList.add('active');

        // Atualizar menu
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
    }

    // Configurar upload de imagem
    function setupImageUpload() {
        const imageUpload = document.getElementById('imageUpload');
        const profileImage = document.getElementById('profileImage');

        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function(event) {
                    profileImage.src = event.target.result;

                    // Aqui você poderia enviar a imagem para o servidor
                    // uploadImageToServer(file);
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Validar força da senha
    function setupPasswordStrength() {
        const passwordInput = document.getElementById('novaSenha');
        const passwordStrengthBars = document.querySelectorAll('#security-section .strength-bar');
        const strengthText = document.querySelector('#security-section .strength-text');

        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;

                // Verificar comprimento
                if (password.length >= 8) strength++;
                if (password.length >= 12) strength++;

                // Verificar caracteres especiais
                if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

                // Verificar números
                if (/\d/.test(password)) strength++;

                // Verificar maiúsculas e minúsculas
                if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

                // Atualizar barras de força
                passwordStrengthBars.forEach((bar, index) => {
                    if (index < strength) {
                        bar.style.backgroundColor = getStrengthColor(strength);
                    } else {
                        bar.style.backgroundColor = 'var(--gray)';
                    }
                });

                // Atualizar texto
                const strengthMessages = ['Muito fraca', 'Fraca', 'Moderada', 'Forte', 'Muito forte'];
                strengthText.textContent = strength > 0 ? strengthMessages[strength - 1] : 'Força da senha';
                strengthText.style.color = getStrengthColor(strength);
            });
        }
    }

    function getStrengthColor(strength) {
        const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#28cd41', '#28cd41'];
        return colors[strength - 1] || '#999';
    }

    // Mostrar/ocultar senha
    function setupPasswordToggle() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.closest('.password-input').querySelector('input');
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);

                // Alterar ícone
                const icon = this.querySelector('svg');
                if (type === 'text') {
                    icon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>';
                } else {
                    icon.innerHTML = '<path d="M12 5C5.64 5 2 12 2 12s3.64 7 10 7 10-7 10-7-3.64-7-10-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="currentColor"/><path d="M12 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" fill="currentColor"/>';
                }
            });
        });
    }

    // Validar formulário
    function setupFormValidation() {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;

            // Validar campos obrigatórios
            const requiredFields = this.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const errorElement = document.getElementById(`${field.id}-error`);

                if (!field.value.trim()) {
                    field.classList.add('invalid');
                    errorElement.textContent = 'Este campo é obrigatório';
                    isValid = false;
                } else {
                    field.classList.remove('invalid');
                    errorElement.textContent = '';
                }

                // Validação específica para e-mail
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        field.classList.add('invalid');
                        errorElement.textContent = 'Por favor, insira um e-mail válido';
                        isValid = false;
                    }
                }
            });

            // Validar senha
            const novaSenha = document.getElementById('novaSenha');
            const confirmarSenha = document.getElementById('confirmarSenha');

            if (novaSenha.value && novaSenha.value !== confirmarSenha.value) {
                confirmarSenha.classList.add('invalid');
                document.getElementById('confirmarSenha-error').textContent = 'As senhas não coincidem';
                isValid = false;
            }

            if (isValid) {
                // Aqui você enviaria os dados para o servidor
                // submitFormData();

                // Simular envio bem-sucedido
                alert('Perfil atualizado com sucesso!');
                toggleEditMode();

                // Atualizar dados exibidos
                document.getElementById('profileName').textContent = document.getElementById('nome').value;
                document.getElementById('profileEmail').textContent = document.getElementById('email').value;

                // Salvar novos dados como originais
                originalFormData = {};
                const inputs = profileForm.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (input.name) {
                        originalFormData[input.name] = input.type === 'checkbox' ? input.checked : input.value;
                    }
                });
            } else {
                // Rolar até o primeiro erro
                const firstError = this.querySelector('.invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    }

    // Event Listeners
    editButton.addEventListener('click', toggleEditMode);
    cancelButton.addEventListener('click', cancelEdit);

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
        });
    });

    // Inicialização
    loadUserData();
    setupImageUpload();
    setupPasswordStrength();
    setupPasswordToggle();
    setupFormValidation();

    // Carregar a primeira seção por padrão
    switchSection('personal-info');
});

document.addEventListener('DOMContentLoaded', function() {
    // Obter os IDs dos elementos ocultos
    const usuarioEditadoId = document.getElementById('usuarioEditadoId')?.value;
    const usuarioLogadoId = document.getElementById('usuarioLogadoId')?.value;

    // Se os IDs forem iguais, desabilita o campo de role
    if (usuarioEditadoId && usuarioLogadoId && usuarioEditadoId === usuarioLogadoId) {
        const roleSelect = document.getElementById('role');
        if (roleSelect) {
            roleSelect.disabled = true;

            // Adiciona uma mensagem explicativa (opcional)
            const roleLabel = roleSelect.previousElementSibling;
            if (roleLabel && roleLabel.tagName === 'LABEL') {
                roleLabel.insertAdjacentHTML('afterend',
                    '<small class="text-muted d-block mt-1">Você não pode alterar seu próprio perfil</small>');
            }
        }
    }
});