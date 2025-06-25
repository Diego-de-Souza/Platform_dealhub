document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os campos e o botão
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmarSenha');
    const terms = document.getElementById('terms');
    const submitButton = document.getElementById('submitButton');

    // Função para verificar se todos os campos estão válidos
    function validateForm() {
        const isEmailValid = email.value.includes('@') && email.value.includes('.');
        const isPasswordValid = senha.value.length >= 6;
        const isPasswordMatch = senha.value === confirmarSenha.value;
        const isTermsAccepted = terms.checked;

        // Habilita o botão apenas se tudo estiver válido
        submitButton.disabled = !(isEmailValid && isPasswordValid && isPasswordMatch && isTermsAccepted);
    }

    // Adiciona listeners para cada campo relevante
    email.addEventListener('input', validateForm);
    senha.addEventListener('input', validateForm);
    confirmarSenha.addEventListener('input', validateForm);
    terms.addEventListener('change', validateForm);

    // Validação inicial (caso algum campo venha pré-preenchido)
    validateForm();
});