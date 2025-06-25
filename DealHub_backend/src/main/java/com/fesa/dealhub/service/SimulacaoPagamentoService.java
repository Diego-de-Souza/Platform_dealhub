package com.fesa.dealhub.service;

import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Random;
import java.util.UUID;

@Service
public class SimulacaoPagamentoService {

    private final Random random = new Random();

    public ResultadoPagamento simularPagamento(String metodoPagamento, Double valor) {
        // Simula tempo de processamento
        try {
            Thread.sleep(1000 + random.nextInt(2000)); // 1-3 segundos
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Lógica de simulação
        boolean sucesso = random.nextDouble() > 0.1; // 90% de chance de sucesso

        if ("PIX".equalsIgnoreCase(metodoPagamento)) {
            String qrCode = gerarQrCodePixFicticio(valor);
            return new ResultadoPagamento(true, "PIX_" + System.currentTimeMillis(),
                    "Pagamento via PIX pendente", qrCode);
        }

        if (sucesso) {
            String codigoTransacao = "TRANS" + System.currentTimeMillis();
            return new ResultadoPagamento(true, codigoTransacao, "Pagamento aprovado");
        } else {
            return new ResultadoPagamento(false, null,
                    metodoPagamento.equals("CARTAO") ?
                            "Cartão recusado" : "Falha no processamento");
        }
    }

    public record ResultadoPagamento(
            boolean sucesso,
            String codigoTransacao,
            String mensagem,
            String qrCode
    ) {public ResultadoPagamento(boolean sucesso, String codigoTransacao, String mensagem) {
        this(sucesso, codigoTransacao, mensagem, null);
    }}

    private String gerarQrCodePixFicticio(Double valor) {
        String payload = String.format(
                "00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-4266554400005204000053039865405%.2f5802BR5901F6002DealHub62070503***6304%s",
                valor,
                gerarChecksum()
        );
        return Base64.getEncoder().encodeToString(payload.getBytes());
    }

    private String gerarChecksum() {
        return UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}
