package com.hanzi.repository;

import com.hanzi.model.Leccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeccionRepository extends JpaRepository<Leccion, Long> {

    List<Leccion> findAllByOrderByOrdenAsc();

    Optional<Leccion> findByNombre(String nombre);

    Optional<Leccion> findTopByOrderByOrdenDesc();
}

