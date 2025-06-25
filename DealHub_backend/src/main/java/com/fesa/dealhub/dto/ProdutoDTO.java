package com.fesa.dealhub.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProdutoDTO {
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer estoque;
    private Long categoriaId;
    private Long subcategoriaId;
    private String imagemUrl;
}
