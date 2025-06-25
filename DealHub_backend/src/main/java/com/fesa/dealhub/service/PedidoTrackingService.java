package com.fesa.dealhub.service;

import com.fesa.dealhub.dto.PedidoTrackingDTO;
import com.fesa.dealhub.enums.StatusPedido;
import com.fesa.dealhub.model.Pedido;
import com.fesa.dealhub.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;  // Adicione este import
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoTrackingService {
    private final SimpMessagingTemplate messagingTemplate;

    private final PedidoRepository pedidoRepository;

    public void broadcastPedidosAtivos() {
        List<Pedido> pedidosAtivos = pedidoRepository.findByStatusIn(
                List.of(StatusPedido.AGUARDANDO_PAGAMENTO, StatusPedido.EM_PREPARACAO, StatusPedido.ENVIADO)
        );

        messagingTemplate.convertAndSend("/topic/admin/pedidos",
                pedidosAtivos.stream()
                        .map(this::convertToTrackingDTO)
                        .toList()
        );
    }

    private PedidoTrackingDTO convertToTrackingDTO(Pedido pedido) {
        return PedidoTrackingDTO.builder()
                .id(pedido.getId())
                .status(pedido.getStatus().toString())
                .dataPedido(pedido.getDataPedido())
                .total(BigDecimal.valueOf(pedido.getTotal())) // Convertendo Double para BigDecimal
                .nomeUsuario(pedido.getUsuario().getNome())
                .dataUltimaAtualizacao(pedido.getDataAtualizacao())
                .build();
    }
}