// Arquivo: /static/js/page_scripts/carrinho.js

let NO_IMAGE_PATH = '/images/no-image.png';
let produtosCache = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página do carrinho carregada');
    
    // Carregar produtos para usar nas imagens
    fetchProdutos().then(() => {
        // Carregar o carrinho após buscar os produtos
        loadCart();
    });
    
    // Adicionar eventos aos botões
    setupEventListeners();
});

// Função para buscar todos os produtos e armazenar em cache
async function fetchProdutos() {
    try {
        const response = await fetch('/api/produtos/visiveis');
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        produtosCache = await response.json();
        console.log('Produtos carregados:', produtosCache.length);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        produtosCache = [];
    }
}

function setupEventListeners() {
    // Botão de finalizar compra
    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            handleCheckout();
        });
    }
    
    // Botão de aplicar cupom
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    // Enter no campo de cupom
    const couponInput = document.getElementById('couponInput');
    if (couponInput) {
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCoupon();
            }
        });
    }
}

async function handleCheckout() {
    try {
        // Verificar se o usuário está logado
        const isLoggedIn = await checkAuth();
        
        if (isLoggedIn) {
            // Se estiver logado, salvar carrinho no servidor e continuar
            const saved = await saveCartToServer();
            if (saved) {
                window.location.href = '/checkout';
            } else {
                showNotification('Erro ao salvar carrinho. Tente novamente.', 'error');
            }
        } else {
            // Se não estiver logado, redirecionar para login
            showNotification('É necessário fazer login para continuar', 'info');
            setTimeout(() => {
                window.location.href = '/login?redirect=/carrinho';
            }, 1500);
        }
    } catch (error) {
        console.error('Erro no checkout:', error);
        showNotification('Erro ao processar checkout. Tente novamente.', 'error');
    }
}

// Função para verificar autenticação
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) return false;
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false;
    }
}

// Função para exibir notificações
function showNotification(message, type = 'info') {
    // Se existir uma implementação de notificação no sistema, usar
    if (window.showToast) {
        window.showToast(message, type);
        return;
    }
    
    // Caso contrário, usar alert
    alert(message);
}

function loadCart() {
    console.log('Carregando itens do carrinho...');
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log('Carrinho contém:', cart.length, 'itens');
    
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');
    const cartItemsList = document.getElementById('cartItemsList');
    const itemCount = document.getElementById('itemCount');
    
    if (cart.length === 0) {
        // Mostrar mensagem de carrinho vazio
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartWithItems) cartWithItems.style.display = 'none';
        return;
    }
    
    // Mostrar carrinho com itens
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartWithItems) cartWithItems.style.display = 'block';
    
    // Atualizar contador de itens
    if (itemCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);
        itemCount.textContent = totalItems;
    }
    
    if (!cartItemsList) return;
    
    // Limpar lista atual
    cartItemsList.innerHTML = '';
    
    // Variável para calcular o subtotal
    let subtotal = 0;
    
    // Adicionar cada item ao carrinho
    cart.forEach((item, index) => {
        const itemTotal = item.preco * item.quantidade;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        // Encontrar produto completo no cache para obter a imagem
        const produtoCompleto = produtosCache ? produtosCache.find(p => p.id === item.id) : null;
        
        // Construir URL da imagem
        let imageUrl = NO_IMAGE_PATH;
        if (produtoCompleto && produtoCompleto.imagens && produtoCompleto.imagens.length > 0) {
            imageUrl = `/api/produtos/imagens/${produtoCompleto.imagens[0].id}`;
        }
        
        // Criar container de imagem
        const itemImageContainer = document.createElement('div');
        itemImageContainer.className = 'item-image-container';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = item.nome;
        img.className = 'item-image';
        img.onerror = function() {
            this.onerror = null;
            this.src = NO_IMAGE_PATH;
        };
        itemImageContainer.appendChild(img);
        
        // Criar detalhes do item
        const itemDetails = `
            <div class="item-details">
                <h3 class="item-name">${item.nome}</h3>
                <p class="item-price">R$ ${formatPrice(item.preco)}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                <input type="number" class="quantity-input" value="${item.quantidade}" min="1" 
                       data-index="${index}">
                <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
            </div>
            <div class="item-total">R$ ${formatPrice(itemTotal)}</div>
            <button class="remove-btn" data-index="${index}" title="Remover item">×</button>
        `;
        
        itemElement.innerHTML = itemDetails;
        itemElement.prepend(itemImageContainer);
        cartItemsList.appendChild(itemElement);
    });
    
    // Atualizar resumo
    updateSummary(subtotal);
    
    // Adicionar eventos aos botões após todos os itens serem carregados
    addItemEventListeners();
}

