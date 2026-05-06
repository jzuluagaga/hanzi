package com.hanzi.repository;

import com.hanzi.model.CartaEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartaEstadoRepository extends JpaRepository<CartaEstado, Long> {

    Optional<CartaEstado> findByUsuarioIdAndCartaId(Long usuarioId, Long cartaId);

    List<CartaEstado> findByUsuarioIdAndNextReviewDateLessThanEqual(Long usuarioId, LocalDate fecha);

    List<CartaEstado> findByUsuarioIdAndCartaLeccionId(Long usuarioId, Long leccionId);

    int countByUsuarioIdAndCartaLeccionId(Long usuarioId, Long leccionId);

    int countByUsuarioIdAndCartaLeccionIdAndNextReviewDateLessThanEqual(Long usuarioId, Long leccionId, LocalDate fecha);

    boolean existsByUsuarioIdAndCartaLeccionIdAndNextReviewDateLessThan(Long usuarioId, Long leccionId, LocalDate fecha);

    boolean existsByUsuarioIdAndCartaId(Long usuarioId, Long cartaId);

    void deleteByCartaLeccionId(Long leccionId);

    @Query("SELECT COUNT(ce) FROM CartaEstado ce WHERE ce.usuario.id = :usuarioId AND ce.carta.hskNivel = :hskNivel AND ce.carta.categoria = :categoria")
    int countEstudiadasByUsuarioIdAndHskNivelAndCategoria(@Param("usuarioId") Long usuarioId, @Param("hskNivel") Integer hskNivel, @Param("categoria") String categoria);

    @Query("SELECT COUNT(ce) FROM CartaEstado ce WHERE ce.usuario.id = :usuarioId AND ce.carta.hskNivel = :hskNivel AND ce.carta.categoria = :categoria AND ce.nextReviewDate <= :fecha")
    int countPendientesByUsuarioIdAndHskNivelAndCategoriaAndFecha(@Param("usuarioId") Long usuarioId, @Param("hskNivel") Integer hskNivel, @Param("categoria") String categoria, @Param("fecha") LocalDate fecha);

    @Query("SELECT CASE WHEN COUNT(ce) > 0 THEN true ELSE false END FROM CartaEstado ce WHERE ce.usuario.id = :usuarioId AND ce.carta.hskNivel = :hskNivel AND ce.carta.categoria = :categoria AND ce.nextReviewDate < :fecha")
    boolean existsVencidaByUsuarioIdAndHskNivelAndCategoriaAndFecha(@Param("usuarioId") Long usuarioId, @Param("hskNivel") Integer hskNivel, @Param("categoria") String categoria, @Param("fecha") LocalDate fecha);

    @Query("SELECT ce.carta.id FROM CartaEstado ce WHERE ce.usuario.id = :usuarioId AND ce.carta.hskNivel = :hskNivel AND ce.carta.categoria = :categoria AND ce.nextReviewDate <= :fecha")
    List<Long> findCartaIdsPendientesByUsuarioIdAndHskNivelAndCategoria(@Param("usuarioId") Long usuarioId, @Param("hskNivel") Integer hskNivel, @Param("categoria") String categoria, @Param("fecha") LocalDate fecha);

    @Query("SELECT COUNT(ce) FROM CartaEstado ce WHERE ce.usuario.id = :usuarioId")
    long countTotalByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT COUNT(ce) FROM CartaEstado ce WHERE ce.usuario.id = :usuarioId AND ce.updatedAt >= :desde")
    long countByUsuarioIdAndUpdatedAtGreaterThanEqual(@Param("usuarioId") Long usuarioId, @Param("desde") LocalDateTime desde);

    @Query("SELECT COUNT(DISTINCT ce.carta.leccion.id) FROM CartaEstado ce WHERE ce.usuario.id = :usuarioId AND ce.nextReviewDate <= :hoy AND ce.carta.leccion IS NOT NULL")
    int countLeccionesActivasByUsuarioId(@Param("usuarioId") Long usuarioId, @Param("hoy") LocalDate hoy);

    @Query(value = """
            SELECT CAST(updated_at AS DATE) AS fecha, COUNT(*) AS cantidad
            FROM carta_estado
            WHERE usuario_id = :usuarioId AND updated_at >= :desde
            GROUP BY CAST(updated_at AS DATE)
            ORDER BY fecha
            """, nativeQuery = true)
    List<Object[]> findActividadPorDia(@Param("usuarioId") Long usuarioId,
                                       @Param("desde") LocalDateTime desde);

    @Query("SELECT COUNT(DISTINCT ce.carta.categoria) FROM CartaEstado ce WHERE ce.usuario.id = :usuarioId AND ce.carta.tipo = 'HSK'")
    long countCategoriasHskIniciadas(@Param("usuarioId") Long usuarioId);

    int countByUsuarioIdAndCartaLeccionIdAndRecordoFalse(Long usuarioId, Long leccionId);
}

