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

    List<Carta> findByHskNivel(Integer hskNivel);
}

