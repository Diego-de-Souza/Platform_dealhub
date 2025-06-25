package com.fesa.dealhub.dto;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubcategoriaDTO {
    private Long id;
    private String nome;
    private Long categoriaId;

    public SubcategoriaDTO(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }
}
