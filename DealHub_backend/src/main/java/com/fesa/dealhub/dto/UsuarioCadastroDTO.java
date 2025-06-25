package com.fesa.dealhub.dto;

import com.fesa.dealhub.enums.UserRole;
import lombok.Data;

@Data
public class UsuarioCadastroDTO {
    private String nome;
    private String apelido;
    private String email;
    private String senha;
    private String cpf;
    private String telefone;
    private UserRole role;
    private String dataNascimento;

    // Campos de endereço
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    private boolean principal;
}
