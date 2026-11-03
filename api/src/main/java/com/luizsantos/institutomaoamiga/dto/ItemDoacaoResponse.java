package com.luizsantos.institutomaoamiga.dto;

import com.luizsantos.institutomaoamiga.model.ItemDoacao;

public record ItemDoacaoResponse(
        String doacaoID,
        String tipoItem,
        Integer quantidade,
        String pontoDestino,
        String pontoID,
        String criadoEm) {

    public static ItemDoacaoResponse fromEntity(ItemDoacao item) {
        return new ItemDoacaoResponse(
                String.valueOf(item.getId()),
                item.getTipoItem(),
                item.getQuantidade(),
                item.getPontoDestino(),
                item.getPontoID(),
                item.getCriadoEm());
    }
}
