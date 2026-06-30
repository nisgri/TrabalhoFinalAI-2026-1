package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class N8nWebhookPayload {

    private Long id;
    private String cliente;
    private String cidade;
    private BigDecimal valorTotal;
    private List<String> produtos;
}
