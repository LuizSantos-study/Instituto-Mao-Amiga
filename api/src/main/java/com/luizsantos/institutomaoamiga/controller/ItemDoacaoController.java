package com.luizsantos.institutomaoamiga.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.luizsantos.institutomaoamiga.dto.ItemDoacaoRequest;
import com.luizsantos.institutomaoamiga.dto.ItemDoacaoResponse;
import com.luizsantos.institutomaoamiga.service.ItemDoacaoService;

@RestController
@RequestMapping("/doacoes")
@CrossOrigin(origins = "*")
public class ItemDoacaoController {

    private final ItemDoacaoService itemDoacaoService;

    public ItemDoacaoController(ItemDoacaoService itemDoacaoService) {
        this.itemDoacaoService = itemDoacaoService;
    }

    @GetMapping
    public ResponseEntity<Page<ItemDoacaoResponse>> listar(
            @PageableDefault(page = 0, size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(itemDoacaoService.listar(pageable));
    }

    @GetMapping("/filtro")
    public ResponseEntity<Page<ItemDoacaoResponse>> filtrar(
            @RequestParam(required = false, defaultValue = "") String tipoItem,
            @PageableDefault(page = 0, size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(itemDoacaoService.filtrar(tipoItem, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDoacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(itemDoacaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ItemDoacaoResponse> criar(@RequestBody ItemDoacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemDoacaoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemDoacaoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody ItemDoacaoRequest request) {
        return ResponseEntity.ok(itemDoacaoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        itemDoacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
