package com.fesa.dealhub.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ItemCarrinhoDTO {
    private Long id;
    private Long produtoId;
    private String nomeProduto;
    private String imagemProduto;
    private int quantidade;
    private double preco;
    private double subtotal;
    private LocalDateTime dataAdicao;
    private int estoqueDisponivel;
    private Long itemId; // Este é o campo que faltava
}