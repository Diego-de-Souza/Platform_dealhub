package com.fesa.dealhub.service;

import com.fesa.dealhub.dto.CategoriaDTO;
import com.fesa.dealhub.dto.CategoriaResumoDTO;
import com.fesa.dealhub.enums.UserRole;
import com.fesa.dealhub.exception.ResourceNotFoundException;
import com.fesa.dealhub.model.*;
import com.fesa.dealhub.repository.CategoriaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public List<Categoria> listarTodos() {
        return categoriaRepository.findAll();
    }

    //usado na lista de categorias na plataforma
    public Page<CategoriaResumoDTO> listarCategoriasComContagens(Pageable pageable) {
        return categoriaRepository.findCategoriasWithCounts(pageable)
                .map(CategoriaResumoDTO::new); // Usando o construtor simplificado
    }

    private CategoriaResumoDTO toResumoDTO(Object[] result) {
        Categoria categoria = (Categoria) result[0];
        Long quantidadeProdutos = (Long) result[1];
        Long quantidadeSubcategorias = (Long) result[2];

        return new CategoriaResumoDTO(
                categoria.getId(),
                categoria.getNome(),
                categoria.getDescricao(),
                categoria.isAtiva(),
                quantidadeProdutos,
                quantidadeSubcategorias
        );
    }

    //usado
    public Categoria cadastrarCategoriaPlataforma(Categoria categoria) {

        LocalDateTime now = LocalDateTime.now();
        categoria.setDataCadastro(now);
        categoria.setDataAtualizacao(now);
        categoria.setAtiva(Boolean.TRUE);

        // Depois salva o usuário
        return categoriaRepository.save(categoria);
    }

    //usado plataforma
    public Categoria buscarCategoriaPlataformaPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    //usado plataforma
    public Categoria atualizacaoCategoriaPlataforma(Categoria categoriaAtualizado) {
        // Busca a categoria original pelo ID
        Categoria categoriaExistente = categoriaRepository.findById(categoriaAtualizado.getId())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrado"));

        // Atualiza dados
        if (!Objects.equals(categoriaAtualizado.getNome(), categoriaExistente.getNome())) {
            String nome = categoriaAtualizado.getNome();
            categoriaExistente.setNome(nome);
        }

        if (!Objects.equals(categoriaAtualizado.getDescricao(), categoriaExistente.getDescricao())) {
            String descricao = categoriaAtualizado.getDescricao();
            categoriaExistente.setDescricao(descricao);
        }

        if (categoriaAtualizado.isAtiva() != categoriaExistente.isAtiva()) {
            categoriaExistente.setAtiva(categoriaAtualizado.isAtiva());
        }
        return categoriaRepository.save(categoriaExistente);
    }
    //usado na plataforma
    public void deletarCategoriaPlataforma(Long id) {
        categoriaRepository.deleteById(id);
    }
}