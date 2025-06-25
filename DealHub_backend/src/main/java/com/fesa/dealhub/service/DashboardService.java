package com.fesa.dealhub.service;

import com.fesa.dealhub.enums.StatusPedido;
import com.fesa.dealhub.model.*;
import com.fesa.dealhub.repository.PedidoRepository;
import com.fesa.dealhub.repository.ProdutoRepository;
import com.fesa.dealhub.repository.UsuarioRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MeterRegistry meterRegistry;

    public DashboardMetrics carregarMetricasCompletas() {
        registrarMetricasTempoReal();
        LocalDateTime agora = LocalDateTime.now();

        return DashboardMetrics.builder()
                // Métricas de vendas
                .totalPedidosUltimaHora(10L)
                .pedidosPorStatus(pedidoRepository.countPedidosAgrupadosPorStatus()
                        .stream()
                        .collect(Collectors.toMap(
                                r -> StatusPedido.valueOf((String) r.get("status")),
                                r -> (Long) r.get("total")
                        )))
                .receitaTotalHoje(pedidoRepository.calcularReceitaHoje() != null ?
                        pedidoRepository.calcularReceitaHoje() : 125210.20)
                .ticketMedio(pedidoRepository.calcularTicketMedio() != null ?
                        pedidoRepository.calcularTicketMedio() : 0.0)

                // Métricas de produtos
                .produtoMaisVendido(produtoRepository.findProdutoMaisVendido()
                        .map(Produto::getNome)
                        .orElse("Nenhum produto vendido"))
                .itensVendidosHoje(pedidoRepository.sumItensVendidosHoje() != null ?
                        pedidoRepository.sumItensVendidosHoje() : 0L)
                .quantidadeProdutos(Math.toIntExact(produtoRepository.countTotalProdutos()))

                // Métricas de usuários
                .novosUsuariosUltimaSemana(usuarioRepository.countNovosUsuariosDesde(agora.minusWeeks(1)))
                .taxaRetornoUsuarios(calcularTaxaRetorno())
                .usuariosRecorrentes(usuarioRepository.findTop5UsuariosRecorrentes()
                        .stream()
                        .map(u -> {
                            List<Pedido> pedidos = pedidoRepository.findByUsuarioId(u.getId());
                            return new MetricaUsuario(
                                    u.getNome(),
                                    Long.valueOf(pedidos.size()),
                                    Double.valueOf(pedidos.stream().mapToDouble(Pedido::getTotal).sum())
                            );
                        })
                        .collect(Collectors.toList()))
                .tendenciaVendas7Dias(pedidoRepository.findMetricasTendencia(agora.minusDays(7))
                        .stream()
                        .map(r -> new MetricaTendencia(
                                ((java.sql.Date) r[0]).toLocalDate(),
                                (Long) r[1],
                                (Double) r[2]
                        ))
                        .collect(Collectors.toList()))
                .build();
    }

    private void registrarMetricasTempoReal() {
        meterRegistry.gauge("pedidos.ultima_hora",
                pedidoRepository.countPedidosDesde(LocalDateTime.now().minusHours(1)));
    }

    private Double calcularTaxaRetorno() {
        LocalDateTime agora = LocalDateTime.now();
        return pedidoRepository.calcularTaxaRetorno(
                agora.minusMonths(1), agora,
                agora.minusMonths(2), agora.minusMonths(1)
        );
    }
}