document.addEventListener('DOMContentLoaded', function () {
    const categoriaForm = document.getElementById('categoriaForm');

    if (categoriaForm) {
        categoriaForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            const requiredFields = this.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const errorElement = document.getElementById(`${field.id}-error`);

                if (!field.value.trim()) {
                    field.classList.add('invalid');
                    if (errorElement) {
                        errorElement.textContent = 'Este campo é obrigatório';
                    }
                    isValid = false;
                } else {
                    field.classList.remove('invalid');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                }
            });

            if (isValid) {
                this.submit();
            }
        });
    }
});
