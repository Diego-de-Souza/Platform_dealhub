document.addEventListener('DOMContentLoaded', function() {
    // Máscaras para CPF, Telefone e CEP
    VMasker(document.getElementById('cpf')).maskPattern('999.999.999-99');
    VMasker(document.getElementById('telefone')).maskPattern('(99) 99999-9999');
    VMasker(document.getElementById('cep')).maskPattern('99999-999');

    // Busca automática do CEP
    document.getElementById('cep').addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado!');
                    return;
                }
                // Preenche os campos automaticamente
                document.getElementById('logradouro').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
            })
            .catch(() => alert('Erro ao buscar CEP.'));
    });
});