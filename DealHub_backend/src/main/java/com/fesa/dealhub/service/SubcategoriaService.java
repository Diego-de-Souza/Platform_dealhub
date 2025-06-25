package com.fesa.dealhub.service;

import com.fesa.dealhub.dto.CategoriaResumoDTO;
import com.fesa.dealhub.dto.SubcategoriaDTO;
import com.fesa.dealhub.dto.SubcategoriaResumoDTO;
import com.fesa.dealhub.model.Categoria;
import com.fesa.dealhub.model.Subcategoria;
import com.fesa.dealhub.repository.CategoriaRepository;
import com.fesa.dealhub.repository.SubcategoriaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class SubcategoriaService {

    @Autowired
    private SubcategoriaRepository subcategoriaRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<SubcategoriaDTO> listarTodas() {
        return subcategoriaRepository.findAll()
                .stream()
                .map(sub -> {
                    SubcategoriaDTO dto = new SubcategoriaDTO();
                    dto.setId(sub.getId());
                    dto.setNome(sub.getNome());
                    dto.setCategoriaId(sub.getCategoria().getId());
                    return dto;
                }).collect(Collectors.toList());
    }

    public SubcategoriaDTO salvar(SubcategoriaDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Subcategoria sub = new Subcategoria();
        sub.setNome(dto.getNome());
        sub.setCategoria(categoria);

        Subcategoria salva = subcategoriaRepository.save(sub);

        SubcategoriaDTO response = new SubcategoriaDTO();
        response.setId(salva.getId());
        response.setNome(salva.getNome());
        response.setCategoriaId(salva.getCategoria().getId());

        return response;
    }

    //usado na lista de subcategorias na plataforma
    public Page<SubcategoriaResumoDTO> listarSubcategoriasComContagens(Pageable pageable) {
        return subcategoriaRepository.findSubcategoriasWithCounts(pageable)
                .map(SubcategoriaResumoDTO::new); // Usando o construtor simplificado
    }

    //usado
    public Subcategoria cadastrarSubcategoriaPlataforma(Subcategoria subcategoria) {

        return subcategoriaRepository.save(subcategoria);
    }

    //usado plataforma
    public List<Categoria> getCategorias(){
        return categoriaRepository.findAll();
    }

    //usado plataforma
    public Subcategoria buscarSubcategoriaPlataformaPorId(Long id) {
        return subcategoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    //usado plataforma
    public Subcategoria atualizacaoSubcategoriaPlataforma(Subcategoria subcategoriaAtualizado) {
        // Busca a subcategoria original pelo ID
        Subcategoria subcategoriaExistente = subcategoriaRepository.findById(subcategoriaAtualizado.getId())
                .orElseThrow(() -> new EntityNotFoundException("Subcategoria não encontrado"));

        // Atualiza dados
        if (!Objects.equals(subcategoriaAtualizado.getNome(), subcategoriaExistente.getNome())) {
            String nome = subcategoriaAtualizado.getNome();
            subcategoriaExistente.setNome(nome);
        }

        return subcategoriaRepository.save(subcategoriaExistente);
    }
    //usado na plataforma
    public void deletarSubcategoriaPlataforma(Long id) {
        subcategoriaRepository.deleteById(id);
    }

    public List<Subcategoria> buscarPorCategoria(Long categoriaId) {
        return subcategoriaRepository.findAllByCategoriaId(categoriaId);
    }
}
