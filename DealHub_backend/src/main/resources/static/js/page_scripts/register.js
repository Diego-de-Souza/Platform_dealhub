document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.register-form');

    const cpfInput = form.querySelector('input[name="cpf"]');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            e.target.value = value;
        }
    });

    const telefoneInput = form.querySelector('input[name="telefone"]');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length > 2) {
                if (value.length > 7) {
                    value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
                }
            }
            e.target.value = value;
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const password = form.querySelector('input[name="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;

        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        // Obter o token CSRF do meta tag ou input hidden
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || 
                          document.querySelector('input[name="_csrf"]')?.value;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content') || 'X-CSRF-TOKEN';

        const formData = {
            nome: form.querySelector('input[name="nome"]').value,
            email: form.querySelector('input[name="email"]').value,
            senha: password,
            cpf: form.querySelector('input[name="cpf"]').value.replace(/\D/g, ''),
            telefone: form.querySelector('input[name="telefone"]').value.replace(/\D/g, ''),
            role: "CLIENTE"
        };

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            // Adicionar o token CSRF ao header se estiver disponível
            if (csrfToken) {
                headers[csrfHeader] = csrfToken;
            }

            const response = await fetch('/api/usuarios/cadastrar', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Conta criada com sucesso!');
                window.location.href = '/login';
            } else {
                const errorData = await response.json().catch(() => {
                    return { message: 'Erro ao criar conta. Status: ' + response.status };
                });
                alert(errorData.message || 'Erro ao criar conta. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor. Por favor, tente novamente.');
        }
    });
});