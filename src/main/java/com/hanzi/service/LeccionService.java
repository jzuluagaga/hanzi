package com.hanzi.service;

import com.hanzi.dto.CartaDto;
import com.hanzi.dto.LeccionDto;
import com.hanzi.model.Leccion;
import com.hanzi.repository.CartaEstadoRepository;
import com.hanzi.repository.CartaRepository;
import com.hanzi.repository.LeccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeccionService {

    private final LeccionRepository leccionRepository;
    private final CartaRepository cartaRepository;
    private final CartaEstadoRepository cartaEstadoRepository;

    public List<LeccionDto> getLeccionesConProgreso(Long usuarioId) {
        List<Leccion> lecciones = leccionRepository.findAllByOrderByOrdenAsc();
        LocalDate hoy = LocalDate.now();

        return lecciones.stream().map(leccion -> {
            int totalCartas       = cartaRepository.countByLeccionId(leccion.getId());
            int cartasEstudiadas  = cartaEstadoRepository.countByUsuarioIdAndCartaLeccionId(usuarioId, leccion.getId());
            int cartasPendientes  = cartaEstadoRepository
                    .countByUsuarioIdAndCartaLeccionIdAndNextReviewDateLessThanEqual(usuarioId, leccion.getId(), hoy);
            int cartasFalladas    = cartaEstadoRepository
                    .countByUsuarioIdAndCartaLeccionIdAndRecordoFalse(usuarioId, leccion.getId());

            String healthStatus;
            if (cartasEstudiadas == totalCartas && cartasPendientes == 0) {
                healthStatus = "VERDE";
            } else if (cartasFalladas > cartasEstudiadas * 0.5) {
                healthStatus = "ROJO";
            } else {
                healthStatus = "AMARILLO";
            }

            return LeccionDto.builder()
                    .id(leccion.getId())
                    .nombre(leccion.getNombre())
                    .orden(leccion.getOrden())
                    .totalCartas(totalCartas)
                    .cartasEstudiadas(cartasEstudiadas)
                    .cartasFalladas(cartasFalladas)
                    .cartasPendientesHoy(cartasPendientes)
                    .healthStatus(healthStatus)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<CartaDto> getCartasPendientes(Long leccionId, Long usuarioId) {
        LocalDate hoy = LocalDate.now();
        return cartaRepository.findByLeccionIdOrderByIdAsc(leccionId).stream()
                .filter(carta -> {
                    var estado = cartaEstadoRepository.findByUsuarioIdAndCartaId(usuarioId, carta.getId());
                    // incluir si es primera vez O si nextReviewDate <= hoy
                    return estado.isEmpty() || !estado.get().getNextReviewDate().isAfter(hoy);
                })
                .map(carta -> CartaDto.builder()
                        .id(carta.getId())
                        .hanzi(carta.getHanzi())
                        .pinyin(carta.getPinyin())
                        .traduccion(carta.getTraduccion())
                        .esPrimeraVez(!cartaEstadoRepository.existsByUsuarioIdAndCartaId(usuarioId, carta.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteLeccion(Long id) {
        if (!leccionRepository.existsById(id)) {
            throw new IllegalArgumentException("Lección no encontrada con id: " + id);
        }
        cartaEstadoRepository.deleteByCartaLeccionId(id);
        cartaRepository.deleteByLeccionId(id);
        leccionRepository.deleteById(id);
    }

    public List<CartaDto> getCartasDeLeccion(Long leccionId, Long usuarioId) {
        return cartaRepository.findByLeccionIdOrderByIdAsc(leccionId).stream()
                .map(carta -> CartaDto.builder()
                        .id(carta.getId())
                        .hanzi(carta.getHanzi())
                        .pinyin(carta.getPinyin())
                        .traduccion(carta.getTraduccion())
                        .esPrimeraVez(!cartaEstadoRepository.existsByUsuarioIdAndCartaId(usuarioId, carta.getId()))
                        .build())
                .collect(Collectors.toList());
    }
}
