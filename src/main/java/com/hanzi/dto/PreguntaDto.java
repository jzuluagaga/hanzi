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
public class PreguntaDto {
    private Long cartaId;
    private String tipo;          // "HANZI_TO_TRANSLATION" | "TRANSLATION_TO_HANZI" | "HANZI_TO_PINYIN"
    private String prompt;
    private String correctAnswer;
    private List<String> opciones; // 4 opciones ya mezcladas, incluye la correcta
}
