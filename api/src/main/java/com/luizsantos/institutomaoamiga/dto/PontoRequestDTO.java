package com.luizsantos.institutomaoamiga.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PontoRequestDTO(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "Endereço é obrigatório")
        String endereco,

        @NotBlank(message = "Bairro é obrigatório")
        String bairro,

        @NotBlank(message = "Horário é obrigatório")
        String horario,

        @NotBlank(message = "Tipo é obrigatório")
        @Pattern(
                regexp = "^(?i)(coleta|distribuição|distribuicao)$",
                message = "Tipo deve ser 'coleta' ou 'distribuição'")
        String tipo) {
}
