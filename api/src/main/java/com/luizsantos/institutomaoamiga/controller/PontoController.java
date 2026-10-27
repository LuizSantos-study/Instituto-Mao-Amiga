package com.luizsantos.institutomaoamiga.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luizsantos.institutomaoamiga.dto.PontoResponse;
import com.luizsantos.institutomaoamiga.service.PontoService;

@RestController
@RequestMapping("/pontos")
@CrossOrigin(origins = "*")
public class PontoController {

    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    public ResponseEntity<Page<PontoResponse>> listar(
            @PageableDefault(page = 0, size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(pontoService.listar(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PontoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pontoService.buscarPorId(id));
    }
}
