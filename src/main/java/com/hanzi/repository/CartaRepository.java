package com.hanzi.repository;

import com.hanzi.model.Carta;
import com.hanzi.model.Leccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartaRepository extends JpaRepository<Carta, Long> {

    List<Carta> findByLeccion(Leccion leccion);

    List<Carta> findByLeccionId(Long leccionId);

    Optional<Carta> findByHanziAndLeccionId(String hanzi, Long leccionId);

    Optional<Carta> findByHanziAndHskNivel(String hanzi, Integer hskNivel);

    List<Carta> findByHskNivel(Integer hskNivel);

    List<Carta> findByHskNivelAndTipoOrderByIdAsc(Integer hskNivel, String tipo);

    List<Carta> findByHskNivelAndTipoAndCategoriaOrderByIdAsc(Integer hskNivel, String tipo, String categoria);

    int countByLeccionId(Long leccionId);

    int countByHskNivelAndTipoAndCategoria(Integer hskNivel, String tipo, String categoria);

    List<Carta> findByLeccionIdOrderByIdAsc(Long leccionId);

    void deleteByLeccionId(Long leccionId);
}
