package com.fesa.dealhub.service;

import com.fesa.dealhub.dto.UsuarioUpdateDTO;
import com.fesa.dealhub.enums.UserRole;
import com.fesa.dealhub.model.Endereco;
import com.fesa.dealhub.model.Usuario;
import com.fesa.dealhub.repository.EnderecoRepository;
import com.fesa.dealhub.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EnderecoRepository enderecoRepository;

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o email: " + email));
    }

    public boolean existsByEmail(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario cadastrarUsuario(Usuario usuario) {
        if (usuario.getCpf() != null) {
            String cpfLimpo = usuario.getCpf().replaceAll("[^\\d]", "");
            usuario.setCpf(cpfLimpo);
        }

        if (usuario.getTelefone() != null) {
            String telefoneLimpo = usuario.getTelefone().replaceAll("[^\\d]", "");
            usuario.setTelefone(telefoneLimpo);
        }

        // Primeiro salva o endereço
        Endereco enderecoSalvo = enderecoRepository.save(usuario.getEndereco());

        // Associa o endereço salvo ao usuário
        usuario.setEndereco(enderecoSalvo);

        // Criptografa a senha
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setRole(UserRole.CLIENTE);

        // Define a data de cadastro como a data atual
        usuario.setDataCadastro(LocalDateTime.now());
        // Depois salva o usuário
        return usuarioRepository.save(usuario);
    }

    //usado na plataforma
    public Usuario cadastrarUsuarioPlataforma(Usuario usuario) {
        if (usuario.getCpf() != null) {
            String cpfLimpo = usuario.getCpf().replaceAll("[^\\d]", "");
            usuario.setCpf(cpfLimpo);
        }

        if (usuario.getTelefone() != null) {
            String telefoneLimpo = usuario.getTelefone().replaceAll("[^\\d]", "");
            usuario.setTelefone(telefoneLimpo);
        }

        // Primeiro salva o endereço
        Endereco enderecoSalvo = enderecoRepository.save(usuario.getEndereco());

        // Associa o endereço salvo ao usuário
        usuario.setEndereco(enderecoSalvo);

        // Criptografa a senha
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setRole(UserRole.CLIENTE);

        // Define a data de cadastro como a data atual
        usuario.setDataCadastro(LocalDateTime.now());
        // Depois salva o usuário
        return usuarioRepository.save(usuario);
    }
    /*usado na plataforma*/
    public Usuario buscarUsuarioPlataformaPorId(Long id) {
        return usuarioRepository.buscarUsuarioComEndereco(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }
    /*usado na plataforma*/
    public Usuario atualizacaoUsuarioPlataforma(Usuario usuarioAtualizado) {
        // Busca o usuário original pelo ID
        Usuario usuarioExistente = usuarioRepository.findById(usuarioAtualizado.getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Endereco enderecoExistente = enderecoRepository.findById(usuarioExistente.getEndereco().getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        // Atualiza dados
        if (!Objects.equals(usuarioAtualizado.getCpf(), usuarioExistente.getCpf())) {
            String cpfLimpo = usuarioAtualizado.getCpf().replaceAll("[^\\d]", "");
            usuarioExistente.setCpf(cpfLimpo);
        }

        if (!Objects.equals(usuarioAtualizado.getTelefone(), usuarioExistente.getTelefone())) {
            String telefoneLimpo = usuarioAtualizado.getTelefone().replaceAll("[^\\d]", "");
            usuarioExistente.setTelefone(telefoneLimpo);
        }

        if (!Objects.equals(usuarioAtualizado.getNome(), usuarioExistente.getNome())) {
            usuarioExistente.setNome(usuarioAtualizado.getNome());
        }

        if(!Objects.equals(usuarioAtualizado.getApelido(), usuarioExistente.getApelido())){
            usuarioExistente.setApelido(usuarioAtualizado.getApelido());
        }

        if (!Objects.equals(usuarioAtualizado.getEmail(), usuarioExistente.getEmail())) {
            usuarioExistente.setEmail(usuarioAtualizado.getEmail());
        }

        // Atualiza a senha apenas se for fornecida
        if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isBlank()) {
            usuarioExistente.setSenha(passwordEncoder.encode(usuarioAtualizado.getSenha()));
        }

        // Atualiza endereço
        if (usuarioAtualizado.getEndereco() != null) {
            enderecoExistente.setCep(usuarioAtualizado.getEndereco().getCep());
            enderecoExistente.setCidade(usuarioAtualizado.getEndereco().getCidade());
            enderecoExistente.setEstado(usuarioAtualizado.getEndereco().getEstado());
            enderecoExistente.setLogradouro(usuarioAtualizado.getEndereco().getLogradouro());
            enderecoExistente.setNumero(usuarioAtualizado.getEndereco().getNumero());
            enderecoExistente.setBairro(usuarioAtualizado.getEndereco().getBairro());
            enderecoExistente.setComplemento(usuarioAtualizado.getEndereco().getComplemento());
            Endereco enderecoSalvo = enderecoRepository.save(enderecoExistente);
        }

        // Atualiza o role se necessário
        if (usuarioAtualizado.getRole() != null) {
            usuarioExistente.setRole(usuarioAtualizado.getRole());
        }

        // Não altera data de cadastro
        // usuarioExistente.setDataCadastro(usuarioExistente.getDataCadastro());

        return usuarioRepository.save(usuarioExistente);
    }

    //usado plataforma
    public void deletarUsuarioPlataforma(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID: " + id));
    }

    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Page<Usuario> listarPaginado(Pageable pageable) {
        return usuarioRepository.findAll(pageable);
    }


    public void atualizarPerfil(String email, UsuarioUpdateDTO updateDTO) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(updateDTO.getNome());
        usuario.setCpf(updateDTO.getCpf());
        usuario.setTelefone(updateDTO.getTelefone());

        if (updateDTO.getSenha() != null && !updateDTO.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(updateDTO.getSenha()));
        }

        usuarioRepository.save(usuario);
    }

    public void atualizarSenha(String email, String novaSenha) {
        Usuario usuario = findByEmail(email);
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }
}