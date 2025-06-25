# Plataforma E-Commerce DealHub

<p align="left" style="display: flex; align-items: center; margin-bottom: 20px;">
  <img src="./src/main/resources/static/images/dealhub_logo.svg" alt="Logo DealHub" width="50" height="50" style="margin-right: 15px;">
  <span style="font-size: 1.8em; font-weight: bold; color: #ffffff; background: linear-gradient(135deg, #4A46E4 0%, #6A67E6 100%); padding: 8px 16px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">DealHub</span>
</p>

Solução completa de e-commerce com painel administrativo, gestão de produtos e processamento de pagamentos.

![Captura de Tela DealHub](https://via.placeholder.com/800x400?text=Preview+Plataforma+DealHub) <!-- Adicionar screenshot real depois -->

## 📌 Sumário
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura](#-estrutura)
- [Instalação](#-instalação)
- [Documentação API](#-documentação-api)
- [Frontend](#-frontend)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🚀 Funcionalidades Principais
### Sistema de Usuários
- 🔐 Autenticação por roles (Cliente, Vendedor, Admin)
- 📝 Cadastro com verificação de e-mail
- 🔄 Gerenciamento de perfil

### Núcleo E-Commerce
- 🛍️ Catálogo de produtos com categorias/subcategorias
- 🛒 Carrinho de compras
- 💳 Múltiplos métodos de pagamento (PIX, Cartão)
- 📦 Rastreamento de pedidos

### Painel Administrativo
- 📊 Análise de vendas e métricas
- 📈 Identificação de tendências
- 👥 Gestão de usuários
- 🏷️ Gerenciamento de categorias

## 💻 Tecnologias
### Backend
| Componente       | Tecnologia          |
|-----------------|---------------------|
| Linguagem       | Java 21             |
| Framework       | Spring Boot 3.x     |
| Segurança       | Spring Security + JWT|
| ORM             | Hibernate           |
| Banco de Dados  | MySQL 8.0           |
| Documentação    | Swagger UI          |
| Container       | Docker              |

### Frontend (A implementar)
```plaintext
[Detalhes do frontend a serem adicionados pelo Igor]
```

## 🏗️ Estrutura do Projeto
```powershel
src/
|--main/
|  |--java/
|  |  |--com.fesa.dealhub/
|  |                    |--config/
|  |                    |  |--DotenvLoader.java
|  |                    |  |--SecurityConfig
|  |                    |  |--WebConfig
|  |                    |  └──WebSocketConfig
|  |                    |--controller/
|  |                    |  |--platform/
|  |                    |  |  └──AdminController.java
|  |                    |  |--AuthController.java
|  |                    |  |--CarrinhoController.java
|  |                    |  |--CategoriaController.java
|  |                    |  |--CustomErrorController.java
|  |                    |  |--PedidoController.java
|  |                    |  |--ProdutoController.java
|  |                    |  |--SubcategoriaController.java
|  |                    |  |--UsuarioController.java
|  |                    |  |--ViewController.java
|  |                    |  └──WebhookController.java
|  |                    |--dto/
|  |                    |  |--CarrinhoDTO.java
|  |                    |  |--CategoriaDTO.java
|  |                    |  |--CheckouDTO.java
|  |                    |  |--ItemCarrinhoDTO.java
|  |                    |  |--PedidoDTO.java
|  |                    |  |--PadidoTrackindDTO.java
|  |                    |  |--ProdutoDTO.java
|  |                    |  |--SubcategoriaDTO.java
|  |                    |  |--UsuarioCadastroDTO.java
|  |                    |  |--UsuarioLoginDTO.java
|  |                    |  └──UsuarioUpdateDTO.java
|  |                    |--enums/
|  |                    |  |--StatusPedido.java
|  |                    |  └──UserRole.java
|  |                    |--exception/
|  |                    |  |--AuthorizationException.java
|  |                    |  |--BusinessException.java
|  |                    |  └──ResourceNotFoundException.java
|  |                    |--model/
|  |                    |  |--Carrinho.java
|  |                    |  |--Categoria.java
|  |                    |  |--DashboardMetrics.java
|  |                    |  |--Endereco.java
|  |                    |  |--ItemCarrinho.java
|  |                    |  |--ItemPedido.java
|  |                    |  |--MetricaTendencia.java
|  |                    |  |--MetricaUsuario.java
|  |                    |  |--Pedido.java
|  |                    |  |--Produto.java
|  |                    |  |--StatusPixResponse.java
|  |                    |  |--Subcategoria.java
|  |                    |  |--Usuario.java
|  |                    |  └──UsuarioDetails.java
|  |                    |--repository/
|  |                    |  |--CarrinhoRepository.java
|  |                    |  |--CategoriaRepository.java
|  |                    |  |--EnderecoRepository.java
|  |                    |  |--ItemCarrinhoRepository.java
|  |                    |  |--PedidoRepository.java
|  |                    |  |--ProdutoRepository.java
|  |                    |  |--SubcategoriaRepository.java
|  |                    |  └──UsuarioRepository.java
|  |                    |--security/
|  |                    |  |--service/
|  |                    |  |  └──CustomUserDetailsService.java
|  |                    |  └──utils/
|  |                    |     └──SecurityUtils.java
|  |                    |--service/
|  |                    |  |--CarrinhoService.java
|  |                    |  |--CategoriaService.java
|  |                    |  |--DashboardService.java
|  |                    |  |--NotificacaoService.java
|  |                    |  |--PaymentService.java
|  |                    |  |--PedidoService.java
|  |                    |  |--PedidoTrackingService.java
|  |                    |  |--ProdutoService.java
|  |                    |  |--SimulacaoPagamentoService.java
|  |                    |  |--SubcategoriaService.java
|  |                    |  |--UsuarioService.java
|  |                    |  └──ValidatorService.java
|  |                    └── DealHubApplication
|  |--resources/
|     |--static/
|     |  |--css/
|     |  |  |--platform/
|     |  |  |  |--admin.css
|     |  |  |  |--categories.css
|     |  |  |  |--orders.css
|     |  |  |  |--product.css
|     |  |  |  └──user.css
|     |  |  |--carrinho.css
|     |  |  |--client_home.css
|     |  |  |--error.css
|     |  |  |--home.css
|     |  |  |--login.css
|     |  |  |--perfil.css
|     |  |  └──register.css
|     |  |--js/
|     |  |  |--helpers/
|     |  |  |  |--auth-check.js
|     |  |  |  └──auth-hekper.js
|     |  |  |--page_scripts/
|     |  |  |  |--carrinho.js
|     |  |  |  |--client_home.js
|     |  |  |  |--perfil.js
|     |  |  |  └──register.js
|     |  |  └──platform/
|     |  |     |--admin-script.js
|     |  |     |--buscaCep.ja
|     |  |     |--categories.js
|     |  |     |--orders.js
|     |  |     |--product.js
|     |  |     |--user.js
|     |  |     └──validacaoCadastro.js
|     |  └──favicon.icon
|     └──templates/
|        |--components/
|        |  |--empty-cart.html
|        |  |--footer.html
|        |  └──navbar.html
|        |--plataforma/
|        |  |--admin/
|        |  |  |--catgories/
|        |  |  |  |--cadastro-categories.html
|        |  |  |  |--list-categories.html
|        |  |  |  └──update-categories.html
|        |  |  |--orders/
|        |  |  |  └──list-order.html
|        |  |  |--products/
|        |  |  |  |--cadastro-product.html
|        |  |  |  |--list-product.html
|        |  |  |  └──update-product.html
|        |  |  |--users/
|        |  |  |  |--cadastro.html
|        |  |  |  |--list.html
|        |  |  |  └──update.html
|        |  |  └──dashboard.html
|        |  └──components/
|        |     |--header.html
|        |     └──sidebar.html
|        |--carrinho.html
|        |--client_home.html
|        |--error.html
|        |--login.html
|        |--perfil.html
|        └──register.html
|--test/
```

## ⚙️ Guia de Instalação
### Pré-requisitos
Java 21 JDK

MySQL 8.0+

Maven 3.8+

### Passo a Passo
1. Clone o repositório:
   ```bash
    git clone https://github.com/seuusuario/dealhub.git
    cd dealhub
   ```

2. Configure o MySQL no application.properties:
    ```bash
        spring.datasource.url=jdbc:mysql://localhost:3306/dealhub
        spring.datasource.username=root
        spring.datasource.password=yourpassword
    ```

3. Execute a aplicação:
    ```bash
        ./mvnw spring-boot:run
    ```
#### If you don't have Docker Desktop installed on your machine, use H2.
To use H2 if you don't have Docker Desktop, use H2. To use H2, first
paste the H2 dependency into the pom file in place of the MySQL dependency:
```bash
   <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
```

Inside application.properties comment out the following sections:
```bash
   spring.datasource.url=jdbc:mysql://localhost:3308/dealhub?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=dealhub_user
   spring.datasource.password=segredo123
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   spring.jpa.hibernate.ddl-auto=update
```

and insert the following code:
```bash
   # Configuração padrão (usando H2)
   spring.datasource.url=jdbc:h2:mem:dealhub_db
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.username=sa
   spring.datasource.password=dealhub123
   
   # H2 Console (acessível em http://localhost:8080/h2-console)
   spring.h2.console.enabled=true
   spring.h2.console.path=/h2-console
```

## 📚 Documentação da API
Acesse o Swagger em: http://localhost:8080/swagger-ui/index.html#/

Principais Endpoints:

* Authentication: /api/auth/login

* Products: /api/produtos

* Orders: /api/pedidos

* Dashboard: /api/admin/dashboard



## 🖥️ Requisitos do Frontend
A interface do usuário é construída com Thymeleaf, CSS3 e JavaScript moderno, proporcionando uma experiência responsiva e dinâmica.
Principais páginas e funcionalidades já implementadas:


### Página Inicial do Cliente (client_home.html)
Exibe produtos em destaque, todos os produtos, categorias, preços com desconto, imagens dos produtos e botão de adicionar ao carrinho.


### Carrinho de Compras (carrinho.html)
Visualização dos itens adicionados, atualização de quantidades, remoção de produtos, cálculo automático de totais e integração com o backend para checkout.


### Perfil do Usuário (perfil.html)
Exibe e permite editar informações do usuário autenticado, histórico de pedidos (em desenvolvimento) e gerenciamento de dados pessoais.


### Login e Cadastro (login.html, register.html)
Autenticação de usuários, registro com validação e feedback de erros.


### Componentes Reutilizáveis
Navbar, footer, mensagens de erro, badge de desconto, fallback de imagem (no-image.png).


### Responsividade
Layout adaptado para dispositivos móveis e desktops.


### Scripts
Lógica de carrinho, autenticação, manipulação de produtos e integração com endpoints REST.


### Páginas de Erro Personalizadas
Mensagens amigáveis para erros comuns (404, 500, etc).


### Como customizar o Frontend
Os arquivos de template estão em src/main/resources/templates/.
Os estilos estão em src/main/resources/static/css/.
Os scripts JavaScript estão em src/main/resources/static/js/.
Imagens e ícones em src/main/resources/static/images/.


## 🚀 Deployment
### Backend
* Requer Java 21+ e MySQL

* Dockerfile incluído para containerização

### Frontend
 Igor essa parte vai ser conforme sua implementação

## 🤝 Como Contribuir
1. Faça um fork do projeto

2. Crie sua branch (git checkout -b feature/NovaFuncionalidade)

3. Commit suas mudanças (git commit -m 'Adiciona NovaFuncionalidade')

4. Push para a branch (git push origin feature/NovaFuncionalidade)

5. Abra um Pull Request

## 📜 Licença
Distribuído sob licença MIT. Veja LICENSE para mais informações.