package com.fesa.dealhub.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class CustomErrorController implements ErrorController {

    private static final String ERROR_PATH = "/error";

    @RequestMapping(value = ERROR_PATH, produces = {MediaType.APPLICATION_JSON_VALUE})
    @ResponseBody
    public ResponseEntity<ErrorResponse> handleErrorJson(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

        String statusCode = status != null ? status.toString() : "Desconhecido";
        String errorMessage = message != null ? message.toString() : "Erro desconhecido";
        String exceptionMsg = (exception != null) ? exception.toString() : "Contato com o suporte.";

        System.out.println("Erro detectado: " + statusCode + " - " + errorMessage);
        System.out.println("Exceção: " + exceptionMsg);

        if ("401".equals(statusCode)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(
                statusCode,
                "Autenticação necessária para acessar este recurso.",
                "Faça login e tente novamente."
            ));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse(
            statusCode,
            errorMessage,
            exceptionMsg
        ));
    }

    @RequestMapping(value = ERROR_PATH, produces = MediaType.TEXT_HTML_VALUE)
    public String handleErrorHtml(HttpServletRequest request, Model model) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

        String statusCode = status != null ? status.toString() : "Desconhecido";
        String errorMessage = message != null ? message.toString() : "Erro desconhecido";
        String exceptionMsg = (exception != null) ? exception.toString() : "Contato com o suporte.";

        System.out.println("Erro HTML detectado: " + statusCode + " - " + errorMessage);
        System.out.println("Exceção: " + exceptionMsg);

        model.addAttribute("status", statusCode);
        model.addAttribute("message", errorMessage);
        model.addAttribute("exception", exceptionMsg);

        return "error";
    }

    private static class ErrorResponse {
        private final String status;
        private final String message;
        private final String exception;

        public ErrorResponse(String status, String message, String exception) {
            this.status = status;
            this.message = message;
            this.exception = exception;
        }

        public String getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public String getException() {
            return exception;
        }
    }
}