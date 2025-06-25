package com.fesa.dealhub.service;

import com.fesa.dealhub.enums.StatusProduto;
import com.fesa.dealhub.model.Produto;
import com.fesa.dealhub.model.ProdutoImagem;
import com.fesa.dealhub.repository.ProdutoImagemRepository;
import com.fesa.dealhub.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.io.IOException;
import java.util.stream.Collectors;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StreamUtils;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ProdutoImagemRepository produtoImagemRepository;

    public Produto salvar(Produto produto) {
        // Validação adicional se necessário
        if (produto.getImagens().size() > 6) {
            throw new IllegalArgumentException("Número máximo de imagens excedido");
        }

        return produtoRepository.save(produto);
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    //usado na lista de produtos na plataforma
    public Page<Produto> listarPaginado(Pageable pageable) {
        return produtoRepository.findAll(pageable);
    }

    //usado plataforma
    public Produto buscarProdutoPlataformaPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    @Transactional
    public void removerImagens(Produto produto, List<Long> idsImagens) {
        if (idsImagens == null || idsImagens.isEmpty()) {
            return;
        }

        // Cria uma cópia da lista para evitar ConcurrentModificationException
        List<ProdutoImagem> imagensParaRemover = new ArrayList<>();
        for (ProdutoImagem imagem : produto.getImagens()) {
            if (idsImagens.contains(imagem.getId())) {
                imagensParaRemover.add(imagem);
            }
        }

        // Remove as imagens da lista do produto
        produto.getImagens().removeAll(imagensParaRemover);

        // Remove as imagens do banco de dados
        produtoImagemRepository.deleteAll(imagensParaRemover);
    }

    @Transactional
    public void deletarProdutoPlataforma(Long id) {
        // Verifica se o produto existe
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com id: " + id));

        // Aqui você pode adicionar validações adicionais se necessário
        // Por exemplo, verificar se o produto pode ser deletado

        produtoRepository.delete(produto);
    }

    public List<Produto> buscarProdutosDestaque() {
        return produtoRepository.findByDestaqueIsTrueAndVisivelIsTrueAndStatusNot(
                StatusProduto.INATIVO, PageRequest.of(0, 8));
    }

    public List<Produto> buscarProdutosVisiveis() {
        return produtoRepository.findByVisivelIsTrueAndStatusNot(
                StatusProduto.INATIVO, PageRequest.of(0, 12));
    }
    
    // Outros métodos...
    
    /**
     * Adiciona uma imagem padrão para produtos sem imagens
     */
    @Transactional
    public void adicionarImagensPadrao() {
        List<Produto> produtosSemImagens = produtoRepository.findAll().stream()
                .filter(p -> p.getImagens() == null || p.getImagens().isEmpty())
                .collect(Collectors.toList());
        
        if (!produtosSemImagens.isEmpty()) {
            try {
                // Carrega a imagem padrão de recursos (você deve criar este arquivo)
                Resource resource = new ClassPathResource("static/images/no-image.png");
                byte[] imagemBytes = StreamUtils.copyToByteArray(resource.getInputStream());
                
                for (Produto produto : produtosSemImagens) {
                    ProdutoImagem imagem = new ProdutoImagem();
                    imagem.setNome("imagem-padrao.png");
                    imagem.setTipo("image/png");
                    imagem.setDados(imagemBytes);
                    produto.adicionarImagem(imagem);
                    produtoRepository.save(produto);
                }
                
            } catch (IOException e) {
                // Log do erro
                e.printStackTrace();
            }
        }
    }
}