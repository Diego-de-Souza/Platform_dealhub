document.addEventListener('DOMContentLoaded', function() {
    console.log('Página client_home carregada');

    // Função de notificação (se não estiver em um helper global)
    function showNotification(message, type = 'success') {
        const notificationArea = document.body;
        let notification = document.querySelector('.cart-notification');
        if (!notification) {
            notification = document.createElement('div');
            // Estilos básicos, podem ser aprimorados ou usar classes CSS existentes
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.padding = '15px 20px';
            notification.style.borderRadius = '4px';
            notification.style.color = 'white';
            notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            notification.style.zIndex = '1001';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            notification.style.fontWeight = 'bold';
            notificationArea.appendChild(notification);
        }
        // Aplicar classe CSS para estilização completa
        notification.className = 'cart-notification'; // Garante que os estilos de client_home.css sejam aplicados

        notification.textContent = message;
        if (type === 'success') {
            notification.style.backgroundColor = '#2ecc71'; // Verde (var(--accent-color) se definido globalmente)
        } else if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c'; // Vermelho
        } else if (type === 'warning') {
            notification.style.backgroundColor = '#f39c12'; // Amarelo
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }


    // Assumindo que initCart() e addToCart() vêm de cart-helper.js
    if (typeof initCart === 'function') {
        initCart();
    } else {
        console.warn('Função initCart não encontrada. Verifique cart-helper.js');
    }

    async function checkAuth() {
        try {
            const response = await fetch('/api/auth/check', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Not authenticated');
            const data = await response.json();
            return data.authenticated;
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return false;
        }
    }

    async function updateAuthUI() {
        const isLoggedIn = await checkAuth();
        console.log('Usuário autenticado:', isLoggedIn);

        document.querySelectorAll('.logged-in-only').forEach(el => {
            el.style.display = isLoggedIn ? '' : 'none';
        });

        document.querySelectorAll('.logged-out-only').forEach(el => {
            el.style.display = isLoggedIn ? 'none' : '';
        });
    }

    updateAuthUI();

    const cartButtons = document.querySelectorAll('.cart-icon, .cart-button, .cart-btn'); // Adicionado .cart-btn
    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = '/carrinho';
        });
    });

    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', async function() {
            const isLoggedIn = await checkAuth();

            if (isLoggedIn) {
                const id = parseInt(this.getAttribute('data-id'));
                const nome = this.getAttribute('data-nome');
                const preco = parseFloat(this.getAttribute('data-preco'));
                const imagem = this.getAttribute('data-imagem'); // Captura a imagem

                if (typeof addToCart === 'function') {
                    addToCart(id, nome, preco, 1, imagem); // Passa a imagem
                    showNotification('Produto adicionado ao carrinho!');
                } else {
                    console.error('Função addToCart não encontrada. Verifique cart-helper.js');
                    showNotification('Erro ao adicionar ao carrinho.', 'error');
                }
            } else {
                showNotification('Faça login para adicionar produtos ao carrinho', 'warning');
                setTimeout(() => {
                    window.location.href = '/login?redirect=/'; // Redireciona para login, pode voltar para home
                }, 1500);
            }
        });
    });
});
