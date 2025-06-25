package com.fesa.dealhub.dto;

import com.fesa.dealhub.enums.UserRole;
import jakarta.validation.constraints.AssertTrue;
import lombok.*;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioUpdateDTO {
    private int id;
    private String nome;
    private String apelido;
    private String email;
    private String senha;
    private String confirmSenha;
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
    
    public interface PasswordValidationGroup {}
    
    @AssertTrue(message = "As senhas não coincidem", groups = PasswordValidationGroup.class)
    public boolean isSenhasIguais() {
        if ((senha == null || senha.isEmpty()) && (confirmSenha == null || confirmSenha.isEmpty())) {
            return true;
        }
        
        if ((senha == null || senha.isEmpty()) || (confirmSenha == null || confirmSenha.isEmpty())) {
            return false;
        }
        
        return senha.equals(confirmSenha);
    }
}