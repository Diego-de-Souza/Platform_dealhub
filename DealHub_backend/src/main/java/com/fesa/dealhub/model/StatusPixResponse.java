package com.fesa.dealhub.model;

import com.fesa.dealhub.enums.StatusPedido;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatusPixResponse {
    @NotNull
    private StatusPedido status;
    @NotBlank
    private String qrCode;
    private boolean expirado;
    @PositiveOrZero
    private long tempoRestanteMinutos;
}