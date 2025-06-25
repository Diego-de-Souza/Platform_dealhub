package com.fesa.dealhub.controller.platform;

import com.fesa.dealhub.dto.UsuarioCadastroDTO;
import com.fesa.dealhub.dto.UsuarioUpdateDTO;
import com.fesa.dealhub.enums.UserRole;
import com.fesa.dealhub.model.Endereco;
import com.fesa.dealhub.model.Usuario;
import com.fesa.dealhub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDate;

@Controller
@AllArgsConstructor
@RequestMapping("/plataforma/admin-user")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class adminUserController {

    private final UsuarioService usuarioService;

    @GetMapping("/usuarios/listar")
    public String listarUsuarios(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size,
                                 Model model) {

        Page<Usuario> paginaUsuarios = usuarioService.listarPaginado(PageRequest.of(page, size));

        model.addAttribute("title", "Gerenciar Usuários");
        model.addAttribute("usuarios", paginaUsuarios.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", paginaUsuarios.getTotalPages());
        model.addAttribute("totalElements", paginaUsuarios.getTotalElements());

        return "platform/admin/users/list";
    }

    @GetMapping("/usuarios/cadastro")
    public String cadastroUsuario(Model model) {
        return "platform/admin/users/cadastro";
    }

    @PostMapping("/cadastrar/plataforma")
    public RedirectView cadastrarUsuarioPlataforma(UsuarioCadastroDTO dto) {
        // Criar o endereço primeiro
        Endereco endereco = Endereco.builder()
                .cep(dto.getCep())
                .logradouro(dto.getLogradouro())
                .numero(dto.getNumero())
                .complemento(dto.getComplemento())
                .bairro(dto.getBairro())
                .cidade(dto.getCidade())
                .estado(dto.getEstado())
                .principal(dto.isPrincipal())
                .build();

        // Criar o usuário com o endereço
        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .apelido(dto.getApelido())
                .email(dto.getEmail())
                .senha(dto.getSenha())
                .cpf(dto.getCpf())
                .telefone(dto.getTelefone())
                .dataNascimento(LocalDate.parse(dto.getDataNascimento()))
                .role(dto.getRole())
                .endereco(endereco) // Associa o endereço ao usuário
                .build();

        Usuario salvo = usuarioService.cadastrarUsuarioPlataforma(usuario);
        return new RedirectView("/plataforma/admin-user/usuarios/cadastro");
    }

    @PostMapping("/atualizar/{id}")
    public RedirectView atualizarUsuarioPlataforma(UsuarioUpdateDTO dto, HttpSession session) {
        Usuario usuarioAntigo = usuarioService.buscarUsuarioPlataformaPorId((long) dto.getId());
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuario");

        UserRole roleUsuario= usuarioLogado.getId() == usuarioAntigo.getId() ? usuarioAntigo.getRole() : dto.getRole();

        // Criar o endereço primeiro
        Endereco endereco = Endereco.builder()
                .cep(dto.getCep())
                .logradouro(dto.getLogradouro())
                .numero(dto.getNumero())
                .complemento(dto.getComplemento())
                .bairro(dto.getBairro())
                .cidade(dto.getCidade())
                .estado(dto.getEstado())
                .principal(dto.isPrincipal())
                .build();

        // Criar o usuário com o endereço
        Usuario usuario = Usuario.builder()
                .id((long) dto.getId())
                .nome(dto.getNome())
                .apelido(dto.getApelido())
                .email(dto.getEmail())
                .senha(dto.getSenha())
                .cpf(dto.getCpf())
                .telefone(dto.getTelefone())
                .dataNascimento(LocalDate.parse(dto.getDataNascimento()))
                .role(roleUsuario)
                .endereco(endereco) // Associa o endereço ao usuário
                .build();

        Usuario salvo = usuarioService.atualizacaoUsuarioPlataforma(usuario);
        return new RedirectView("/plataforma/admin-user/usuarios/listar");
    }

    @GetMapping("/usuarios/editar/{id}")
    public String editarUsuario(@PathVariable Long id, Model model, HttpSession session) {
        Usuario usuario = usuarioService.buscarUsuarioPlataformaPorId(id);
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuario");
        model.addAttribute("isSelfEdit", usuarioLogado != null && usuarioLogado.getId().equals(id));

        model.addAttribute("usuario", usuario);
        model.addAttribute("roles", UserRole.values());
        return "platform/admin/users/update";
    }

    @PostMapping("/usuarios/deletar/{id}")
    public RedirectView deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuarioPlataforma(id);
        return new RedirectView("/plataforma/admin-user/usuarios/listar");
    }
}
