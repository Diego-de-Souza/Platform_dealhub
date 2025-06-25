package com.fesa.dealhub.controller;

import com.fesa.dealhub.dto.CarrinhoDTO;
import com.fesa.dealhub.dto.ItemCarrinhoDTO;
import com.fesa.dealhub.model.Usuario;
import com.fesa.dealhub.model.UsuarioDetails;
import com.fesa.dealhub.service.CarrinhoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrinho")
@RequiredArgsConstructor
public class CarrinhoController {
    private final CarrinhoService carrinhoService;

    @GetMapping("/obter")  // Alterado de "/" para "/obter"
    public ResponseEntity<CarrinhoDTO> obterCarrinho(@AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        Usuario usuario = usuarioDetails.getUsuario();
        System.out.println("Usuário logado: " + usuario.getEmail());
        System.out.println("ID do usuário: " + usuario.getId());
        CarrinhoDTO carrinho = carrinhoService.obterCarrinhoPorUsuario(usuario.getId());
        return ResponseEntity.ok(carrinho);
    }

    @PostMapping("/itens")
    public ResponseEntity<CarrinhoDTO> adicionarItem(
            @RequestBody ItemCarrinhoDTO itemDTO,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        Usuario usuario = usuarioDetails.getUsuario();
        CarrinhoDTO carrinho = carrinhoService.adicionarItem(usuario.getId(), itemDTO);
        return ResponseEntity.ok(carrinho);
    }
    
    @PutMapping("/atualizar")
    public ResponseEntity<CarrinhoDTO> atualizarItem(
            @RequestBody ItemCarrinhoDTO itemDTO,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        Usuario usuario = usuarioDetails.getUsuario();
        CarrinhoDTO carrinho = carrinhoService.atualizarQuantidadeItem(
                usuario.getId(), itemDTO.getId(), itemDTO.getQuantidade());
        return ResponseEntity.ok(carrinho);
    }
    
    @DeleteMapping("/remover/{itemId}")
    public ResponseEntity<CarrinhoDTO> removerItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        Usuario usuario = usuarioDetails.getUsuario();
        CarrinhoDTO carrinho = carrinhoService.removerItem(usuario.getId(), itemId);
        return ResponseEntity.ok(carrinho);
    }
}