function addItemEventListeners() {
    // Botões de quantidade
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const action = this.getAttribute('data-action');
            
            if (action === 'increase') {
                updateCartItemQuantity(index, 1);
            } else if (action === 'decrease') {
                updateCartItemQuantity(index, -1);
            }
        });
    });
    
    // Inputs de quantidade
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            setQuantity(index, this.value);
        });
    });
    
    // Botões de remover
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeCartItem(index);
        });
    });
}

function setQuantity(index, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantidade = quantity;
        localStorage.setItem('carrinho', JSON.stringify(cart));
        loadCart();
        updateCartCounter();
    }
}

function updateCartItemQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (index >= 0 && index < cart.length) {
        cart[index].quantidade = Math.max(1, cart[index].quantidade + change);
        
        // Se a quantidade for menor ou igual a zero, remover o item
        if (cart[index].quantidade <= 0) {
            cart.splice(index, 1);
        }
        
        // Atualizar o carrinho no localStorage
        localStorage.setItem('carrinho', JSON.stringify(cart));
        
        // Recarregar o carrinho na interface
        loadCart();
        
        // Atualizar o contador no header
        updateCartCounter();
    }
}

function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (index >= 0 && index < cart.length) {
        const itemName = cart[index].nome;
        
        if (confirm(`Tem certeza que deseja remover "${itemName}" do carrinho?`)) {
            cart.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(cart));
            loadCart();
            updateCartCounter();
            showNotification('Item removido do carrinho', 'success');
        }
    }
}

function updateSummary(subtotal) {
    const shippingCost = subtotal > 0 ? 15.00 : 0;
    const discount = 0; // Implementar lógica de cupons posteriormente
    const total = subtotal + shippingCost - discount;
    
    const subtotalElement = document.getElementById('cartSubtotal');
    const shippingElement = document.getElementById('shippingCost');
    const totalElement = document.getElementById('cartTotal');
    
    if (subtotalElement) subtotalElement.textContent = `R$ ${formatPrice(subtotal)}`;
    if (shippingElement) shippingElement.textContent = shippingCost > 0 ? `R$ ${formatPrice(shippingCost)}` : 'Grátis';
    if (totalElement) totalElement.textContent = `R$ ${formatPrice(total)}`;
    
    // Habilitar/desabilitar botão de checkout
    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.disabled = subtotal === 0;
    }
}

function formatPrice(price) {
    return price.toFixed(2).replace('.', ',');
}

function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    if (!couponInput) return;
    
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        showNotification('Por favor, digite um código de cupom.', 'warning');
        return;
    }
    
    // Mock de cupons válidos - implementar integração com backend
    const validCoupons = {
        'DESCONTO10': { discount: 10, name: 'Desconto de 10%' },
        'PRIMEIRACOMPRA': { discount: 15, name: 'Primeira Compra - 15%' },
        'FRETEGRATIS': { discount: 5, name: 'Desconto de 5%' }
    };
    
    if (validCoupons[couponCode]) {
        showNotification(`Cupom "${couponCode}" aplicado com sucesso! ${validCoupons[couponCode].name}`, 'success');
        couponInput.value = '';
        // Implementar aplicação do desconto
        loadCart();
    } else {
        showNotification('Cupom inválido. Tente novamente.', 'error');
    }
}

