package com.fesa.dealhub.repository;

import com.fesa.dealhub.model.ProdutoImagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoImagemRepository extends JpaRepository<ProdutoImagem, Long> {
    void deleteAll(Iterable<? extends ProdutoImagem> entities);
}
