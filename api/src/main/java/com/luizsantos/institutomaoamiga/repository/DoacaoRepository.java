package com.luizsantos.institutomaoamiga.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.luizsantos.institutomaoamiga.entity.Doacao;

@Repository
public interface DoacaoRepository extends JpaRepository<Doacao, UUID> {

    @Query("""
            SELECT d FROM Doacao d
            WHERE :filtro IS NULL OR :filtro = ''
               OR LOWER(d.tipoItem) LIKE LOWER(CONCAT('%', :filtro, '%'))
            """)
    Page<Doacao> buscarPorFiltro(@Param("filtro") String filtro, Pageable pageable);
}
