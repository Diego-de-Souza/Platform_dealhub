function verificarAutenticacao() {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

function configurarHeaderAutorizacao() {
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        const token = localStorage.getItem('jwtToken');
        
        if (token) {
            options = options || {};
            if (!options.headers) {
                options.headers = {};
            }
            
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return originalFetch(url, options);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    configurarHeaderAutorizacao();
    
    const paginasProtegidas = ['/minha-conta', '/carrinho'];
    const paginaAtual = window.location.pathname;
    
    if (paginasProtegidas.includes(paginaAtual)) {
        verificarAutenticacao();
    }
});

window.authCheck = {
    verificarAutenticacao,
    configurarHeaderAutorizacao
};