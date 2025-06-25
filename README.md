# DealHub E-Commerce Platform

<p align="left" style="display: flex; align-items: center; margin-bottom: 20px;">
  <img src="./src/main/resources/static/images/dealhub_logo.svg" alt="DealHub Logo" width="50" height="50" style="margin-right: 15px;">
  <span style="font-size: 1.8em; font-weight: bold; color: #ffffff; background: linear-gradient(135deg, #4A46E4 0%, #6A67E6 100%); padding: 8px 16px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">DealHub</span>
</p>

A complete e-commerce solution with admin dashboard, product management, and payment processing.

![DealHub Screenshot](https://via.placeholder.com/800x400?text=DealHub+Platform+Preview) <!-- Add actual screenshot later -->

## 📌 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Frontend Implementation](#-frontend-implementation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Key Features
### User System
- 🔐 Role-based authentication (Customer, Seller, Admin)
- 📝 Registration with email verification
- 🔄 Profile management

### E-Commerce Core
- 🛍️ Product catalog with categories/subcategories
- 🛒 Shopping cart functionality
- 💳 Multiple payment methods (PIX, Credit Card)
- 📦 Order tracking system

### Admin Dashboard
- 📊 Sales analytics and metrics
- 📈 Trend analysis
- 👥 User management
- 🏷️ Category management

## 💻 Tech Stack
### Backend
| Component       | Technology           |
|-----------------|----------------------|
| Language        | Java 21              |
| Framework       | Spring Boot 3.x      |
| Security        | Spring Security + JWT|
| ORM             | Hibernate            |
| Database        | MySQL 8.0            |
| API Docs        | Swagger UI           |
| Containerization| Docker               |

## 🏗️ Project Structure
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

## ⚙️ Installation
### Prerequisites
Java 21 JDK

MySQL 8.0+

Maven 3.8+

### Setup Steps
1. Clone the repository:
    ```bash
        git clone https://github.com/yourusername/dealhub.git
        cd dealhub
    ```

2. Configure MySQL in application.properties:
    ```bash
        spring.datasource.url=jdbc:mysql://localhost:3306/dealhub
        spring.datasource.username=root
        spring.datasource.password=yourpassword
    ```

3. Run the application:
    ```bash
        ./mvnw clean install
        ./mvnw spring-boot:run
    ```

4. Access the application:
   ```bash
      http://localhost:8080
   ````

#### Se não tem docker desktop instalado na sua máquina utilize o H2
Para utilizar o H2 em caso de não ter o docker desktop utilize o H2, para utilizar o H2 primeiro
cole dentro do arquivo pom no lugar da dependencia do mysql a do H2:
```bash
   <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
```

Dentro do application.properties comente os trechos:
```bash
   spring.datasource.url=jdbc:mysql://localhost:3308/dealhub?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=dealhub_user
   spring.datasource.password=segredo123
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   spring.jpa.hibernate.ddl-auto=update
```

e insira o código a seguir:
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

## 📚 API Documentation
Access Swagger UI at: http://localhost:8080/swagger-ui/index.html#/

Key Endpoints:

* Authentication: /api/auth/login

* Products: /api/produtos

* Orders: /api/pedidos

* Dashboard: /api/admin/dashboard



## 🖥️ Frontend Requirements
### Client Home Page (client_home.html)
Displays featured products, all products, categories, discounted prices, product images, and an "add to cart" button.

### Shopping Cart (carrinho.html)
View of added items, quantity updates, product removal, automatic total calculation, and backend integration for checkout.

### User Profile (perfil.html)
Displays and allows editing of authenticated user information, order history (in development), and management of personal data.

### Login and Registration (login.html, register.html)
User authentication, registration with validation, and error feedback.

### Reusable Components
Navbar, footer, error messages, discount badge, image fallback (no-image.png).

### Responsiveness
Layout adapted for both mobile devices and desktop screens.

### Scripts
Logic for cart management, authentication, product handling, and integration with REST endpoints.

### Custom Error Pages
Friendly messages for common errors (404, 500, etc.).

### How to Customize the Frontend
Template files are located in: src/main/resources/templates/

Stylesheets: src/main/resources/static/css/

JavaScript scripts: src/main/resources/static/js/

Images and icons: src/main/resources/static/images/


## 🚀 Deployment
### Backend
* Requires Java 17+ and MySQL

* Dockerfile included for containerization

### Frontend
 * Requires HTML5,CSS,JavaScript

## 🤝 Contributing
1. Fork the project

2. Create your feature branch (git checkout -b feature/AmazingFeature)

3. Commit your changes (git commit -m 'Add some AmazingFeature')

4. Push to the branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

## 📜 License
Distributed under the MIT License. See LICENSE for more information.
