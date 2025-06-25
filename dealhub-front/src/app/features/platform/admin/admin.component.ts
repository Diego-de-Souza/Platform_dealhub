import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';
import { Chart, ChartOptions } from 'chart.js';

@Component({
  selector: 'dealhub-admin',
  standalone: true,
  imports: [CommonModule, MenuAsideComponent, HeaderPlatformComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit, OnDestroy {

  dashboardMetrics = {
    totalUsuarios: 1234,
    totalProdutos: 567,
    vendasHoje: 1245.67,
    pedidosUltimaHora: 10,
  };

  // Refs dos canvas
  @ViewChild('salesTrendChart') salesTrendChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ordersByStatusChart') ordersByStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('usersMetricsChart') usersMetricsChartRef!: ElementRef<HTMLCanvasElement>;

  salesTrendChart!: Chart;
  ordersByStatusChart!: Chart;
  usersMetricsChart!: Chart;

  salesTrendLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  salesTrendData = [50, 25, 30, 36, 40, 55, 60];

  ordersByStatusLabels = ['Pendente', 'Processando', 'Concluído', 'Cancelado', 'Reembolsado'];
  ordersByStatusData = [30, 50, 120, 15, 5];

  usersMetricsLabels = ['Novos Usuários', 'Taxa de Retorno'];
  usersMetricsData = [100, 75];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
      }
    },
    scales: {
      y: { beginAtZero: true },
      x: {}
    }
  };

  ngAfterViewInit(): void {
    this.salesTrendChart = new Chart(this.salesTrendChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.salesTrendLabels,
        datasets: [{
          label: 'Receita (R$)',
          data: this.salesTrendData,
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78, 115, 223, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: this.chartOptions
    });

    this.ordersByStatusChart = new Chart(this.ordersByStatusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.ordersByStatusLabels,
        datasets: [{
          data: this.ordersByStatusData,
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%', // corte central do doughnut
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 12
          }
        }
      } as any
    });

    this.usersMetricsChart = new Chart(this.usersMetricsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.usersMetricsLabels,
        datasets: [{
          label: 'Quantidade',
          data: this.usersMetricsData,
          backgroundColor: ['rgba(28, 200, 138, 0.8)', 'rgba(246, 194, 62, 0.8)'],
          borderRadius: 6
        }]
      },
      options: {
        ...this.chartOptions,
        indexAxis: 'y',
        scales: {
          x: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.salesTrendChart?.destroy();
    this.ordersByStatusChart?.destroy();
    this.usersMetricsChart?.destroy();
  }
}
