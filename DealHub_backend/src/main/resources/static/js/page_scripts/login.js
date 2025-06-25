document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de login carregada');

    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect');
    
    if (redirectParam) {
        localStorage.setItem('redirectAfterLogin', redirectParam);
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            console.log('Enviando formulário de login');
        });
    }
    
    if (typeof initCart === 'function') {
        initCart();
    }
});