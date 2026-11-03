package com.luizsantos.institutomaoamiga.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.luizsantos.institutomaoamiga.model.ItemDoacao;

@Repository
public interface ItemDoacaoRespository extends JpaRepository<ItemDoacao, Long> {

    Page<ItemDoacao> findByTipoItemContainingIgnoreCase(String tipoItem, Pageable pageable);
}
