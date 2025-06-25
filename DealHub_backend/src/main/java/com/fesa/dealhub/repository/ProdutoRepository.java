package com.fesa.dealhub.repository;

import com.fesa.dealhub.enums.StatusProduto;
import com.fesa.dealhub.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @Query("SELECT ip.produto, SUM(ip.quantidade) as totalVendido " +
            "FROM ItemPedido ip " +
            "GROUP BY ip.produto " +
            "ORDER BY totalVendido DESC")
    List<Object[]> findProdutosMaisVendidos(Pageable pageable);

    default Optional<Produto> findProdutoMaisVendido() {
        return findProdutosMaisVendidos(Pageable.ofSize(1))
                .stream()
                .findFirst()
                .map(result -> (Produto) result[0]);
    }

    Integer countByEstoqueLessThan(Integer quantidade);

    List<Produto> findByDestaqueIsTrueAndVisivelIsTrueAndStatusNot(StatusProduto status, Pageable pageable);

    List<Produto> findByVisivelIsTrueAndStatusNot(StatusProduto status, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Produto p")
    Long countTotalProdutos();

}