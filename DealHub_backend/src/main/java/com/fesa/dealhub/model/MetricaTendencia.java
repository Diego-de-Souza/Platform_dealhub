package com.fesa.dealhub.model;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
public class MetricaTendencia {
    private final LocalDate data;
    private final Long totalPedidos;
    private final Double receita;

    // Required constructor for JPA query projection
    public MetricaTendencia(LocalDate data, Long totalPedidos, Double receita) {
        this.data = data;
        this.totalPedidos = totalPedidos;
        this.receita = receita;
    }
}