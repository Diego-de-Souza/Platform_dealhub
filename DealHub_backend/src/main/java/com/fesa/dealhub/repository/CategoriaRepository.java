package com.fesa.dealhub.repository;

import com.fesa.dealhub.model.Categoria;
import com.fesa.dealhub.model.Produto;
import com.fesa.dealhub.model.Subcategoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByNomeContainingIgnoreCase(String nome);

    Optional<Categoria> findByNomeIgnoreCase(String nome);

    @Query("SELECT c, COUNT(p), COUNT(s) " +
            "FROM Categoria c " +
            "LEFT JOIN c.produtos p " +
            "LEFT JOIN c.subcategorias s " +
            "GROUP BY c.id")
    Page<Object[]> findCategoriasWithCounts(Pageable pageable);
}