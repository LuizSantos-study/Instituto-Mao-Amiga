package com.luizsantos.institutomaoamiga.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.luizsantos.institutomaoamiga.dto.PontoResponse;
import com.luizsantos.institutomaoamiga.repository.PontoRepository;

@Service
@Transactional(readOnly = true)
public class PontoService {

    private static final int MAX_PAGE_SIZE = 50;

    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    public Page<PontoResponse> listar(Pageable pageable) {
        Pageable pageableSeguro = limitarTamanhoPagina(pageable);
        return pontoRepository.findAll(pageableSeguro).map(PontoResponse::fromEntity);
    }

    public PontoResponse buscarPorId(Long id) {
        return pontoRepository.findById(id)
                .map(PontoResponse::fromEntity)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ponto de coleta nao encontrado para o id: " + id));
    }

    private Pageable limitarTamanhoPagina(Pageable pageable) {
        if (pageable.isUnpaged()) {
            return PageRequest.of(0, 20);
        }
        int tamanho = Math.min(pageable.getPageSize(), MAX_PAGE_SIZE);
        return PageRequest.of(pageable.getPageNumber(), tamanho, pageable.getSort());
    }
}
