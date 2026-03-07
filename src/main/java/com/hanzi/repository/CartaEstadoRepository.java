package com.hanzi.repository;

import com.hanzi.model.CartaEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartaEstadoRepository extends JpaRepository<CartaEstado, Long> {

    Optional<CartaEstado> findByUsuarioIdAndCartaId(Long usuarioId, Long cartaId);

    List<CartaEstado> findByUsuarioIdAndNextReviewDateLessThanEqual(Long usuarioId, LocalDate fecha);

    List<CartaEstado> findByUsuarioIdAndCartaLeccionId(Long usuarioId, Long leccionId);
}

