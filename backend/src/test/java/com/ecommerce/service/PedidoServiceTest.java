package com.ecommerce.service;

import com.ecommerce.dto.PedidoRequest;
import com.ecommerce.entity.Pedido;
import com.ecommerce.exception.N8nIntegrationException;
import com.ecommerce.repository.PedidoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PedidoServiceTest {

    @Test
    void criarPedido_deveFalharQuandoN8nEstiverIndisponivel() {
        PedidoRepository pedidoRepository = mock(PedidoRepository.class);
        RestTemplate restTemplate = mock(RestTemplate.class);
        PedidoService pedidoService = new PedidoService(pedidoRepository, restTemplate, "http://n8n");

        PedidoRequest request = new PedidoRequest();
        request.setCliente("Ana");
        request.setCidade("Rio de Janeiro");
        request.setValorTotal(new BigDecimal("100.00"));
        request.setProdutos(List.of("Notebook"));

        Pedido pedidoPersistido = Pedido.builder()
                .id(10L)
                .cliente("Ana")
                .cidade("Rio de Janeiro")
                .valorTotal(new BigDecimal("100.00"))
                .produtos(List.of("Notebook"))
                .build();

        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedidoPersistido);
        when(restTemplate.postForEntity(eq("http://n8n"), any(HttpEntity.class), eq(Void.class)))
                .thenThrow(new RestClientException("n8n down"));

        assertThrows(N8nIntegrationException.class, () -> pedidoService.criarPedido(request));
        verify(pedidoRepository).save(any(Pedido.class));
    }
}
