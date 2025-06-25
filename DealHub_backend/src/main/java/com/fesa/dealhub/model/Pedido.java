package com.fesa.dealhub.model;

import com.fesa.dealhub.enums.StatusPedido;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario;

    private LocalDateTime dataPedido;
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    @Column(nullable = false)
    private Double total;

    private String metodoPagamento;

    private String codigoRastreio;
    @Column(unique = true)
    private String codigoTransacao;

    private String qrCodePix;
    private LocalDateTime dataPagamento;

    private LocalDateTime pixExpiracao;
    @Transient
    public boolean isPixExpirado() {
        return LocalDateTime.now().isAfter(pixExpiracao);
    }
}