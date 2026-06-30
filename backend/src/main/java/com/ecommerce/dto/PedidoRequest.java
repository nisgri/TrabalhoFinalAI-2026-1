package com.ecommerce.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class PedidoRequest {

    @NotBlank(message = "O nome do cliente é obrigatório")
    private String cliente;

    @NotBlank(message = "A cidade é obrigatória")
    private String cidade;

    @NotNull(message = "O valor total é obrigatório")
    @DecimalMin(value = "0.01", message = "O valor total deve ser maior que zero")
    private BigDecimal valorTotal;

    @NotEmpty(message = "Selecione ao menos um produto")
    private List<String> produtos;
}
