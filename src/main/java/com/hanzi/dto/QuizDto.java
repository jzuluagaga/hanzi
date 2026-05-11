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
public class QuizDto {
    private String leccionNombre;
    private int totalPreguntas;
    private List<PreguntaDto> preguntas;
}
