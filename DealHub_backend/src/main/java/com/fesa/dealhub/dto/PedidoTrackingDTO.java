package com.fesa.dealhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PedidoTrackingDTO {
    private Long id;
    private String status;
    private LocalDateTime dataPedido;
    private BigDecimal total;
    private String nomeUsuario;
    private LocalDateTime dataUltimaAtualizacao;
}