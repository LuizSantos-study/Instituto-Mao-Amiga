package com.luizsantos.institutomaoamiga.controller;

import java.util.List;
import java.util.UUID;

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

import com.luizsantos.institutomaoamiga.dto.DoacaoRequestDTO;
import com.luizsantos.institutomaoamiga.dto.DoacaoResponseDTO;
import com.luizsantos.institutomaoamiga.service.DoacaoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
public class DoacaoController {

    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    @GetMapping
    public ResponseEntity<List<DoacaoResponseDTO>> listar() {
        return ResponseEntity.ok(doacaoService.listar());
    }

    @GetMapping("/filtro")
    public ResponseEntity<Page<DoacaoResponseDTO>> filtrar(
            @RequestParam(name = "filtro", required = false, defaultValue = "") String filtro,
            @PageableDefault(page = 0, size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(doacaoService.filtrar(filtro, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(doacaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<DoacaoResponseDTO> criar(@Valid @RequestBody DoacaoRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doacaoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody DoacaoRequestDTO request) {
        return ResponseEntity.ok(doacaoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        doacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
