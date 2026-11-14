package com.luizsantos.institutomaoamiga.dto;

import java.util.UUID;

import com.luizsantos.institutomaoamiga.entity.Ponto;

public record PontoResponseDTO(
        UUID id,
        String nome,
        String endereco,
        String bairro,
        String horario,
        String tipo) {

    public static PontoResponseDTO fromEntity(Ponto ponto) {
        return new PontoResponseDTO(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getBairro(),
                ponto.getHorario(),
                ponto.getTipo());
    }
}
