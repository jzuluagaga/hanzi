package com.hanzi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistroEscrituraDto {
    @NotNull
    private String modo;               // "FACIL" o "DIFICIL"

    @NotNull
    @Min(0)
    private Integer trazosCorrectos;

    @NotNull
    @Min(0)
    private Integer trazosFallados;

    @NotNull
    private Boolean completadoSinErrores;
}
