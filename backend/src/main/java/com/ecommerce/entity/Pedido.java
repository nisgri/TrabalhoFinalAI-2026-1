package com.ecommerce.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cliente;

    @Column(nullable = false)
    private String cidade;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pedido_produtos", joinColumns = @JoinColumn(name = "pedido_id"))
    @Column(name = "produto")
    @Builder.Default
    private List<String> produtos = new ArrayList<>();

    @Column(columnDefinition = "TEXT") // Permite textos longos sem limite rígido de 255 caracteres
    private String perfilCliente;

    @Column(columnDefinition = "TEXT") // Permite a lista grande de recomendações do Gemini
    private String recomendacoes;

    private String cupomDesconto; // Este pode continuar normal (ex: "TECH10" é curto)

    @Column(columnDefinition = "TEXT") // Garante que o textão da mensagem da IA caiba perfeitamente
    private String mensagemIA;

    public boolean possuiAnaliseCompleta() {
        return perfilCliente != null && !perfilCliente.isBlank();
    }
}
