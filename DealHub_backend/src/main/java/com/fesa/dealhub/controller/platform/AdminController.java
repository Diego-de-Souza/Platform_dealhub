package com.fesa.dealhub.controller.platform;

import com.fesa.dealhub.dto.UsuarioCadastroDTO;
import com.fesa.dealhub.dto.UsuarioUpdateDTO;
import com.fesa.dealhub.enums.UserRole;
import com.fesa.dealhub.model.*;
import com.fesa.dealhub.service.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.time.LocalDate;

@Controller
@RequestMapping("/plataforma/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')") // Adicionado ROLE_ prefix
public class AdminController {

    private final DashboardService dashboardService;


    private final PedidoService pedidoService;

    public AdminController(DashboardService dashboardService,
                           PedidoService pedidoService) {
        this.dashboardService = dashboardService;
        this.pedidoService = pedidoService;
    }

    @GetMapping("/")
    public String admin() {
        return "redirect:/plataforma/admin/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        DashboardMetrics metrics = dashboardService.carregarMetricasCompletas();
        model.addAttribute("dashboardMetrics", metrics);
        model.addAttribute("title", "Dashboard");
        return "platform/admin/dashboard";
    }


    //parte de pedidos
    @GetMapping("/pedidos/listar")
    public String listarPedidos(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size,
                                 Model model) {

        Page<Pedido> paginaPedidos = pedidoService.listarPaginado(PageRequest.of(page, size));

        model.addAttribute("title", "Lista de Pedidos");
        model.addAttribute("pedidos", paginaPedidos.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", paginaPedidos.getTotalPages());
        model.addAttribute("totalElements", paginaPedidos.getTotalElements());

        return "platform/admin/orders/list-order";
    }
}

