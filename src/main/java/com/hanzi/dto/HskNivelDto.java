package com.hanzi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HskNivelDto {
    private int nivel;
    private int totalCartas;
    private List<HskCategoriaDto> categorias;
}
