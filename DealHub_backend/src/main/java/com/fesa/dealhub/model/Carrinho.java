package com.fesa.dealhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Entity
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "carrinhos")
public class Carrinho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "carrinho", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCarrinho> itens;

    public Double getTotal() {
        return itens != null ? itens.stream()
                .mapToDouble(item -> item.getPreco() * item.getQuantidade())
                .sum() : 0.0;
    }

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    public void adicionarItem(ItemCarrinho item) {
        Optional<ItemCarrinho> itemExistente = itens.stream()
                .filter(i -> i.getProduto().getId().equals(item.getProduto().getId()))
                .findFirst();

        if (itemExistente.isPresent()) {
            ItemCarrinho existente = itemExistente.get();
            existente.setQuantidade(existente.getQuantidade() + item.getQuantidade());
        } else {
            item.setCarrinho(this);
            itens.add(item);
        }
        this.dataAtualizacao = LocalDateTime.now();
    }
}
