package com.hanzi.dto;

import java.util.List;

public record UserStatsDto(
        long totalPalabras,
        long palabrasEstaSemana,
        int leccionesActivas,
        List<ActividadDiaDto> actividadPorDia,
        long categoriasHskIniciadas
) {}
