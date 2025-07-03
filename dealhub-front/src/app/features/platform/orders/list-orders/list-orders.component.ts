import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from 'app/core/services/order/order.service';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-list-orders',
  imports: [CommonModule, HeaderPlatformComponent, MenuAsideComponent, FormsModule, RouterModule],
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.scss'
})
export class ListOrdersComponent implements OnInit {
   searchTerm = '';
  showFilters = false;
  filterStatus = 'all';
  filterDate = 'all';
  customStartDate: string = '';

  customEndDate: string = '';

  currentPage = 0;
  itemsPerPage = 10;

  orders = [
    { id: 1001, data: '2024-06-01', cliente: 'João Silva', valor: 320.50, status: 'pending' },
    { id: 1002, data: '2024-06-03', cliente: 'Maria Souza', valor: 150.75, status: 'processing' },
    { id: 1003, data: '2024-06-05', cliente: 'Carlos Lima', valor: 580.00, status: 'shipped' },
    { id: 1004, data: '2024-06-07', cliente: 'Ana Paula', valor: 75.30, status: 'delivered' },
    { id: 1005, data: '2024-06-09', cliente: 'Rafael Costa', valor: 230.10, status: 'cancelled' },
    // ...simulados
  ];

  constructor(private orderService: OrderService) {}
  
  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        console.log('Orders fetched successfully:', data);
        this.orders = {
          ...data.pedido
        };
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  handleDateFilter() {
    if (this.filterDate !== 'custom') {
      this.customStartDate = '';
      this.customEndDate = '';
    }
  }

  filteredOrders() {
    let filtered = this.orders.filter(o => 
      o.cliente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      o.id.toString().includes(this.searchTerm)
    );

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === this.filterStatus);
    }

    // Simplesmente ignorando filtro de datas nesse exemplo
    const start = this.currentPage * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  applyFilters() {
    this.currentPage = 0;
  }

  get totalPages() {
    return Math.ceil(this.orders.length / this.itemsPerPage);
  }

  totalPagesArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  previousPage() {
    if (this.currentPage > 0) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

}
