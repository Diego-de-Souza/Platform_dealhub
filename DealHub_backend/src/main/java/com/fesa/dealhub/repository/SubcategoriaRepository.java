package com.fesa.dealhub.repository;

import com.fesa.dealhub.model.Subcategoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubcategoriaRepository extends JpaRepository<Subcategoria, Long> {
    //usado na plataforma
    @Query("SELECT s, COUNT(p) " +
            "FROM Subcategoria s " +
            "LEFT JOIN Produto p ON p.subcategoria = s " +
            "GROUP BY s.id")
    Page<Object[]> findSubcategoriasWithCounts(Pageable pageable);

    @Query("SELECT s FROM Subcategoria s WHERE s.categoria.id = :categoriaId")
    List<Subcategoria> findAllByCategoriaId(@Param("categoriaId") Long categoriaId);

}
