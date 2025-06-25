package com.fesa.dealhub.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MetricaUsuario {
    private String nome;
    private Long totalPedidos;
    private Number totalGasto;
}

