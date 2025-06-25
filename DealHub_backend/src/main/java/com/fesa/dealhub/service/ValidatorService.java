package com.fesa.dealhub.service;

import com.fesa.dealhub.dto.CheckoutDTO;
import com.fesa.dealhub.exception.BusinessException;
import org.springframework.stereotype.Service;

import java.time.YearMonth;

@Service
public class ValidatorService {

    public void validarDadosCartao(CheckoutDTO checkoutDTO) {
        if (!"CARTAO".equals(checkoutDTO.getMetodoPagamento())) {
            return; // Só valida se for cartão
        }

        // Validação básica do número (algoritmo de Luhn)
        if (!validarNumeroCartao(checkoutDTO.getNumeroCartao())) {
            throw new BusinessException("Número de cartão inválido");
        }

        // Validação de data
        if (!validarValidadeCartao(checkoutDTO.getValidadeCartao())) {
            throw new BusinessException("Cartão expirado ou data inválida");
        }
    }

    private boolean validarNumeroCartao(String numero) {
        // Implementação simplificada do algoritmo de Luhn
        int sum = 0;
        boolean alternate = false;
        for (int i = numero.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(numero.charAt(i));
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            sum += digit;
            alternate = !alternate;
        }
        return (sum % 10 == 0);
    }

    private boolean validarValidadeCartao(String validade) {
        try {
            String[] parts = validade.split("/");
            int mes = Integer.parseInt(parts[0]);
            int ano = Integer.parseInt(parts[1]) + 2000; // Assume século 21

            YearMonth validity = YearMonth.of(ano, mes);
            return validity.isAfter(YearMonth.now());
        } catch (Exception e) {
            return false;
        }
    }

    public void validarChavePix(String chave) {
        // Padrões de chave PIX (CPF, CNPJ, email, telefone ou chave aleatória)
        String regex = "^(\\d{11}|\\d{14}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}|\\+55\\d{11}|[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12})$";

        if (!chave.matches(regex)) {
            throw new BusinessException("Chave PIX inválida");
        }
    }
}
