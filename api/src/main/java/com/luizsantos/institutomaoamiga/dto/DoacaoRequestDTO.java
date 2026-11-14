package com.luizsantos.institutomaoamiga.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DoacaoRequestDTO(
        @NotBlank(message = "Tipo do item é obrigatório")
        String tipoItem,

        @NotNull(message = "Quantidade é obrigatória")
        @Min(value = 1, message = "Quantidade deve ser maior que zero")
        Integer quantidade,

        @NotBlank(message = "Ponto de destino é obrigatório")
        String pontoDestino) {
}
