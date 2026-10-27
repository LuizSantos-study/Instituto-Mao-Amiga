package com.luizsantos.institutomaoamiga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pontos")
public class Ponto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(name = "dias_horarios", nullable = false)
    private String diasHorarios;

    @Column(name = "recebe_distribui", nullable = false)
    private String recebeDistribui;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    public Ponto() {
    }

    public Ponto(
            String nome,
            String endereco,
            String diasHorarios,
            String recebeDistribui,
            Double latitude,
            Double longitude) {
        this.nome = nome;
        this.endereco = endereco;
        this.diasHorarios = diasHorarios;
        this.recebeDistribui = recebeDistribui;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getDiasHorarios() {
        return diasHorarios;
    }

    public void setDiasHorarios(String diasHorarios) {
        this.diasHorarios = diasHorarios;
    }

    public String getRecebeDistribui() {
        return recebeDistribui;
    }

    public void setRecebeDistribui(String recebeDistribui) {
        this.recebeDistribui = recebeDistribui;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
