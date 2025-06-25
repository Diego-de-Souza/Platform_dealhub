// AUTH-HELPER.JS
// Responsável por gerenciar autenticação no lado do cliente

// Função para verificar autenticação via Spring Security Session
async function isAuthenticated() {
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

// Função para obter token (mantida para compatibilidade, mas retorna null para sessões)
function getAuthToken() {
    return localStorage.getItem('jwtToken');
}

// Interceptador do fetch para adicionar headers necessários
(function() {
    const originalFetch = window.fetch;
    
    window.fetch = function(url, options = {}) {
        if (!options.headers) {
            options.headers = {};
        }

        if (!(options.body instanceof FormData)) {
            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        }
        
        options.headers['X-Requested-With'] = 'XMLHttpRequest';
        
        // Para sessões, não precisamos adicionar Authorization header
        // mas mantemos para compatibilidade se houver JWT
        const token = getAuthToken();
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return originalFetch(url, options);
    };
})();

// REMOVEMOS COMPLETAMENTE A VERIFICAÇÃO AUTOMÁTICA DE PÁGINAS PROTEGIDAS
// O Spring Security já cuida disso no servidor