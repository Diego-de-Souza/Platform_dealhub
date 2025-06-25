document.addEventListener('DOMContentLoaded', function() {
    // Toggle submenus
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const parentItem = this.closest('.has-submenu');
            parentItem.classList.toggle('active');
        });
    });

    // Fechar submenus ao clicar em outro item
    const navLinks = document.querySelectorAll('.admin-sidebar-menu > .nav-item > .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if(this.parentElement.classList.contains('has-submenu')) {
                return; // Não faz nada se for um item com submenu
            }

            // Fecha todos os submenus
            document.querySelectorAll('.has-submenu').forEach(item => {
                item.classList.remove('active');
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.has-submenu > .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        });
    });
});

function initCharts(salesData, usersData, days) {
    new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                data: salesData,
                borderColor: '#4e73df'
            }]
        }
    });
}