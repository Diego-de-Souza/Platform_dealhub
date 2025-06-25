document.getElementById('registerForm').addEventListener('submit', function(e) {
    const categoriaSelect = document.getElementById('categoria');
    const nomeInput = document.getElementById('nome');
    let isValid = true;

    // Validação da categoria
    if (!categoriaSelect.value) {
        document.getElementById('categoria-error').textContent = 'Selecione uma categoria';
        isValid = false;
    } else {
        document.getElementById('categoria-error').textContent = '';
    }

    // Validação do nome
    if (!nomeInput.value.trim()) {
        document.getElementById('nome-error').textContent = 'Informe o nome da subcategoria';
        isValid = false;
    } else {
        document.getElementById('nome-error').textContent = '';
    }

    if (!isValid) {
        e.preventDefault();
    }
});