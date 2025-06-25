package com.fesa.dealhub.controller.platform;

import com.fesa.dealhub.dto.CategoriaDTO;
import com.fesa.dealhub.dto.CategoriaResumoDTO;
import com.fesa.dealhub.model.Categoria;
import com.fesa.dealhub.service.CategoriaService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@Controller
@AllArgsConstructor
@RequestMapping("/plataforma/admin-categoria")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminCategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping("/categorias/listar")
    public String listarCategorias(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size,
                                   Model model) {

        Page<CategoriaResumoDTO> QuantidadeSubcategorias = categoriaService.listarCategoriasComContagens(PageRequest.of(page, size));

        model.addAttribute("title", "Gerenciar Categorias");
        model.addAttribute("categorias", QuantidadeSubcategorias.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", QuantidadeSubcategorias.getTotalPages());
        model.addAttribute("totalElements", QuantidadeSubcategorias.getTotalElements());

        return "platform/admin/categories/list-categories";
    }

    @GetMapping("/categorias/cadastro")
    public String cadastrarCategorias(Model model) {
        model.addAttribute("title", "Gerenciar Categorias");
        return "platform/admin/categories/cadastro-categories";
    }

    @PostMapping("/cadastrar/plataforma")
    public RedirectView cadastrarcategoriaPlataforma(CategoriaDTO dto) {

        // Criar categoria
        Categoria categoria = Categoria.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .build();

        Categoria salvo = categoriaService.cadastrarCategoriaPlataforma(categoria);
        return new RedirectView("/plataforma/admin-categoria/categorias/cadastro");
    }

    @PostMapping("/atualizar/{id}")
    public RedirectView atualizarCategoriaPlataforma(CategoriaDTO dto, HttpSession session) {

        // Criar o usuário com o endereço
        Categoria categoria = Categoria.builder()
                .id((long) dto.getId())
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .ativa(dto.isAtiva())
                .build();

        Categoria salvo = categoriaService.atualizacaoCategoriaPlataforma(categoria);
        return new RedirectView("/plataforma/admin-categoria/categorias/listar");
    }

    @GetMapping("/categoria/editar/{id}")
    public String editarCategoria(@PathVariable Long id, Model model, HttpSession session) {
        Categoria categoria = categoriaService.buscarCategoriaPlataformaPorId(id);

        model.addAttribute("categoria", categoria);
        return "platform/admin/categories/update-categories";
    }

    @PostMapping("/categoria/deletar/{id}")
    public RedirectView deletarCategoria(@PathVariable Long id) {
        categoriaService.deletarCategoriaPlataforma(id);
        return new RedirectView("/plataforma/admin-categoria/categorias/listar");
    }

}
