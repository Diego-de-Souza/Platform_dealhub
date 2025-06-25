package com.fesa.dealhub.controller;

import com.fesa.dealhub.dto.UsuarioUpdateDTO;
import com.fesa.dealhub.model.Categoria;
import com.fesa.dealhub.model.Produto;
import com.fesa.dealhub.model.Usuario;
import com.fesa.dealhub.service.CarrinhoService;
import com.fesa.dealhub.service.CategoriaService;
import com.fesa.dealhub.service.ProdutoService;
import com.fesa.dealhub.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;

@Controller
public class ViewController {

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private CarrinhoService carrinhoService;
    
    @Autowired
    private ProdutoService produtoService;
    
    @Autowired
    private CategoriaService categoriaService;

    private void addAuthAttributes(Model model) {
    }
    
    private void addAuthAttributes(ModelAndView modelAndView) {
    }

@GetMapping("/")
public String home(Model model) {
    try {
        List<Produto> produtosDestaque = produtoService.buscarProdutosDestaque();
        List<Produto> todosProdutos = produtoService.listarTodos();
        
        List<Categoria> categorias = categoriaService.listarTodos();
        
        model.addAttribute("produtosDestaque", produtosDestaque != null ? produtosDestaque : new ArrayList<>());
        model.addAttribute("todosProdutos", todosProdutos != null ? todosProdutos : new ArrayList<>());
        model.addAttribute("categorias", categorias);
        
        model.addAttribute("totalProdutos",
            (produtosDestaque != null ? produtosDestaque.size() : 0) +
            (todosProdutos != null ? todosProdutos.size() : 0));
        
        return "client_home";
    } catch (Exception e) {
        e.printStackTrace();
        model.addAttribute("error", "Erro ao carregar a página: " + e.getMessage());
        return "error";
    }
}

    @GetMapping("/login")
    public ModelAndView showLoginForm() {
        ModelAndView modelAndView = new ModelAndView("login");
        addAuthAttributes(modelAndView);
        return modelAndView;
    }

    @GetMapping("/register")
    public ModelAndView showRegisterForm() {
        ModelAndView modelAndView = new ModelAndView("register");
        addAuthAttributes(modelAndView);
        return modelAndView;
    }

    @GetMapping("/home")
    public String redirectToHome() {
        return "redirect:/";
    }
    
    @GetMapping("/minha-conta")
    public String minhaContaPage(HttpServletRequest request) {
        return "redirect:/perfil";
    }
    
    @GetMapping("/perfil")
    public String perfilPage(Model model) {
        // Implementação omitida para brevidade
        return "perfil";
    }
    
    @PostMapping("/perfil/atualizar")
    public String atualizarPerfil(
            @Valid @ModelAttribute("usuarioDTO") UsuarioUpdateDTO usuarioDTO, 
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes,
            Model model) {
        return "redirect:/perfil";
    }

    @GetMapping("/carrinho")
    public String carrinho(Model model) {
        return "carrinho";
    }
}