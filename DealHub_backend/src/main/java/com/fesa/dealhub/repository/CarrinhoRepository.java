package com.fesa.dealhub.repository;

import com.fesa.dealhub.model.Carrinho;
import com.fesa.dealhub.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarrinhoRepository extends JpaRepository<Carrinho, Long> {
    Optional<Carrinho> findByUsuarioId(Long usuarioId);
    Optional<Carrinho> findByUsuario(Usuario usuario);
}
