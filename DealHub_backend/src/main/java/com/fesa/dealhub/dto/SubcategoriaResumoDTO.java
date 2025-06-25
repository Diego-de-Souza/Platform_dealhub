package com.fesa.dealhub.dto;

public record SubcategoriaResumoDTO(
        Long id,
        String nome,
        Long quantidadeProdutos
) {
    public SubcategoriaResumoDTO(Object[] result) {
        this(
                ((com.fesa.dealhub.model.Subcategoria) result[0]).getId(),
                ((com.fesa.dealhub.model.Subcategoria) result[0]).getNome(),
                (Long) result[1]
        );
    }
}
