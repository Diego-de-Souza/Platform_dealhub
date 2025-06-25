package com.fesa.dealhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemCarrinho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "carrinho_id")
    private Carrinho carrinho;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    private int quantidade;

    private double preco; // Captura o preço na hora do item ser adicionado

    @Column(name = "data_adicao")
    private LocalDateTime dataAdicao;

    @PrePersist
    public void prePersist() {
        this.dataAdicao = LocalDateTime.now();
    }

    public double getSubtotal() {
        return preco * quantidade;
    }
}
