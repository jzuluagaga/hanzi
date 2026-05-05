package com.hanzi.service;

import com.hanzi.dto.CartaDto;
import com.hanzi.dto.HskCategoriaDto;
import com.hanzi.dto.HskNivelDto;
import com.hanzi.repository.CartaEstadoRepository;
import com.hanzi.repository.CartaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HskService {

    private final CartaRepository cartaRepository;
    private final CartaEstadoRepository cartaEstadoRepository;

    public HskNivelDto getHskNivel(int nivel, Long usuarioId) {
        var cartas = cartaRepository.findByHskNivelAndTipoOrderByIdAsc(nivel, "HSK");

        Map<String, List<CartaDto>> porCategoria = cartas.stream()
                .collect(Collectors.groupingBy(
                        carta -> carta.getCategoria() != null ? carta.getCategoria() : "Sin categoría",
                        Collectors.mapping(
                                carta -> CartaDto.builder()
                                        .id(carta.getId())
                                        .hanzi(carta.getHanzi())
                                        .pinyin(carta.getPinyin())
                                        .traduccion(carta.getTraduccion())
                                        .esPrimeraVez(!cartaEstadoRepository.existsByUsuarioIdAndCartaId(usuarioId, carta.getId()))
                                        .build(),
                                Collectors.toList()
                        )
                ));

        List<HskCategoriaDto> categorias = porCategoria.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> HskCategoriaDto.builder()
                        .categoria(entry.getKey())
                        .totalCartas(entry.getValue().size())
                        .cartas(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        return HskNivelDto.builder()
                .nivel(nivel)
                .totalCartas(cartas.size())
                .categorias(categorias)
                .build();
    }

    public List<CartaDto> getCartasHskPendientes(int nivel, String categoria, Long usuarioId) {
        Set<Long> pendientes = new HashSet<>(
                cartaEstadoRepository.findCartaIdsPendientesByUsuarioIdAndHskNivelAndCategoria(
                        usuarioId, nivel, categoria, LocalDate.now()
                )
        );
        return cartaRepository
                .findByHskNivelAndTipoAndCategoriaOrderByIdAsc(nivel, "HSK", categoria)
                .stream()
                .filter(carta -> pendientes.contains(carta.getId()))
                .map(carta -> CartaDto.builder()
                        .id(carta.getId())
                        .hanzi(carta.getHanzi())
                        .pinyin(carta.getPinyin())
                        .traduccion(carta.getTraduccion())
                        .esPrimeraVez(false)
                        .build())
                .collect(Collectors.toList());
    }

    public List<CartaDto> getCartasDeCategoria(int nivel, String categoria, Long usuarioId) {
        return cartaRepository
                .findByHskNivelAndTipoAndCategoriaOrderByIdAsc(nivel, "HSK", categoria)
                .stream()
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
