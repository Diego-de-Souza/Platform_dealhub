package com.fesa.dealhub.model;

import com.fesa.dealhub.enums.StatusPedido;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardMetrics {
    private Long totalPedidosUltimaHora;
    private Double receitaTotalHoje;
    private List<MetricaTendencia> tendenciaUltimos7Dias;

    private Double receitaTotalMes;
    private Long totalPedidosHoje;
    private Double ticketMedio;

    // Produtos
    private String produtoMaisVendido;
    private Long itensVendidosHoje;
    private Integer produtosComEstoqueBaixo;

    // Usuários (antes "Clientes")
    private Long novosUsuariosUltimaSemana; // renomeado
    private Double taxaRetornoUsuarios;     // renomeado

    // Pedidos
    private Map<StatusPedido, Long> pedidosPorStatus;
    private Long tempoMedioPreparoMinutos;

    // Tendências
    private List<MetricaTendencia> tendenciaVendas7Dias;
    private List<MetricaUsuario> usuariosRecorrentes; // renomeado

    private Integer quantidadeProdutos;

}
