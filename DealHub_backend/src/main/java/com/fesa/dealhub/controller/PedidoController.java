package com.fesa.dealhub.controller;

import com.fesa.dealhub.dto.CheckoutDTO;
import com.fesa.dealhub.dto.PedidoDTO;
import com.fesa.dealhub.model.StatusPixResponse;
import com.fesa.dealhub.model.Usuario;
import com.fesa.dealhub.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> listarPedidosUsuario(
            @AuthenticationPrincipal Usuario usuario) {
        List<PedidoDTO> pedidos = pedidoService.listarPedidosPorUsuario(usuario.getId());
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping("/checkout")
    public ResponseEntity<PedidoDTO> checkout(
            @RequestBody CheckoutDTO checkoutDTO,
            @AuthenticationPrincipal Usuario usuario) {

        PedidoDTO pedido = pedidoService.finalizarPedido(usuario.getId(), checkoutDTO);
        return ResponseEntity.ok(pedido);
    }

    @PatchMapping("/{pedidoId}/status")
    public ResponseEntity<PedidoDTO> atualizarStatus(
            @PathVariable Long pedidoId,
            @RequestParam String status,
            @AuthenticationPrincipal Usuario usuario) {

        return ResponseEntity.ok(
                pedidoService.atualizarStatus(pedidoId, status)
        );
    }

    @GetMapping("/{id}/status-pix")
    public ResponseEntity<StatusPixResponse> consultarStatusPix(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.consultarStatusPix(id));
    }
}
