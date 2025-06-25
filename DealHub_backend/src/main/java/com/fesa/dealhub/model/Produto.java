package com.fesa.dealhub.model;

import com.fesa.dealhub.enums.StatusProduto;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Builder
@ToString
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer estoque;

    @Column(nullable = true)
    private Integer porcentagemDesconto;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String modelo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusProduto status;

    @Column(precision = 10, scale = 3)
    private BigDecimal peso;

    @Column(precision = 10, scale = 3)
    private BigDecimal altura;

    @Column(precision = 10, scale = 3)
    private BigDecimal largura;

    @Column(precision = 10, scale = 3)
    private BigDecimal profundidade;

    private boolean destaque;
    private boolean visivel;
    private Integer mesesGarantia;


    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    @JsonManagedReference
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "subcategoria_id", nullable = true)
    @JsonManagedReference
    private Subcategoria subcategoria;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProdutoImagem> imagens = new ArrayList<>();

    @Column()
    private LocalDateTime dataCadastro;

    @Column()
    private LocalDateTime dataAtualizacao;

    public void adicionarImagem(ProdutoImagem imagem) {
        imagens.add(imagem);
        imagem.setProduto(this);
    }

    public void removerImagem(ProdutoImagem imagem) {
        imagens.remove(imagem);
        imagem.setProduto(null);
    }
}