package com.fesa.dealhub.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!prod") // Só carrega em ambientes não-produtivos
public class DotenvConfig {

    @Bean
    public Dotenv dotenv() {
        Dotenv dotenv = Dotenv.configure()
                .directory("./") // Busca na raiz do projeto
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        // Debug (opcional)
        System.out.println("=== Variáveis carregadas do .env ===");
        dotenv.entries().forEach(e ->
                System.out.println(e.getKey() + "=" + e.getValue())
        );

        return dotenv;
    }
}