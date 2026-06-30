package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnaliseRequest {

    @NotBlank(message = "O perfil do cliente é obrigatório")
    private String perfilCliente;

    private String recomendacoes;

    private String cupomDesconto;

    @NotBlank(message = "A mensagem da IA é obrigatória")
    @Size(max = 1000)
    private String mensagemIA;
}
