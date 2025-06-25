package com.fesa.dealhub.dto;

import java.time.LocalDateTime;

public record CategoriaResumoDTO(
        Long id,
        String nome,
        String descricao,
        Boolean ativa,
        Long quantidadeProdutos,
        Long quantidadeSubcategorias
) {
    // Construtor adicional para facilitar o mapeamento
    public CategoriaResumoDTO(Object[] result) {
        this(
                ((com.fesa.dealhub.model.Categoria) result[0]).getId(),
                ((com.fesa.dealhub.model.Categoria) result[0]).getNome(),
                ((com.fesa.dealhub.model.Categoria) result[0]).getDescricao(),
                ((com.fesa.dealhub.model.Categoria) result[0]).isAtiva(),
                (Long) result[1],
                (Long) result[2]
        );
    }
}