package com.ecommerce.controller;

import com.ecommerce.dto.AnaliseRequest;
import com.ecommerce.dto.PedidoRequest;
import com.ecommerce.entity.Pedido;
import com.ecommerce.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido criarPedido(@Valid @RequestBody PedidoRequest request) {
        return pedidoService.criarPedido(request);
    }

    @PutMapping("/{id}/analise")
    public Pedido atualizarAnalise(@PathVariable Long id, @Valid @RequestBody AnaliseRequest request) {
        return pedidoService.atualizarAnalise(id, request);
    }

    @GetMapping("/{id}")
    public Pedido buscarPedido(@PathVariable Long id) {
        return pedidoService.buscarPorId(id);
    }
}
