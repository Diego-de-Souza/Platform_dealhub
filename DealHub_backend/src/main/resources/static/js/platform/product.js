document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('status');
    const toggleText = document.querySelector('.toggle-text');

    toggle.addEventListener('change', function() {
        if(this.checked) {
            toggleText.textContent = 'Ativo';
            toggleText.style.color = '#4CAF50';
        } else {
            toggleText.textContent = 'Inativo';
            toggleText.style.color = '#f44336';
        }
    });

    // Inicializa o texto
    if(toggle.checked) {
        toggleText.textContent = 'Ativo';
        toggleText.style.color = '#4CAF50';
    } else {
        toggleText.textContent = 'Inativo';
        toggleText.style.color = '#f44336';
    }
});

document.getElementById('categoriaId').addEventListener('change', async function () {
    const categoriaId = this.value;
    const subcategoriaSelect = document.getElementById('subcategoriaId');
    const subcategoriaWrapper = document.getElementById('subcategoria-wrapper');

    // Limpa o select
    subcategoriaSelect.innerHTML = '<option value="">Selecione uma subcategoria</option>';

    if (!categoriaId) {
        subcategoriaWrapper.style.display = 'none';
        return;
    }

    try {
        const response = await fetch('/plataforma/admin-product/subcategorias?categoriaId=' + categoriaId, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const subcategorias = await response.json();

        subcategorias.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.id;
            option.textContent = sub.nome;
            subcategoriaSelect.appendChild(option);
        });

        subcategoriaWrapper.style.display = subcategorias.length ? 'block' : 'none';

    } catch (err) {
        console.error('Erro ao carregar subcategorias', err);
        subcategoriaWrapper.style.display = 'none';
    }
});

document.querySelector('input[type="file"][name="imagens"]').addEventListener('change', function () {
    const files = Array.from(this.files);
    if (files.length > 6) {
        alert('Selecione no máximo 6 imagens.');
        this.value = '';
        return;
    }
    for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
            alert(`O arquivo ${file.name} excede 5MB.`);
            this.value = '';
            break;
        }
    }
});

document.getElementById('categoriaId').addEventListener('change', function() {
    const categoriaId = this.value;
    const subcategoriaWrapper = document.getElementById('subcategoria-wrapper');
    const subcategoriaSelect = subcategoriaWrapper ? document.getElementById('subcategoriaId') : null;

    if (!categoriaId) {
        if (subcategoriaWrapper) subcategoriaWrapper.style.display = 'none';
        return;
    }

    fetch(`/plataforma/admin-product/subcategorias?categoriaId=${categoriaId}`)
        .then(response => response.json())
        .then(subcategorias => {
            if (!subcategoriaWrapper) {
                // Cria o wrapper se não existir
                const newWrapper = document.createElement('div');
                newWrapper.id = 'subcategoria-wrapper';
                newWrapper.className = 'form-group';
                newWrapper.innerHTML = `
                        <label for="subcategoriaId">Subcategoria</label>
                        <select id="subcategoriaId" name="subcategoriaId" class="form-control">
                            <option value="">Selecione uma subcategoria</option>
                            ${subcategorias.map(s => `<option value="${s.id}">${s.nome}</option>`).join('')}
                        </select>
                    `;
                this.parentNode.parentNode.appendChild(newWrapper);
            } else {
                // Atualiza as opções existentes
                subcategoriaSelect.innerHTML = `
                        <option value="">Selecione uma subcategoria</option>
                        ${subcategorias.map(s => `<option value="${s.id}">${s.nome}</option>`).join('')}
                    `;
                subcategoriaWrapper.style.display = 'block';
            }
        })
        .catch(error => console.error('Erro ao carregar subcategorias:', error));
});

// Validação do formulário
document.getElementById('editForm').addEventListener('submit', function(e) {
    const files = document.getElementById('novasImagens').files;
    if (files.length > 6) {
        alert('Você pode adicionar no máximo 6 novas imagens');
        e.preventDefault();
        return;
    }

    for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) {
            alert(`A imagem ${files[i].name} excede o tamanho máximo de 5MB`);
            e.preventDefault();
            return;
        }
    }
});