package com.fesa.dealhub.controller;

import com.fesa.dealhub.dto.ProdutoDTO;
import com.fesa.dealhub.model.Produto;
import com.fesa.dealhub.model.ProdutoImagem;
import com.fesa.dealhub.repository.ProdutoImagemRepository;
import com.fesa.dealhub.service.ProdutoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
@Tag(name = "Produtos")
@RequiredArgsConstructor
public class ProdutoController {
    @Autowired
    private ProdutoService produtoService;
    
    @Autowired
    private ProdutoImagemRepository produtoImagemRepository;

    @GetMapping("/destaque")
    public ResponseEntity<List<Produto>> listarProdutosDestaque() {
        List<Produto> produtosDestaque = produtoService.buscarProdutosDestaque();
        return ResponseEntity.ok(produtosDestaque);
    }

    @GetMapping("/visiveis")
    public ResponseEntity<List<Produto>> listarProdutosVisiveis() {
        List<Produto> produtosVisiveis = produtoService.buscarProdutosVisiveis();
        return ResponseEntity.ok(produtosVisiveis);
    }
    
    @GetMapping("/imagens/{id}")
    public ResponseEntity<byte[]> obterImagem(@PathVariable Long id) {
        try {
            Optional<ProdutoImagem> imagemOptional = produtoImagemRepository.findById(id);
            
            if (imagemOptional.isPresent()) {
                ProdutoImagem imagem = imagemOptional.get();
                HttpHeaders headers = new HttpHeaders();
                
                if (imagem.getTipo() != null && !imagem.getTipo().isEmpty()) {
                    headers.setContentType(MediaType.parseMediaType(imagem.getTipo()));
                } else {
                    headers.setContentType(MediaType.IMAGE_JPEG);
                }
                
                return new ResponseEntity<>(imagem.getDados(), headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}