package com.fesa.dealhub.controller.platform;

import com.fesa.dealhub.dto.CategoriaDTO;
import com.fesa.dealhub.dto.CategoriaResumoDTO;
import com.fesa.dealhub.dto.SubcategoriaDTO;
import com.fesa.dealhub.dto.SubcategoriaResumoDTO;
import com.fesa.dealhub.model.Categoria;
import com.fesa.dealhub.model.Subcategoria;
import com.fesa.dealhub.service.CategoriaService;
import com.fesa.dealhub.service.SubcategoriaService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/plataforma/admin-subcategoria")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminSubcategoriaController {

    private final SubcategoriaService subcategoriaService;
    private final CategoriaService categoriaService;

    @GetMapping("/subcategorias/listar")
    public String listarCategorias(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size,
                                   Model model) {

        Page<SubcategoriaResumoDTO> QuantidadeSubcategorias = subcategoriaService.listarSubcategoriasComContagens(PageRequest.of(page, size));

        model.addAttribute("title", "Gerenciar Subcategorias");
        model.addAttribute("subcategorias", QuantidadeSubcategorias.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", QuantidadeSubcategorias.getTotalPages());
        model.addAttribute("totalElements", QuantidadeSubcategorias.getTotalElements());

        return "platform/admin/subcategory/list-subcategoria";
    }

    @GetMapping("/subcategorias/cadastro")
    public String subcadastrarCategorias(Model model) {
        List<Categoria> categorias = subcategoriaService.getCategorias();
        model.addAttribute("title", "Gerenciar Subcategorias");
        model.addAttribute("categorias", categorias);
        return "platform/admin/subcategory/cadastro-subcategoria";
    }

    @PostMapping("/cadastrar/plataforma")
    public RedirectView subcadastrarcategoriaPlataforma(SubcategoriaDTO dto) {

        // Criar subcategoria
        Subcategoria subcategoria = Subcategoria.builder()
                .nome(dto.getNome())
                .categoria(Categoria.builder().id(dto.getCategoriaId()).build())
                .build();

        Subcategoria salvo = subcategoriaService.cadastrarSubcategoriaPlataforma(subcategoria);
        return new RedirectView("/plataforma/admin-subcategoria/subcategorias/cadastro");
    }

    @PostMapping("/atualizar/{id}")
    public RedirectView atualizarSubcategoriaPlataforma(SubcategoriaDTO dto) {

        // Criar a subcategoria
        Subcategoria subcategoria = Subcategoria.builder()
                .id((long) dto.getId())
                .nome(dto.getNome())
                .build();

        Subcategoria salvo = subcategoriaService.atualizacaoSubcategoriaPlataforma(subcategoria);
        return new RedirectView("/plataforma/admin-subcategoria/subcategorias/listar");
    }

    @GetMapping("/subcategoria/editar/{id}")
    public String editarSubcategoria(@PathVariable Long id, Model model) {
        Subcategoria subcategoria = subcategoriaService.buscarSubcategoriaPlataformaPorId(id);

        model.addAttribute("subcategoria", subcategoria);
        return "platform/admin/subcategory/update-subcategoria";
    }

    @PostMapping("/subcategoria/deletar/{id}")
    public RedirectView deletarSubcategoria(@PathVariable Long id) {
        subcategoriaService.deletarSubcategoriaPlataforma(id);
        return new RedirectView("/plataforma/admin-subcategoria/subcategorias/listar");
    }
}
