package com.hanzi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeccionDto {
    private Long id;
    private String nombre;
    private int orden;
    private int totalCartas;
    private int cartasEstudiadas;
    private int cartasPendientesHoy;
    private String healthStatus; // "NUEVA" | "VERDE" | "AMARILLO" | "ROJO"
}
