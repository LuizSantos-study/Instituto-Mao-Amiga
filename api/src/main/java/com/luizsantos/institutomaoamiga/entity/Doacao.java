package com.luizsantos.institutomaoamiga.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "doacoes")
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tipo_item", nullable = false)
    private String tipoItem;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "ponto_destino", nullable = false)
    private String pontoDestino;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    public Doacao() {
    }

    public Doacao(String tipoItem, Integer quantidade, String pontoDestino, LocalDateTime criadoEm) {
        this.tipoItem = tipoItem;
        this.quantidade = quantidade;
        this.pontoDestino = pontoDestino;
        this.criadoEm = criadoEm;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTipoItem() {
        return tipoItem;
    }

    public void setTipoItem(String tipoItem) {
        this.tipoItem = tipoItem;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getPontoDestino() {
        return pontoDestino;
    }

    public void setPontoDestino(String pontoDestino) {
        this.pontoDestino = pontoDestino;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
