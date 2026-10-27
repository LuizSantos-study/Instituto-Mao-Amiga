package com.luizsantos.institutomaoamiga.dto;

public record PontoRequest(
        String nome,
        String endereco,
        String diasHorarios,
        String recebeDistribui,
        Double latitude,
        Double longitude) {
}
