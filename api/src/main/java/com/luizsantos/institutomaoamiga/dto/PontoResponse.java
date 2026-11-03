package com.luizsantos.institutomaoamiga.dto;

import com.luizsantos.institutomaoamiga.model.Ponto;

public record PontoResponse(
        String pontoID,
        String nome,
        String endereco,
        String diasHorarios,
        String recebeDistribui,
        Double latitude,
        Double longitude) {

    public static PontoResponse fromEntity(Ponto ponto) {
        return new PontoResponse(
                String.valueOf(ponto.getId()),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getDiasHorarios(),
                ponto.getRecebeDistribui(),
                ponto.getLatitude(),
                ponto.getLongitude());
    }
}
