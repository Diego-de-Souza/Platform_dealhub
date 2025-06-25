package com.fesa.dealhub.dto;

import com.fesa.dealhub.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "pedidos")
public class PedidoDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario;

    private LocalDateTime dataPedido;
    private String status;
    private Double total;
    private String metodoPagamento;
}
