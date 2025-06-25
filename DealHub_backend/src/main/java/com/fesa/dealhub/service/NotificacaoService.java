package com.fesa.dealhub.service;

import com.fesa.dealhub.enums.StatusPedido;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificacaoService {
    private final SimpMessagingTemplate messagingTemplate;

    public void notificarConfirmacaoPagamento(Long pedidoId, StatusPedido status) {
        String destino = "/topic/pedidos/" + pedidoId + "/status";
        messagingTemplate.convertAndSend(destino, Map.of(
                "pedidoId", pedidoId,
                "novoStatus", status,
                "dataAtualizacao", LocalDateTime.now()
        ));
    }
}
