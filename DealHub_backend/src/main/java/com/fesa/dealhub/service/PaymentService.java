package com.fesa.dealhub.service;

import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    public boolean processarPagamento(String metodoPagamento, Double valor) {
        // Simulação - sempre retorna true em desenvolvimento
        return true;

        // Em produção, integraria com:
        // - Mercado Pago
        // - PagSeguro
        // - Stripe, etc
    }
}
