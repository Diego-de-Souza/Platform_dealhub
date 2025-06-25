package com.fesa.dealhub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"produtos", "subcategorias"})
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome da categoria é obrigatório")
    @Size(max = 100, message = "Nome da categoria deve ter no máximo 100 caracteres")
    @Column(nullable = false, unique = true, length = 100)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Builder.Default
    private boolean ativa = true;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Produto> produtos = new ArrayList<>();

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Subcategoria> subcategorias = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime dataCadastro;

    @Column(nullable = false)
    private LocalDateTime dataAtualizacao;

    // Métodos auxiliares para gerenciar a relação bidirecional
    public void adicionarProduto(Produto produto) {
        produtos.add(produto);
        produto.setCategoria(this);
    }

    public void removerProduto(Produto produto) {
        produtos.remove(produto);
        produto.setCategoria(null);
    }

    public void adicionarSubcategoria(Subcategoria subcategoria) {
        subcategorias.add(subcategoria);
        subcategoria.setCategoria(this);
    }

    public void removerSubcategoria(Subcategoria subcategoria) {
        subcategorias.remove(subcategoria);
        subcategoria.setCategoria(null);
    }
}