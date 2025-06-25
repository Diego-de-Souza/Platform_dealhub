package com.fesa.dealhub.repository;

import com.fesa.dealhub.model.DashboardMetrics;
import com.fesa.dealhub.model.MetricaUsuario;
import com.fesa.dealhub.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);

    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.dataCadastro >= :dataInicio")
    Long countNovosUsuariosDesde(@Param("dataInicio") LocalDateTime dataInicio);

    @Query("SELECT COUNT(DISTINCT p.usuario) FROM Pedido p WHERE p.dataPedido >= :dataInicio")
    Long countUsuariosAtivos(@Param("dataInicio") LocalDateTime dataInicio);

    @Query(value = "SELECT u.* FROM usuarios u " +
            "JOIN pedidos p ON p.usuario_id = u.id " +
            "GROUP BY u.id " +
            "ORDER BY COUNT(p.id) DESC " +
            "LIMIT 5", nativeQuery = true)
    List<Usuario> findTop5UsuariosRecorrentes();

    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.endereco WHERE u.id = :id")
    Optional<Usuario> buscarUsuarioComEndereco(@Param("id") Long id);
}