package com.hanzi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartaDto {
    private Long id;
    private String hanzi;
    private String pinyin;
    private String traduccion;
    private boolean esPrimeraVez;
}
