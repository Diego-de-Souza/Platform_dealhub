package com.fesa.dealhub.service;

import com.fesa.dealhub.dto.CarrinhoDTO;
import com.fesa.dealhub.dto.CheckoutDTO;
import com.fesa.dealhub.dto.PedidoDTO;
import com.fesa.dealhub.enums.StatusPedido;
import com.fesa.dealhub.exception.BusinessException;
import com.fesa.dealhub.exception.ResourceNotFoundException;
import com.fesa.dealhub.model.Pedido;
import com.fesa.dealhub.model.StatusPixResponse;
import com.fesa.dealhub.model.Usuario;
import com.fesa.dealhub.repository.PedidoRepository;
import com.fesa.dealhub.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final CarrinhoService carrinhoService;
    private final ProdutoRepository produtoRepository;
    private final SimulacaoPagamentoService paymentService;
    private final ValidatorService validatorService;
    private final PedidoTrackingService pedidoTrackingService;

    public PedidoDTO finalizarPedido(Long usuarioId, CheckoutDTO checkoutDTO) {
        // 0. Validar carrinho não vazio primeiro
        CarrinhoDTO carrinho = carrinhoService.obterCarrinhoPorUsuario(usuarioId);
        if (carrinho.getItens().isEmpty()) {
            throw new BusinessException("Não é possível finalizar pedido com carrinho vazio");
        }

        // 1. Validar dados de pagamento (apenas se for cartão)
        if ("CARTAO".equals(checkoutDTO.getMetodoPagamento())) {
            validatorService.validarDadosCartao(checkoutDTO);
        }

        if (!List.of("CARTAO", "PIX", "BOLETO").contains(checkoutDTO.getMetodoPagamento())) {
            throw new BusinessException("Método de pagamento inválido");
        }

        // 2. Simular pagamento
        var resultado = paymentService.simularPagamento(
                checkoutDTO.getMetodoPagamento(),
                carrinho.getTotal()
        );

        // 3. Criar entidade Pedido
        Pedido pedido = Pedido.builder()
                .usuario(Usuario.builder().id(usuarioId).build())
                .dataPedido(LocalDateTime.now())
                .total(carrinho.getTotal())
                .metodoPagamento(checkoutDTO.getMetodoPagamento())
                .status(resultado.sucesso() ?
                        StatusPedido.PAGAMENTO_APROVADO :
                        StatusPedido.PAGAMENTO_RECUSADO)
                .codigoTransacao(resultado.sucesso() ? resultado.codigoTransacao() : null)
                .qrCodePix("PIX".equals(checkoutDTO.getMetodoPagamento()) ? resultado.qrCode() : null)
                .pixExpiracao("PIX".equals(checkoutDTO.getMetodoPagamento()) ? LocalDateTime.now().plusMinutes(30) : null)
                .build();

        // 4. Salvar e limpar carrinho (em ordem segura)
        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        carrinhoService.limparCarrinho(usuarioId);

        return converterParaDTO(pedidoSalvo);
    }

    private PedidoDTO converterParaDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setDataPedido(pedido.getDataPedido());
        dto.setStatus(String.valueOf(pedido.getStatus()));
        dto.setTotal(pedido.getTotal());
        dto.setMetodoPagamento(pedido.getMetodoPagamento());
        return dto;
    }

    public List<PedidoDTO> listarPedidosPorUsuario(Long usuarioId) {
        List<Pedido> pedidos = pedidoRepository.findByUsuarioId(usuarioId);

        return pedidos.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public PedidoDTO atualizarStatus(Long pedidoId, String novoStatus) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        pedido.setStatus(StatusPedido.valueOf(novoStatus));

        if (novoStatus.equals("ENVIADO")) {
            pedido.setCodigoRastreio(generateTrackingCode());
        }

        pedidoTrackingService.broadcastPedidosAtivos();

        return converterParaDTO(pedidoRepository.save(pedido));
    }

    private String generateTrackingCode() {
        return "DEAL" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public void confirmarPagamentoPix(String codigoTransacao) {
        Pedido pedido = pedidoRepository.findByCodigoTransacao(codigoTransacao)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        if (pedido.getStatus() != StatusPedido.AGUARDANDO_PAGAMENTO) {
            throw new BusinessException("Pedido já processado");
        }

        pedido.setStatus(StatusPedido.PAGAMENTO_APROVADO);
        pedido.setDataPagamento(LocalDateTime.now());
        pedidoRepository.save(pedido);

        // Aqui você pode adicionar notificação por e-mail, etc.
    }

    public StatusPixResponse consultarStatusPix(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        return StatusPixResponse.builder()
                .status(pedido.getStatus())
                .qrCode(pedido.getQrCodePix())
                .expirado(pedido.isPixExpirado())
                .tempoRestanteMinutos(Duration.between(LocalDateTime.now(), pedido.getPixExpiracao()).toMinutes())
                .build();
    }

    //usado na lista de pedidos na plataforma
    public Page<Pedido> listarPaginado(Pageable pageable) {
        return pedidoRepository.findAll(pageable);
    }
}
