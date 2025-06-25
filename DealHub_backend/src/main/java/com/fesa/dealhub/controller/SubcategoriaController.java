package com.fesa.dealhub.controller;

import com.fesa.dealhub.dto.SubcategoriaDTO;
import com.fesa.dealhub.service.SubcategoriaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategorias")
@Tag(name = "Subcategoria", description = "Gerencia subcategorias de produtos")
public class SubcategoriaController {

    @Autowired
    private SubcategoriaService subcategoriaService;

    @GetMapping
    public List<SubcategoriaDTO> listarTodas() {
        return subcategoriaService.listarTodas();
    }

    @PostMapping
    public SubcategoriaDTO criar(@RequestBody SubcategoriaDTO dto) {
        return subcategoriaService.salvar(dto);
    }
}
