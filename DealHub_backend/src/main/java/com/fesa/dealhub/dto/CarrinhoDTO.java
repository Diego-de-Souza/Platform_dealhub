package com.fesa.dealhub.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CarrinhoDTO {
    private Long id;
    private Long usuarioId;
    private List<ItemCarrinhoDTO> itens;
    private Double total;
    private LocalDateTime dataAtualizacao;
    private int totalItens;
}
