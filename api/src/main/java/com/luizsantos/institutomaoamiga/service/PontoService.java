package com.luizsantos.institutomaoamiga.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.luizsantos.institutomaoamiga.dto.PontoRequestDTO;
import com.luizsantos.institutomaoamiga.dto.PontoResponseDTO;
import com.luizsantos.institutomaoamiga.entity.Ponto;
import com.luizsantos.institutomaoamiga.repository.PontoRepository;

@Service
@Transactional(readOnly = true)
public class PontoService {

    private static final int MAX_PAGE_SIZE = 50;

    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    public List<PontoResponseDTO> listar() {
        return pontoRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"))
                .stream()
                .map(PontoResponseDTO::fromEntity)
                .toList();
    }

    public Page<PontoResponseDTO> filtrar(String filtro, Pageable pageable) {
        Pageable pageableSeguro = limitarTamanhoPagina(pageable);
        String termo = (filtro == null) ? "" : filtro.trim();
        return pontoRepository.buscarPorFiltro(termo, pageableSeguro)
                .map(PontoResponseDTO::fromEntity);
    }

    public PontoResponseDTO buscarPorId(UUID id) {
        return pontoRepository.findById(id)
                .map(PontoResponseDTO::fromEntity)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ponto de coleta não encontrado para o id: " + id));
    }

    @Transactional
    public PontoResponseDTO criar(PontoRequestDTO request) {
        Ponto ponto = new Ponto(
                request.nome().trim(),
                request.endereco().trim(),
                request.bairro().trim(),
                request.horario().trim(),
                normalizarTipo(request.tipo()));

        Ponto salvo = pontoRepository.save(ponto);
        return PontoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public PontoResponseDTO atualizar(UUID id, PontoRequestDTO request) {
        Ponto ponto = pontoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ponto de coleta não encontrado para o id: " + id));

        ponto.setNome(request.nome().trim());
        ponto.setEndereco(request.endereco().trim());
        ponto.setBairro(request.bairro().trim());
        ponto.setHorario(request.horario().trim());
        ponto.setTipo(normalizarTipo(request.tipo()));

        Ponto salvo = pontoRepository.save(ponto);
        return PontoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public void excluir(UUID id) {
        if (!pontoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Ponto de coleta não encontrado para o id: " + id);
        }
        pontoRepository.deleteById(id);
    }

    private String normalizarTipo(String tipo) {
        String valor = tipo.trim().toLowerCase();
        if ("distribuicao".equals(valor) || "distribuição".equals(valor)) {
            return "distribuição";
        }
        return "coleta";
    }

    private Pageable limitarTamanhoPagina(Pageable pageable) {
        if (pageable.isUnpaged()) {
            return PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "nome"));
        }
        int tamanho = Math.min(pageable.getPageSize(), MAX_PAGE_SIZE);
        return PageRequest.of(pageable.getPageNumber(), tamanho, pageable.getSort());
    }
}
