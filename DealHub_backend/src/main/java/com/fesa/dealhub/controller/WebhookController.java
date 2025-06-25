package com.fesa.dealhub.controller;

import com.fesa.dealhub.model.Pedido;
import com.fesa.dealhub.security.utils.SecurityUtils;
import com.fesa.dealhub.service.NotificacaoService;
import com.fesa.dealhub.service.PedidoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    @Autowired
    private PedidoService pedidoService;

    private SecurityUtils securityUtils;

    private NotificacaoService notificacaoService;

    private Pedido pedido;

    @PostMapping("/pix")
    public ResponseEntity<String> webhookPix(
            @RequestBody WebhookPixDTO dto,
            @RequestHeader("X-Signature") String signature,
            HttpServletRequest request) {

        // 1. Validar IP de origem (simulando lista de IPs confiáveis)
        if (!isIpConfiavel(request.getRemoteAddr())) {
            throw new SecurityException("IP não autorizado");
        }

        // 2. Validar assinatura HMAC-SHA256
        if (!validarAssinatura(dto.toString(), signature, "SEGREDO_PIX")) {
            throw new SecurityException("Assinatura inválida");
        }

        pedidoService.confirmarPagamentoPix(dto.codigoTransacao());

        notificacaoService.notificarConfirmacaoPagamento(
                pedido.getId(),
                pedido.getStatus()
        );

        return ResponseEntity.ok("OK");
    }

    private boolean isIpConfiavel(String ip) {
        return List.of("192.168.0.1", "127.0.0.1").contains(ip); // IPs fictícios
    }

    private boolean validarAssinatura(String payload, String signature, String secret) {
        String computed = SecurityUtils.hmacSha256(secret, payload);
        return computed.equals(signature);
    }

    public record WebhookPixDTO(String codigoTransacao) {}
}
