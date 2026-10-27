package com.luizsantos.institutomaoamiga.dto;

import com.luizsantos.institutomaoamiga.model.Ponto;

public record PontoResponse(
        Long id,
        String nome,
        String endereco,
        String diasHorarios,
        String recebeDistribui,
        Double latitude,
        Double longitude) {

    public static PontoResponse fromEntity(Ponto ponto) {
        return new PontoResponse(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getDiasHorarios(),
                ponto.getRecebeDistribui(),
                ponto.getLatitude(),
                ponto.getLongitude());
    }
}
