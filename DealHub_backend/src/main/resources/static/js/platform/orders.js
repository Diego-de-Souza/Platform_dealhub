document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const ordersList = document.getElementById('ordersList');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const filterButton = document.getElementById('filterButton');
    const filtersContainer = document.getElementById('filtersContainer');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const dateRangeGroup = document.getElementById('dateRangeGroup');
    const applyFilters = document.getElementById('applyFilters');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const orderModal = document.getElementById('orderModal');
    const closeModal = document.getElementById('closeModal');
    const modalOrderTitle = document.getElementById('modalOrderTitle');
    const orderDetails = document.getElementById('orderDetails');
    const printOrder = document.getElementById('printOrder');
    const saveChanges = document.getElementById('saveChanges');

    // Variáveis de estado
    let currentPage = 1;
    let totalPages = 1;
    let currentFilters = {
        search: '',
        status: 'all',
        date: 'all',
        startDate: '',
        endDate: ''
    };
    let selectedOrder = null;

    // Dados de exemplo (substituir por chamada API real)
    const sampleOrders = [
        {
            id: '1001',
            date: new Date().toISOString().split('T')[0],
            customer: 'João Silva',
            email: 'joao@example.com',
            phone: '(11) 98765-4321',
            items: [
                { product: 'Smartphone XYZ', quantity: 1, price: 1999.90 },
                { product: 'Capa Protetora', quantity: 1, price: 89.90 }
            ],
            subtotal: 2089.80,
            shipping: 15.90,
            total: 2105.70,
            status: 'delivered',
            shippingAddress: 'Av. Paulista, 1000 - São Paulo/SP',
            paymentMethod: 'Cartão de Crédito'
        },
        {
            id: '1002',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            customer: 'Maria Oliveira',
            email: 'maria@example.com',
            phone: '(21) 99876-5432',
            items: [
                { product: 'Notebook Ultra', quantity: 1, price: 4599.00 },
                { product: 'Mouse Sem Fio', quantity: 1, price: 129.90 }
            ],
            subtotal: 4728.90,
            shipping: 0,
            total: 4728.90,
            status: 'processing',
            shippingAddress: 'Rua do Ouvidor, 50 - Rio de Janeiro/RJ',
            paymentMethod: 'PIX'
        },
        {
            id: '1003',
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
            customer: 'Carlos Souza',
            email: 'carlos@example.com',
            phone: '(31) 98765-1234',
            items: [
                { product: 'Fones de Ouvido', quantity: 2, price: 199.90 },
                { product: 'Carregador Portátil', quantity: 1, price: 159.90 }
            ],
            subtotal: 559.70,
            shipping: 12.50,
            total: 572.20,
            status: 'shipped',
            shippingAddress: 'Av. Afonso Pena, 2000 - Belo Horizonte/MG',
            paymentMethod: 'Boleto Bancário'
        },
        {
            id: '1004',
            date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
            customer: 'Ana Costa',
            email: 'ana@example.com',
            phone: '(41) 99876-4321',
            items: [
                { product: 'Smart TV 55"', quantity: 1, price: 3299.00 },
                { product: 'Suporte para TV', quantity: 1, price: 199.90 }
            ],
            subtotal: 3498.90,
            shipping: 0,
            total: 3498.90,
            status: 'pending',
            shippingAddress: 'Rua XV de Novembro, 500 - Curitiba/PR',
            paymentMethod: 'Cartão de Crédito'
        },
        {
            id: '1005',
            date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
            customer: 'Pedro Alves',
            email: 'pedro@example.com',
            phone: '(51) 98765-6789',
            items: [
                { product: 'Console de Games', quantity: 1, price: 2499.90 },
                { product: 'Controle Extra', quantity: 1, price: 299.90 },
                { product: 'Jogo Exclusivo', quantity: 1, price: 199.90 }
            ],
            subtotal: 2999.70,
            shipping: 25.90,
            total: 3025.60,
            status: 'cancelled',
            shippingAddress: 'Av. Borges de Medeiros, 100 - Porto Alegre/RS',
            paymentMethod: 'Cartão de Crédito'
        }
    ];

    // Função para carregar pedidos
    function loadOrders() {
        // Filtra os pedidos com base nos filtros atuais
        let filteredOrders = sampleOrders.filter(order => {
            // Filtro de busca
            const searchMatch =
                order.id.includes(currentFilters.search) ||
                order.customer.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                order.email.toLowerCase().includes(currentFilters.search.toLowerCase());

            // Filtro de status
            const statusMatch =
                currentFilters.status === 'all' ||
                order.status === currentFilters.status;

            // Filtro de data
            let dateMatch = true;
            if (currentFilters.date === 'today') {
                const today = new Date().toISOString().split('T')[0];
                dateMatch = order.date === today;
            } else if (currentFilters.date === 'week') {
                const oneWeekAgo = new Date(Date.now() - 604800000).toISOString().split('T')[0];
                dateMatch = order.date >= oneWeekAgo;
            } else if (currentFilters.date === 'month') {
                const oneMonthAgo = new Date(Date.now() - 2592000000).toISOString().split('T')[0];
                dateMatch = order.date >= oneMonthAgo;
            } else if (currentFilters.date === 'custom' && currentFilters.startDate && currentFilters.endDate) {
                dateMatch = order.date >= currentFilters.startDate && order.date <= currentFilters.endDate;
            }

            return searchMatch && statusMatch && dateMatch;
        });

        // Atualiza paginação
        totalPages = Math.max(1, Math.ceil(filteredOrders.length / 5)); // 5 itens por página para exemplo
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        // Atualiza controles de paginação
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        // Pega os pedidos para a página atual
        const startIndex = (currentPage - 1) * 5;
        const paginatedOrders = filteredOrders.slice(startIndex, startIndex + 5);

        // Renderiza os pedidos
        renderOrders(paginatedOrders);
    }

    // Função para renderizar os pedidos na tabela
    function renderOrders(orders) {
        ordersList.innerHTML = '';

        if (orders.length === 0) {
            ordersList.innerHTML = '<div class="no-orders">Nenhum pedido encontrado</div>';
            return;
        }

        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';

            // Formata a data
            const formattedDate = new Date(order.date).toLocaleDateString('pt-BR');

            // Formata o valor
            const formattedValue = order.total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            // Mapeia os status para classes CSS
            const statusMap = {
                'pending': 'Pendente',
                'processing': 'Processando',
                'shipped': 'Enviado',
                'delivered': 'Entregue',
                'cancelled': 'Cancelado'
            };

            orderElement.innerHTML = `
                <div class="order-id" data-label="Pedido">${order.id}</div>
                <div class="order-date" data-label="Data">${formattedDate}</div>
                <div class="order-customer" data-label="Cliente">${order.customer}</div>
                <div class="order-value" data-label="Valor">${formattedValue}</div>
                <div class="order-status">
                    <span class="status-badge status-${order.status}">${statusMap[order.status]}</span>
                </div>
            `;

            ordersList.appendChild(orderElement);
        });

        // Adiciona event listeners aos botões
        document.querySelectorAll('.view-order').forEach(button => {
            button.addEventListener('click', () => openOrderModal(button.dataset.id, 'view'));
        });

        document.querySelectorAll('.edit-order').forEach(button => {
            button.addEventListener('click', () => openOrderModal(button.dataset.id, 'edit'));
        });
    }

    // Função para abrir o modal de detalhes do pedido
    function openOrderModal(orderId, mode) {
        const order = sampleOrders.find(o => o.id === orderId);
        if (!order) return;

        selectedOrder = order;

        // Atualiza o título do modal
        modalOrderTitle.textContent = `Detalhes do Pedido #${order.id}`;

        // Formata os dados para exibição
        const formattedDate = new Date(order.date).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const formattedSubtotal = order.subtotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const formattedShipping = order.shipping.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const formattedTotal = order.total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // Renderiza os itens do pedido
        let itemsHtml = '';
        order.items.forEach(item => {
            const itemTotal = item.quantity * item.price;
            const formattedPrice = item.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            const formattedItemTotal = itemTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            itemsHtml += `
                <div class="order-item-detail">
                    <div class="item-name">${item.product} (${item.quantity}x)</div>
                    <div class="item-price">${formattedPrice}</div>
                    <div class="item-total">${formattedItemTotal}</div>
                </div>
            `;
        });

        // Renderiza o status com opções de seleção se estiver no modo edição
        let statusHtml = '';
        if (mode === 'edit') {
            statusHtml = `
                <div class="form-group">
                    <label for="orderStatus">Status:</label>
                    <select id="orderStatus" class="form-select">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendente</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processando</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Entregue</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
            `;
        } else {
            const statusMap = {
                'pending': 'Pendente',
                'processing': 'Processando',
                'shipped': 'Enviado',
                'delivered': 'Entregue',
                'cancelled': 'Cancelado'
            };

            statusHtml = `
                <div class="info-group">
                    <label>Status:</label>
                    <span class="status-badge status-${order.status}">${statusMap[order.status]}</span>
                </div>
            `;
        }

        // Monta o conteúdo completo do modal
        orderDetails.innerHTML = `
            <div class="order-section">
                <h3>Informações do Pedido</h3>
                <div class="info-group">
                    <label>Número do Pedido:</label>
                    <span>${order.id}</span>
                </div>
                <div class="info-group">
                    <label>Data:</label>
                    <span>${formattedDate}</span>
                </div>
                ${statusHtml}
                <div class="info-group">
                    <label>Método de Pagamento:</label>
                    <span>${order.paymentMethod}</span>
                </div>
                <div class="info-group">
                    <label>Total:</label>
                    <span class="order-total">${formattedTotal}</span>
                </div>
            </div>
            
            <div class="order-section">
                <h3>Informações do Cliente</h3>
                <div class="info-group">
                    <label>Nome:</label>
                    <span>${order.customer}</span>
                </div>
                <div class="info-group">
                    <label>E-mail:</label>
                    <span>${order.email}</span>
                </div>
                <div class="info-group">
                    <label>Telefone:</label>
                    <span>${order.phone}</span>
                </div>
                <div class="info-group">
                    <label>Endereço de Entrega:</label>
                    <span>${order.shippingAddress}</span>
                </div>
            </div>
            
            <div class="order-section">
                <h3>Itens do Pedido</h3>
                <div class="order-items-header">
                    <div class="item-name-header">Produto</div>
                    <div class="item-price-header">Preço Unitário</div>
                    <div class="item-total-header">Total</div>
                </div>
                ${itemsHtml}
                <div class="order-summary">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>${formattedSubtotal}</span>
                    </div>
                    <div class="summary-row">
                        <span>Frete:</span>
                        <span>${formattedShipping}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>${formattedTotal}</span>
                    </div>
                </div>
            </div>
        `;

        // Mostra o modal
        orderModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Função para fechar o modal
    function closeOrderModal() {
        orderModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Event Listeners
    searchButton.addEventListener('click', () => {
        currentFilters.search = searchInput.value;
        currentPage = 1;
        loadOrders();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentFilters.search = searchInput.value;
            currentPage = 1;
            loadOrders();
        }
    });

    filterButton.addEventListener('click', () => {
        filtersContainer.style.display = filtersContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    dateFilter.addEventListener('change', () => {
        dateRangeGroup.style.display = dateFilter.value === 'custom' ? 'flex' : 'none';
    });

    applyFilters.addEventListener('click', () => {
        currentFilters.status = statusFilter.value;
        currentFilters.date = dateFilter.value;

        if (dateFilter.value === 'custom') {
            currentFilters.startDate = document.getElementById('startDate').value;
            currentFilters.endDate = document.getElementById('endDate').value;
        } else {
            currentFilters.startDate = '';
            currentFilters.endDate = '';
        }

        currentPage = 1;
        loadOrders();
        filtersContainer.style.display = 'none';
    });

    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadOrders();
        }
    });

    nextPage.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadOrders();
        }
    });

    closeModal.addEventListener('click', closeOrderModal);

    printOrder.addEventListener('click', () => {
        window.print();
    });

    saveChanges.addEventListener('click', () => {
        if (!selectedOrder) return;

        // Atualiza o status do pedido
        if (document.getElementById('orderStatus')) {
            selectedOrder.status = document.getElementById('orderStatus').value;

            // Aqui você faria a chamada AJAX para atualizar no servidor
            console.log('Atualizando pedido:', selectedOrder);

            // Fecha o modal e recarrega a lista
            closeOrderModal();
            loadOrders();

            // Mostra feedback visual
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = 'Pedido atualizado com sucesso!';
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        toast.remove();
                    }, 300);
                }, 3000);
            }, 100);
        }
    });

    // Fechar modal ao clicar fora
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            closeOrderModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && orderModal.style.display === 'flex') {
            closeOrderModal();
        }
    });

    // Carrega os pedidos inicialmente
    loadOrders();

    // Atualiza as datas para o filtro
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').max = today;
    document.getElementById('endDate').max = today;
    document.getElementById('endDate').min = document.getElementById('startDate').value;

    document.getElementById('startDate').addEventListener('change', function() {
        document.getElementById('endDate').min = this.value;
    });
});