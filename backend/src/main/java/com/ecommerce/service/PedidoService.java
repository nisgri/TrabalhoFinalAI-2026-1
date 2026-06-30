package com.ecommerce.service;

import com.ecommerce.dto.AnaliseRequest;
import com.ecommerce.dto.N8nWebhookPayload;
import com.ecommerce.dto.PedidoRequest;
import com.ecommerce.entity.Pedido;
import com.ecommerce.repository.PedidoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Slf4j
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final RestTemplate restTemplate;

    @Value("${n8n.webhook.url}")
    private String n8nWebhookUrl;

    // Construtor manual que garante que o Spring resolva tudo junto ao mesmo tempo:
    public PedidoService(
            PedidoRepository pedidoRepository, 
            RestTemplate restTemplate, 
            @Value("${n8n.webhook.url}") String n8nWebhookUrl) {
        this.pedidoRepository = pedidoRepository;
        this.restTemplate = restTemplate;
        this.n8nWebhookUrl = n8nWebhookUrl;
    }

    @Transactional
    public Pedido criarPedido(PedidoRequest request) {
        Pedido pedido = Pedido.builder()
                .cliente(request.getCliente())
                .cidade(request.getCidade())
                .valorTotal(request.getValorTotal())
                .produtos(request.getProdutos())
                .build();

        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        enviarParaN8n(pedidoSalvo);

        return pedidoSalvo;
    }

    @Transactional(readOnly = true)
    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Pedido não encontrado: " + id));
    }

    @Transactional
    public Pedido atualizarAnalise(Long id, AnaliseRequest request) {
        Pedido pedido = buscarPorId(id);

        pedido.setPerfilCliente(request.getPerfilCliente());
        pedido.setRecomendacoes(request.getRecomendacoes());
        pedido.setCupomDesconto(request.getCupomDesconto());
        pedido.setMensagemIA(request.getMensagemIA());

        return pedidoRepository.save(pedido);
    }

    private void enviarParaN8n(Pedido pedido) {
        N8nWebhookPayload payload = N8nWebhookPayload.builder()
                .id(pedido.getId())
                .cliente(pedido.getCliente())
                .cidade(pedido.getCidade())
                .valorTotal(pedido.getValorTotal())
                .produtos(pedido.getProdutos())
                .build();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<N8nWebhookPayload> entity = new HttpEntity<>(payload, headers);

            restTemplate.postForEntity(n8nWebhookUrl, entity, Void.class);
            log.info("Pedido {} enviado ao webhook n8n", pedido.getId());
        } catch (RestClientException ex) {
            log.error("Falha ao enviar pedido {} para o n8n: {}", pedido.getId(), ex.getMessage());
        }
    }
}
