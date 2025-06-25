// Sugestão para js/helpers/cart-helper.js

const CART_STORAGE_KEY = 'dealHubCart';

function getCart() {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCounter();
}

function addToCart(id, nome, preco, quantidade, imagem) {
    let cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantidade += quantidade;
    } else {
        // Certifique-se de que os nomes das propriedades são consistentes
        // A página carrinho.html usará: id, nome, preco, quantidade, imagem
        cart.push({ id, nome, preco, quantidade, imagem });
    }
    saveCart(cart);
}

function updateItemQuantity(id, novaQuantidade) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        if (novaQuantidade > 0) {
            cart[itemIndex].quantidade = novaQuantidade;
        } else {
            cart.splice(itemIndex, 1); // Remove se quantidade for 0 ou menor
        }
        saveCart(cart);
    }
}

function removeItemFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartCounter();
}

function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);

    // Tenta atualizar contadores em diferentes possíveis navbars/locais
    const counters = document.querySelectorAll('.cart-count, #cartCount');
    counters.forEach(counter => {
        if (counter) {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'flex' : 'none'; // 'flex' ou 'inline-block' dependendo do CSS
        }
    });
}

function initCart() {
    updateCartCounter();
}

