package com.fesa.dealhub.repository;

import com.fesa.dealhub.enums.StatusPedido;
import com.fesa.dealhub.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Consultas básicas
    List<Pedido> findByUsuarioId(Long usuarioId);
    Optional<Pedido> findByCodigoTransacao(String codigoTransacao);
    List<Pedido> findByStatusIn(List<StatusPedido> status);

    // Métricas de pedidos
    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.dataPedido >= :dataInicio")
    Long countPedidosDesde(@Param("dataInicio") LocalDateTime dataInicio);

    @Query("SELECT p.status as status, COUNT(p) as total FROM Pedido p GROUP BY p.status")
    List<Map<String, Object>> countPedidosAgrupadosPorStatus();

    @Query("SELECT SUM(p.total) FROM Pedido p WHERE DATE(p.dataPedido) = CURRENT_DATE")
    Double calcularReceitaHoje();

    @Query("SELECT AVG(p.total) FROM Pedido p WHERE DATE(p.dataPedido) = CURRENT_DATE")
    Double calcularTicketMedio();

    @Query("SELECT SUM(i.quantidade) FROM ItemPedido i WHERE DATE(i.pedido.dataPedido) = CURRENT_DATE")
    Long sumItensVendidosHoje();

    // Métricas de usuários (simplificado)
    @Query(value = """
        SELECT COUNT(DISTINCT p.usuario_id) 
        FROM pedidos p 
        WHERE p.data_pedido BETWEEN :inicio AND :fim
        """, nativeQuery = true)
    Long countUsuariosPorPeriodo(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim);

    // Métricas de tendência
    @Query(value = """
        SELECT DATE(p.data_pedido) as data, 
               COUNT(p.id) as totalPedidos, 
               SUM(p.total) as receita 
        FROM pedidos p 
        WHERE p.data_pedido >= :dataInicio 
        GROUP BY DATE(p.data_pedido)
        """, nativeQuery = true)
    List<Object[]> findMetricasTendencia(@Param("dataInicio") LocalDateTime dataInicio);

    // Método simplificado para cálculo de taxa de retorno
    default Double calcularTaxaRetorno(
            LocalDateTime inicioAtual,
            LocalDateTime fimAtual,
            LocalDateTime inicioAnterior,
            LocalDateTime fimAnterior) {

        Long usuariosAtuais = countUsuariosPorPeriodo(inicioAtual, fimAtual);
        Long usuariosAnteriores = countUsuariosPorPeriodo(inicioAnterior, fimAnterior);

        return usuariosAnteriores == 0 ? 0.0 : (usuariosAtuais * 100.0) / usuariosAnteriores;
    }
}