package com.fesa.dealhub.controller.platform;

import com.fesa.dealhub.dto.SubcategoriaDTO;
import com.fesa.dealhub.enums.StatusProduto;
import com.fesa.dealhub.exception.ResourceNotFoundException;
import com.fesa.dealhub.model.Categoria;
import com.fesa.dealhub.model.Produto;
import com.fesa.dealhub.model.ProdutoImagem;
import com.fesa.dealhub.model.Subcategoria;
import com.fesa.dealhub.service.CategoriaService;
import com.fesa.dealhub.service.ProdutoService;
import com.fesa.dealhub.service.SubcategoriaService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@AllArgsConstructor
@RequestMapping("/plataforma/admin-product")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminProductController {

    @Autowired
    private final ProdutoService produtoService;
    @Autowired
    private final SubcategoriaService subcategoriaService;
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/produtos/listar")
    public String listarProdutos(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size,
                                 Model model) {

        Page<Produto> paginaProduto = produtoService.listarPaginado(PageRequest.of(page, size));

        model.addAttribute("title", "Gerenciar Produtos");
        model.addAttribute("produtos", paginaProduto.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", paginaProduto.getTotalPages());
        model.addAttribute("totalElements", paginaProduto.getTotalElements());

        return "platform/admin/products/list-product";
    }

    @GetMapping("/produtos/cadastro")
    public String cadastrarProdutos(Model model) {
        List<Categoria> categorias = categoriaService.listarTodos();

        model.addAttribute("title", "Gerenciar Produtos");
        model.addAttribute("categorias", categorias);
        model.addAttribute("status", StatusProduto.values());
        return "platform/admin/products/cadastro-product";
    }

    @GetMapping("/subcategorias")
    @ResponseBody
    public ResponseEntity<List<SubcategoriaDTO>> getSubcategorias(@RequestParam Long categoriaId) {
        List<Subcategoria> subcategorias = subcategoriaService.buscarPorCategoria(categoriaId);

        // Converte para DTO
        List<SubcategoriaDTO> dtos = subcategorias.stream()
                .map(sub -> new SubcategoriaDTO(sub.getId(), sub.getNome()))
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/cadastrar/plataforma")
    public String salvarProduto(
            @RequestParam String nome,
            @RequestParam String descricao,
            @RequestParam BigDecimal preco,
            @RequestParam Integer estoque,
            @RequestParam(required = false) Integer porcentagemDesconto,
            @RequestParam String marca,
            @RequestParam String modelo,
            @RequestParam StatusProduto status,
            @RequestParam BigDecimal peso,
            @RequestParam BigDecimal altura,
            @RequestParam BigDecimal largura,
            @RequestParam BigDecimal profundidade,
            @RequestParam(required = false, defaultValue = "false") boolean destaque,
            @RequestParam(required = false, defaultValue = "true") boolean visivel,
            @RequestParam(required = false) Integer mesesGarantia,
            @RequestParam Long categoriaId,
            @RequestParam(required = false) Long subcategoriaId,
            @RequestParam("imagens") MultipartFile[] imagens,
            RedirectAttributes redirectAttributes) {

        // Validação básica
        if (imagens.length > 6) {
            redirectAttributes.addFlashAttribute("erro", "Máximo de 6 imagens permitido");
            return "redirect:/plataforma/admin-product/produtos/cadastro";
        }

        // Cria o produto
        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setDescricao(descricao);
        produto.setPreco(preco);
        produto.setEstoque(estoque);
        produto.setPorcentagemDesconto(porcentagemDesconto);
        produto.setMarca(marca);
        produto.setModelo(modelo);
        produto.setStatus(status);
        produto.setPeso(peso);
        produto.setAltura(altura);
        produto.setLargura(largura);
        produto.setProfundidade(profundidade);
        produto.setDestaque(destaque);
        produto.setVisivel(visivel);
        produto.setMesesGarantia(mesesGarantia);
        produto.setDataCadastro(LocalDateTime.now());
        produto.setDataAtualizacao(LocalDateTime.now());

        // Configura categorias
        Categoria categoria = categoriaService.buscarCategoriaPlataformaPorId(categoriaId);
        produto.setCategoria(categoria);

        if (subcategoriaId != null) {
            Subcategoria subcategoria = subcategoriaService.buscarSubcategoriaPlataformaPorId(subcategoriaId);
            produto.setSubcategoria(subcategoria);
        }

        // Processa imagens
        List<ProdutoImagem> imagensSalvas = new ArrayList<>();
        for (MultipartFile imagem : imagens) {
            if (!imagem.isEmpty()) {
                try {
                    ProdutoImagem pi = new ProdutoImagem();
                    pi.setNome(imagem.getOriginalFilename());
                    pi.setTipo(imagem.getContentType());
                    pi.setDados(imagem.getBytes());
                    pi.setProduto(produto);
                    imagensSalvas.add(pi);
                } catch (IOException e) {
                    redirectAttributes.addFlashAttribute("erro", "Erro ao processar imagem: " + e.getMessage());
                    return "redirect:/plataforma/admin-product/produtos/cadastro";
                }
            }
        }

        produto.setImagens(imagensSalvas);
        produtoService.salvar(produto);
        redirectAttributes.addFlashAttribute("sucesso", "Produto cadastrado com sucesso!");

        return "redirect:/plataforma/admin-product/produtos/listar";
    }

    @GetMapping("/produto/editar/{id}")
    public String editarProdutoForm(@PathVariable Long id, Model model) {
        Produto produto = produtoService.buscarProdutoPlataformaPorId(id);

        List<String> imagensBase64 = produto.getImagens().stream()
                .map(imagem -> Base64.getEncoder().encodeToString(imagem.getDados()))
                .collect(Collectors.toList());
        model.addAttribute("imagensBase64", imagensBase64);

        List<Categoria> categorias = categoriaService.listarTodos();
        List<StatusProduto> status = Arrays.asList(StatusProduto.values());

        model.addAttribute("produto", produto);
        model.addAttribute("categorias", categorias);
        model.addAttribute("status", status);

        return "platform/admin/products/update-product";
    }

    @PostMapping("/atualizar/{id}")
    public String atualizarProduto(
            @PathVariable Long id,
            @RequestParam String nome,
            @RequestParam String descricao,
            @RequestParam BigDecimal preco,
            @RequestParam Integer estoque,
            @RequestParam(required = false) Integer porcentagemDesconto,
            @RequestParam String marca,
            @RequestParam String modelo,
            @RequestParam StatusProduto status,
            @RequestParam BigDecimal peso,
            @RequestParam BigDecimal altura,
            @RequestParam BigDecimal largura,
            @RequestParam BigDecimal profundidade,
            @RequestParam(required = false, defaultValue = "false") boolean destaque,
            @RequestParam(required = false, defaultValue = "true") boolean visivel,
            @RequestParam(required = false) Integer mesesGarantia,
            @RequestParam Long categoriaId,
            @RequestParam(required = false) Long subcategoriaId,
            @RequestParam(value = "imagens", required = false) MultipartFile[] novasImagens,
            @RequestParam(value = "imagensRemovidas", required = false) List<Long> imagensRemovidas,
            RedirectAttributes redirectAttributes) {

        try {
            Produto produtoExistente = produtoService.buscarProdutoPlataformaPorId(id);

            // Atualiza os dados básicos
            produtoExistente.setNome(nome);
            produtoExistente.setDescricao(descricao);
            produtoExistente.setPreco(preco);
            produtoExistente.setEstoque(estoque);
            produtoExistente.setPorcentagemDesconto(porcentagemDesconto);
            produtoExistente.setMarca(marca);
            produtoExistente.setModelo(modelo);
            produtoExistente.setStatus(status);
            produtoExistente.setPeso(peso);
            produtoExistente.setAltura(altura);
            produtoExistente.setLargura(largura);
            produtoExistente.setProfundidade(profundidade);
            produtoExistente.setDestaque(destaque);
            produtoExistente.setVisivel(visivel);
            produtoExistente.setMesesGarantia(mesesGarantia);
            produtoExistente.setDataAtualizacao(LocalDateTime.now());

            // Atualiza categorias
            Categoria categoria = categoriaService.buscarCategoriaPlataformaPorId(categoriaId);
            produtoExistente.setCategoria(categoria);

            if (subcategoriaId != null) {
                Subcategoria subcategoria = subcategoriaService.buscarSubcategoriaPlataformaPorId(subcategoriaId);
                produtoExistente.setSubcategoria(subcategoria);
            } else {
                produtoExistente.setSubcategoria(null);
            }

            // Remove imagens selecionadas
            if (imagensRemovidas != null && !imagensRemovidas.isEmpty()) {
                produtoService.removerImagens(produtoExistente, imagensRemovidas);
            }

            // Adiciona novas imagens
            if (novasImagens != null && novasImagens.length > 0) {
                List<ProdutoImagem> novasImagensSalvas = new ArrayList<>();
                for (MultipartFile imagem : novasImagens) {
                    if (!imagem.isEmpty()) {
                        ProdutoImagem pi = new ProdutoImagem();
                        pi.setNome(imagem.getOriginalFilename());
                        pi.setTipo(imagem.getContentType());
                        pi.setDados(imagem.getBytes());
                        pi.setProduto(produtoExistente);
                        novasImagensSalvas.add(pi);
                    }
                }
                produtoExistente.getImagens().addAll(novasImagensSalvas);
            }

            produtoService.salvar(produtoExistente);
            redirectAttributes.addFlashAttribute("sucesso", "Produto atualizado com sucesso!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("erro", "Erro ao atualizar produto: " + e.getMessage());
        }

        return "redirect:/plataforma/admin-product/produtos/listar";
    }

    @PostMapping("/produto/deletar/{id}")
    public RedirectView deletarProduto(@PathVariable Long id) {
        produtoService.deletarProdutoPlataforma(id);
        return new RedirectView("/plataforma/admin-product/produtos/listar");
    }
}
