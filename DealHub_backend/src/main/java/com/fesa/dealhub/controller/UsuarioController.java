package com.fesa.dealhub.controller;

import com.fesa.dealhub.dto.UsuarioCadastroDTO;
import com.fesa.dealhub.dto.UsuarioUpdateDTO;
import com.fesa.dealhub.model.Endereco;
import com.fesa.dealhub.model.Usuario;
import com.fesa.dealhub.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.groups.Default;

import java.time.LocalDate;


@Controller
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @GetMapping("/cadastro")
    public String abrirCadastro(Model model) {
        model.addAttribute("usuario", new UsuarioCadastroDTO());
        return "register"; // Nome da view (sem ".html")
    }

    @PostMapping(value = "/cadastrar", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public String cadastrar(@ModelAttribute UsuarioCadastroDTO dto, RedirectAttributes redirectAttributes) {
        try {
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
                    .endereco(endereco)
                    .build();

            Usuario salvo = usuarioService.cadastrarUsuario(usuario);

            // Adiciona mensagem de sucesso para ser exibida no login
            redirectAttributes.addFlashAttribute("success", "Cadastro realizado com sucesso! Faça login para continuar.");

            return "redirect:/login";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao cadastrar: " + e.getMessage());
            return "redirect:/registro";
        }
    }

    @GetMapping("/perfil")
    public String mostrarPerfil(Authentication authentication, Model model) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login?redirect=/usuarios/perfil";
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Usuario usuario = usuarioService.findByEmail(userDetails.getUsername());

        UsuarioUpdateDTO usuarioDTO = UsuarioUpdateDTO.builder()
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .cpf(usuario.getCpf())
                .telefone(usuario.getTelefone())
                .build();

        model.addAttribute("usuario", usuarioDTO);
        return "perfil";
    }


    @PostMapping("/perfil/atualizar")
    public String atualizarPerfil(
            @ModelAttribute("usuario") @Validated({Default.class, UsuarioUpdateDTO.PasswordValidationGroup.class}) UsuarioUpdateDTO updateDTO,
            BindingResult result,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }

        if (result.hasErrors()) {
            return "perfil";
        }

        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            usuarioService.atualizarPerfil(userDetails.getUsername(), updateDTO);

            redirectAttributes.addFlashAttribute("success", true);
            redirectAttributes.addFlashAttribute("message", "Perfil atualizado com sucesso!");
            return "redirect:/api/usuarios/perfil";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("success", false);
            redirectAttributes.addFlashAttribute("message", "Erro ao atualizar perfil: " + e.getMessage());
            return "redirect:/api/usuarios/perfil";
        }
    }

    @PostMapping("/perfil/atualizar/interno")
    public String atualizarPerfilInterno(
            @ModelAttribute UsuarioUpdateDTO updateDTO,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }

        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            usuarioService.atualizarPerfil(userDetails.getUsername(), updateDTO);
            redirectAttributes.addFlashAttribute("success", true);
            redirectAttributes.addFlashAttribute("message", "Perfil atualizado com sucesso!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("success", false);
            redirectAttributes.addFlashAttribute("message", "Erro ao atualizar perfil: " + e.getMessage());
        }

        return "redirect:/api/usuarios/perfil";
    }
    
    @PostMapping("/perfil/excluir")
    public String excluirContaUsuario(Authentication authentication, HttpServletRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }

        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Usuario usuario = usuarioService.findByEmail(userDetails.getUsername());
            usuarioService.deleteById(usuario.getId());
            
            // Realizar logout
            SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
            logoutHandler.logout(request, null, authentication);
            
            return "redirect:/";
        } catch (Exception e) {
            return "redirect:/api/usuarios/perfil?error=" + e.getMessage();
        }
    }
}