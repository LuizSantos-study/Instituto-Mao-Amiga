package com.luizsantos.institutomaoamiga.dto;

public record ItemDoacaoRequest(
        String tipoItem,
        Integer quantidade,
        String pontoDestino,
        String pontoID,
        String criadoEm) {
}
