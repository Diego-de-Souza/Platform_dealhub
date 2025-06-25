package com.fesa.dealhub.repository;

import com.fesa.dealhub.model.ItemCarrinho;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {
    void deleteAllByCarrinhoId(Long carrinhoId);
}
