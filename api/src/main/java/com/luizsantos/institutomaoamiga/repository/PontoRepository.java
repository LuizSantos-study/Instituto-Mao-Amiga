package com.luizsantos.institutomaoamiga.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.luizsantos.institutomaoamiga.model.Ponto;

@Repository
public interface PontoRepository extends JpaRepository<Ponto, Long> {
}
