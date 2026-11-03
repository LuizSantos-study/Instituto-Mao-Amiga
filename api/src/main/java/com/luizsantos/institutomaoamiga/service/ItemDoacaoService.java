package com.luizsantos.institutomaoamiga.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.luizsantos.institutomaoamiga.dto.ItemDoacaoRequest;
import com.luizsantos.institutomaoamiga.dto.ItemDoacaoResponse;
import com.luizsantos.institutomaoamiga.model.ItemDoacao;
import com.luizsantos.institutomaoamiga.repository.ItemDoacaoRespository;

@Service
@Transactional(readOnly = true)
public class ItemDoacaoService {

    private static final int MAX_PAGE_SIZE = 50;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm");

    private final ItemDoacaoRespository itemDoacaoRepository;

    public ItemDoacaoService(ItemDoacaoRespository itemDoacaoRepository) {
        this.itemDoacaoRepository = itemDoacaoRepository;
    }

    public Page<ItemDoacaoResponse> listar(Pageable pageable) {
        Pageable pageableSeguro = limitarTamanhoPagina(pageable);
        return itemDoacaoRepository.findAll(pageableSeguro).map(ItemDoacaoResponse::fromEntity);
    }

    public Page<ItemDoacaoResponse> filtrar(String tipoItem, Pageable pageable) {
        Pageable pageableSeguro = limitarTamanhoPagina(pageable);
        String termo = (tipoItem == null) ? "" : tipoItem.trim();
        return itemDoacaoRepository.findByTipoItemContainingIgnoreCase(termo, pageableSeguro)
                .map(ItemDoacaoResponse::fromEntity);
    }

    public ItemDoacaoResponse buscarPorId(Long id) {
        return itemDoacaoRepository.findById(id)
                .map(ItemDoacaoResponse::fromEntity)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Doacao nao encontrada para o id: " + id));
    }

    @Transactional
    public ItemDoacaoResponse criar(ItemDoacaoRequest request) {
        validarRequest(request);
        String criadoEm = (request.criadoEm() != null && !request.criadoEm().isBlank())
                ? request.criadoEm().trim()
                : LocalDateTime.now().format(FORMATTER);

        ItemDoacao entidade = new ItemDoacao(
                request.tipoItem().trim(),
                request.quantidade(),
                request.pontoDestino().trim(),
                request.pontoID(),
                criadoEm);

        ItemDoacao salvo = itemDoacaoRepository.save(entidade);
        return ItemDoacaoResponse.fromEntity(salvo);
    }

    @Transactional
    public ItemDoacaoResponse atualizar(Long id, ItemDoacaoRequest request) {
        validarRequest(request);
        ItemDoacao entidade = itemDoacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Doacao nao encontrada para o id: " + id));

        entidade.setTipoItem(request.tipoItem().trim());
        entidade.setQuantidade(request.quantidade());
        entidade.setPontoDestino(request.pontoDestino().trim());
        entidade.setPontoID(request.pontoID());
        if (request.criadoEm() != null && !request.criadoEm().isBlank()) {
            entidade.setCriadoEm(request.criadoEm().trim());
        }

        ItemDoacao salvo = itemDoacaoRepository.save(entidade);
        return ItemDoacaoResponse.fromEntity(salvo);
    }

    @Transactional
    public void excluir(Long id) {
        if (!itemDoacaoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Doacao nao encontrada para o id: " + id);
        }
        itemDoacaoRepository.deleteById(id);
    }

    private void validarRequest(ItemDoacaoRequest request) {
        if (request == null
                || request.tipoItem() == null || request.tipoItem().isBlank()
                || request.quantidade() == null || request.quantidade() <= 0
                || request.pontoDestino() == null || request.pontoDestino().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dados invalidos para a doacao.");
        }
    }

    private Pageable limitarTamanhoPagina(Pageable pageable) {
        if (pageable.isUnpaged()) {
            return PageRequest.of(0, 20);
        }
        int tamanho = Math.min(pageable.getPageSize(), MAX_PAGE_SIZE);
        return PageRequest.of(pageable.getPageNumber(), tamanho, pageable.getSort());
    }
}