// Função para salvar o carrinho no servidor (antes do checkout)
async function saveCartToServer() {
    try {
        const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        if (cart.length === 0) {
            return true;
        }
        
        const cartData = {
            itens: cart.map(item => ({
                produtoId: item.id, // Alterado de produtoId para id para consistência
                quantidade: item.quantidade
            }))
        };
        
        const response = await fetch('/api/carrinho', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartData),
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao salvar carrinho');
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao salvar carrinho no servidor:', error);
        return false;
    }
}

// Função para atualizar contador no header (se existir)
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);

    const cartCounter = document.querySelector('.cart-count');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Função para renderizar os itens do carrinho - solução específica para o problema da imagem
function renderCartItems(cart) {
    const cartItemsList = document.getElementById('cartItemsList');
    const itemCountSpan = document.getElementById('itemCount');
    
    if (!cartItemsList || !itemCountSpan) return;
    
    cartItemsList.innerHTML = ''; // Clear existing items
    itemCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantidade, 0);

    cart.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('cart-item-card');
        itemCard.dataset.productId = item.id; // Store product ID for easier manipulation

        // Encontrar produto completo no cache para obter a imagem
        const produtoCompleto = produtosCache ? produtosCache.find(p => p.id === item.id) : null;
        
        // Construir URL da imagem
        let imageUrl = NO_IMAGE_PATH;
        if (produtoCompleto && produtoCompleto.imagens && produtoCompleto.imagens.length > 0) {
            imageUrl = `/api/produtos/imagens/${produtoCompleto.imagens[0].id}`;
        }

        itemCard.innerHTML = `
            <img src="${imageUrl}" alt="${item.nome}" class="item-image" 
                 onerror="this.onerror=null; this.src='${NO_IMAGE_PATH}';">
            <div class="item-details">
                <div class="item-name">${item.nome}</div>
                <div class="item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                <div class="quantity-control">
                    <button class="quantity-btn decrement">-</button>
                    <input type="number" value="${item.quantidade}" min="1" class="item-quantity" data-product-id="${item.id}">
                    <button class="quantity-btn increment">+</button>
                </div>
            </div>
            <button class="remove-item-btn" data-product-id="${item.id}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Remover
            </button>
        `;
        cartItemsList.appendChild(itemCard);
    });

    attachEventListenersToCartItems();
}

// Função para anexar event listeners aos itens do carrinho
function attachEventListenersToCartItems() {
    // Botões de incremento e decremento
    document.querySelectorAll('.quantity-btn.increment').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.parentElement.querySelector('.item-quantity').dataset.productId;
            updateQuantity(productId, 1);
        });
    });

    document.querySelectorAll('.quantity-btn.decrement').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.parentElement.querySelector('.item-quantity').dataset.productId;
            updateQuantity(productId, -1);
        });
    });

    // Inputs de quantidade
    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.productId;
            const newQuantity = parseInt(this.value);
            if (newQuantity > 0) {
                setExactQuantity(productId, newQuantity);
            } else {
                this.value = 1; // Restaurar para 1 se o valor for inválido
            }
        });
    });

    // Botões de remover
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            removeFromCart(productId);
        });
    });
}

// Funções auxiliares para a manipulação do carrinho
function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const index = cart.findIndex(item => item.id.toString() === productId.toString());
    
    if (index !== -1) {
        cart[index].quantidade = Math.max(1, cart[index].quantidade + change);
        localStorage.setItem('carrinho', JSON.stringify(cart));
        renderCartItems(cart);
        updateCartCounter();
    }
}

function setExactQuantity(productId, quantity) {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const index = cart.findIndex(item => item.id.toString() === productId.toString());
    
    if (index !== -1) {
        cart[index].quantidade = Math.max(1, quantity);
        localStorage.setItem('carrinho', JSON.stringify(cart));
        renderCartItems(cart);
        updateCartCounter();
    }
}

function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const index = cart.findIndex(item => item.id.toString() === productId.toString());
    
    if (index !== -1) {
        const itemName = cart[index].nome;
        
        if (confirm(`Tem certeza que deseja remover "${itemName}" do carrinho?`)) {
            cart.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(cart));
            renderCartItems(cart);
            updateCartCounter();
            showNotification('Item removido do carrinho', 'success');
        }
    }
}