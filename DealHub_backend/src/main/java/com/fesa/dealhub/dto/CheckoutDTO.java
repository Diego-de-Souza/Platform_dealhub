package com.fesa.dealhub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CheckoutDTO {
    @NotBlank(message = "Método de pagamento é obrigatório")
    private String metodoPagamento;
    private String enderecoEntrega;
    @Pattern(regexp = "^(\\d{16})?$", message = "Número do cartão deve ter 16 dígitos")
    private String numeroCartao;
    private String codigoSeguranca;

    @Pattern(regexp = "^(0[1-9]|1[0-2])/[0-9]{2}$", message = "Validade deve estar no formato MM/AA")
    private String validadeCartao;

    @Pattern(regexp = "^\\d{3,4}$", message = "CVV deve ter 3 ou 4 dígitos")
    private String cvv;
}
