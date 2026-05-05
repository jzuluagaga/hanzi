package com.hanzi.service;

import com.hanzi.dto.ActividadDiaDto;
import com.hanzi.dto.HskCategoriaEstadoDto;
import com.hanzi.dto.UserStatsDto;
import com.hanzi.model.CartaEstado;
import com.hanzi.repository.CartaEstadoRepository;
import com.hanzi.repository.CartaRepository;
import com.hanzi.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstudioService {

    private final CartaEstadoRepository cartaEstadoRepository;
    private final CartaRepository cartaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public CartaEstado registrarRespuesta(Long cartaId, Long usuarioId, boolean recordo) {
        CartaEstado estado = cartaEstadoRepository
                .findByUsuarioIdAndCartaId(usuarioId, cartaId)
                .orElseGet(() -> {
                    CartaEstado nuevo = new CartaEstado();
                    nuevo.setCarta(cartaRepository.getReferenceById(cartaId));
                    nuevo.setUsuario(usuarioRepository.getReferenceById(usuarioId));
                    nuevo.setStability(1.0);
                    nuevo.setRetrievability(1.0);
                    nuevo.setDifficulty(0.3);
                    return nuevo;
                });

        // FSRS simplificado
        if (recordo) {
            estado.setStability(estado.getStability() * 2.0);
            estado.setNextReviewDate(LocalDate.now().plusDays((long) estado.getStability()));
        } else {
            estado.setStability(Math.max(1.0, estado.getStability() * 0.5));
            estado.setNextReviewDate(LocalDate.now());
        }
        estado.setRetrievability(recordo ? 0.9 : 0.3);
        estado.setRecordo(recordo);
        // updatedAt lo gestiona @PrePersist / @PreUpdate de la entidad

        return cartaEstadoRepository.save(estado);
    }

    @Transactional(readOnly = true)
    public UserStatsDto getUserStats(Long usuarioId) {
        LocalDateTime ahora = LocalDateTime.now();
        long total   = cartaEstadoRepository.countTotalByUsuarioId(usuarioId);
        long semana  = cartaEstadoRepository.countByUsuarioIdAndUpdatedAtGreaterThanEqual(
                           usuarioId, ahora.minusDays(7));
        int activas  = cartaEstadoRepository.countLeccionesActivasByUsuarioId(usuarioId, LocalDate.now());
        List<ActividadDiaDto> actividad = cartaEstadoRepository
                .findActividadPorDia(usuarioId, ahora.minusDays(90))
                .stream()
                .map(row -> new ActividadDiaDto(row[0].toString(), ((Number) row[1]).longValue()))
                .collect(Collectors.toList());
        long categoriasHsk = cartaEstadoRepository.countCategoriasHskIniciadas(usuarioId);
        return new UserStatsDto(total, semana, activas, actividad, categoriasHsk);
    }

    @Transactional(readOnly = true)
    public HskCategoriaEstadoDto getHskCategoriaEstado(Long usuarioId, int nivel, String categoria) {
        int totalCartas      = cartaRepository.countByHskNivelAndTipoAndCategoria(nivel, "HSK", categoria);
        LocalDate hoy        = LocalDate.now();
        int cartasEstudiadas = cartaEstadoRepository.countEstudiadasByUsuarioIdAndHskNivelAndCategoria(usuarioId, nivel, categoria);
        int cartasPendientes = cartaEstadoRepository.countPendientesByUsuarioIdAndHskNivelAndCategoriaAndFecha(usuarioId, nivel, categoria, hoy);

        String healthStatus;
        if (cartasEstudiadas == 0) {
            healthStatus = "NUEVA";
        } else if (cartasPendientes == 0) {
            healthStatus = "VERDE";
        } else if (cartaEstadoRepository.existsVencidaByUsuarioIdAndHskNivelAndCategoriaAndFecha(usuarioId, nivel, categoria, hoy)) {
            healthStatus = "ROJO";
        } else {
            healthStatus = "AMARILLO";
        }

        return HskCategoriaEstadoDto.builder()
                .totalCartas(totalCartas)
                .cartasPendientes(cartasPendientes)
                .healthStatus(healthStatus)
                .build();
    }
}
