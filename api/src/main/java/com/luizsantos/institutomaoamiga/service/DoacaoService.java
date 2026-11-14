package com.luizsantos.institutomaoamiga.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
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

import com.luizsantos.institutomaoamiga.dto.DoacaoRequestDTO;
import com.luizsantos.institutomaoamiga.dto.DoacaoResponseDTO;
import com.luizsantos.institutomaoamiga.entity.Doacao;
import com.luizsantos.institutomaoamiga.repository.DoacaoRepository;

@Service
@Transactional(readOnly = true)
public class DoacaoService {

    private static final int MAX_PAGE_SIZE = 50;

    private final DoacaoRepository doacaoRepository;

    public DoacaoService(DoacaoRepository doacaoRepository) {
        this.doacaoRepository = doacaoRepository;
    }

    public List<DoacaoResponseDTO> listar() {
        return doacaoRepository.findAll(Sort.by(Sort.Direction.DESC, "criadoEm"))
                .stream()
                .map(DoacaoResponseDTO::fromEntity)
                .toList();
    }

    public Page<DoacaoResponseDTO> filtrar(String filtro, Pageable pageable) {
        Pageable pageableSeguro = limitarTamanhoPagina(pageable);
        String termo = (filtro == null) ? "" : filtro.trim();
        return doacaoRepository.buscarPorFiltro(termo, pageableSeguro)
                .map(DoacaoResponseDTO::fromEntity);
    }

    public DoacaoResponseDTO buscarPorId(UUID id) {
        return doacaoRepository.findById(id)
                .map(DoacaoResponseDTO::fromEntity)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Doação não encontrada para o id: " + id));
    }

    @Transactional
    public DoacaoResponseDTO criar(DoacaoRequestDTO request) {
        Doacao entidade = new Doacao(
                request.tipoItem().trim(),
                request.quantidade(),
                request.pontoDestino().trim(),
                LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));

        Doacao salvo = doacaoRepository.save(entidade);
        return DoacaoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public DoacaoResponseDTO atualizar(UUID id, DoacaoRequestDTO request) {
        Doacao entidade = doacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Doação não encontrada para o id: " + id));

        entidade.setTipoItem(request.tipoItem().trim());
        entidade.setQuantidade(request.quantidade());
        entidade.setPontoDestino(request.pontoDestino().trim());

        Doacao salvo = doacaoRepository.save(entidade);
        return DoacaoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public void excluir(UUID id) {
        if (!doacaoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Doação não encontrada para o id: " + id);
        }
        doacaoRepository.deleteById(id);
    }

    private Pageable limitarTamanhoPagina(Pageable pageable) {
        if (pageable.isUnpaged()) {
            return PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "criadoEm"));
        }
        int tamanho = Math.min(pageable.getPageSize(), MAX_PAGE_SIZE);
        return PageRequest.of(pageable.getPageNumber(), tamanho, pageable.getSort());
    }
}
