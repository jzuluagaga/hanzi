package com.hanzi.service;

import com.hanzi.dto.PreguntaDto;
import com.hanzi.dto.QuizDto;
import com.hanzi.model.Carta;
import com.hanzi.model.CartaEstado;
import com.hanzi.repository.CartaEstadoRepository;
import com.hanzi.repository.CartaRepository;
import com.hanzi.repository.LeccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuizService {

    private static final String[] TIPOS = {
        "HANZI_TO_TRANSLATION", "TRANSLATION_TO_HANZI", "HANZI_TO_PINYIN"
    };

    private final CartaRepository cartaRepository;
    private final CartaEstadoRepository cartaEstadoRepository;
    private final LeccionRepository leccionRepository;

    public QuizDto generarQuiz(Long leccionId, Long usuarioId, int size) {
        List<Carta> allCartas = cartaRepository.findByLeccionIdOrderByIdAsc(leccionId);

        if (allCartas.size() < 4) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "La lección necesita al menos 4 cartas para generar un quiz");
        }

        String leccionNombre = leccionRepository.findById(leccionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lección no encontrada"))
                .getNombre();

        List<CartaEstado> estadoList = cartaEstadoRepository
                .findByUsuarioIdAndCartaLeccionId(usuarioId, leccionId);

        List<Carta> sampled = sample(allCartas, estadoList, size);

        Random rnd = new Random();
        List<PreguntaDto> preguntas = sampled.stream()
                .map(carta -> buildPregunta(carta, allCartas, rnd))
                .collect(Collectors.toList());

        Collections.shuffle(preguntas);

        return QuizDto.builder()
                .leccionNombre(leccionNombre)
                .totalPreguntas(preguntas.size())
                .preguntas(preguntas)
                .build();
    }

    private List<Carta> sample(List<Carta> allCartas, List<CartaEstado> estadoList, int size) {
        int targetSize = Math.min(size, allCartas.size());

        if (estadoList.isEmpty()) {
            List<Carta> shuffled = new ArrayList<>(allCartas);
            Collections.shuffle(shuffled);
            return shuffled.subList(0, targetSize);
        }

        Map<Long, CartaEstado> estadoMap = estadoList.stream()
                .collect(Collectors.toMap(ce -> ce.getCarta().getId(), ce -> ce));

        // Cards with history sorted by stability ascending (harder first)
        List<Carta> conHistorial = allCartas.stream()
                .filter(c -> estadoMap.containsKey(c.getId()))
                .sorted(Comparator.comparingDouble(c -> estadoMap.get(c.getId()).getStability()))
                .collect(Collectors.toList());

        List<Carta> sinHistorial = new ArrayList<>(allCartas.stream()
                .filter(c -> !estadoMap.containsKey(c.getId()))
                .toList());

        int hardCount = (int) Math.ceil(targetSize * 0.7);
        int hardActual = Math.min(hardCount, conHistorial.size());

        List<Carta> sampled = new ArrayList<>(conHistorial.subList(0, hardActual));

        // Fill remaining with random from sinHistorial + leftover conHistorial
        List<Carta> pool = new ArrayList<>();
        pool.addAll(sinHistorial);
        pool.addAll(conHistorial.subList(hardActual, conHistorial.size()));
        Collections.shuffle(pool);

        int remaining = targetSize - hardActual;
        sampled.addAll(pool.subList(0, Math.min(remaining, pool.size())));

        return sampled;
    }

    private PreguntaDto buildPregunta(Carta carta, List<Carta> allCartas, Random rnd) {
        String tipo = TIPOS[rnd.nextInt(TIPOS.length)];

        String prompt;
        String correctAnswer;
        switch (tipo) {
            case "HANZI_TO_TRANSLATION" -> {
                prompt = carta.getHanzi();
                correctAnswer = carta.getTraduccion();
            }
            case "TRANSLATION_TO_HANZI" -> {
                prompt = carta.getTraduccion();
                correctAnswer = carta.getHanzi();
            }
            default -> {
                prompt = carta.getHanzi();
                correctAnswer = carta.getPinyin();
            }
        }

        List<String> opciones = buildOpciones(carta, allCartas, tipo, correctAnswer, rnd);

        return PreguntaDto.builder()
                .cartaId(carta.getId())
                .tipo(tipo)
                .prompt(prompt)
                .correctAnswer(correctAnswer)
                .opciones(opciones)
                .build();
    }

    private List<String> buildOpciones(Carta carta, List<Carta> allCartas, String tipo,
                                        String correctAnswer, Random rnd) {
        String cartaClass = clasificar(carta.getHanzi());

        List<Carta> mismoTipo = allCartas.stream()
                .filter(c -> !c.getId().equals(carta.getId()) && clasificar(c.getHanzi()).equals(cartaClass))
                .collect(Collectors.toList());

        List<Carta> distractorPool;
        if (mismoTipo.size() >= 3) {
            distractorPool = new ArrayList<>(mismoTipo);
        } else {
            distractorPool = allCartas.stream()
                    .filter(c -> !c.getId().equals(carta.getId()))
                    .collect(Collectors.toList());
        }

        Collections.shuffle(distractorPool);

        // Pick up to 3 distinct distractors that differ from the correct answer
        List<String> distractors = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        seen.add(correctAnswer);
        for (Carta c : distractorPool) {
            if (distractors.size() == 3) break;
            String ans = getAnswer(c, tipo);
            if (seen.add(ans)) {
                distractors.add(ans);
            }
        }

        // If still fewer than 3, draw from the full pool
        if (distractors.size() < 3) {
            List<Carta> fallback = new ArrayList<>(allCartas.stream()
                    .filter(c -> !c.getId().equals(carta.getId()))
                    .toList());
            Collections.shuffle(fallback);
            for (Carta c : fallback) {
                if (distractors.size() == 3) break;
                String ans = getAnswer(c, tipo);
                if (seen.add(ans)) {
                    distractors.add(ans);
                }
            }
        }

        List<String> opciones = new ArrayList<>(distractors);
        opciones.add(correctAnswer);
        Collections.shuffle(opciones);
        return opciones;
    }

    private String clasificar(String hanzi) {
        int len = hanzi.length();
        if (len == 1) return "CARACTER";
        if (len <= 4) return "PALABRA";
        return "FRASE";
    }

    private String getAnswer(Carta c, String tipo) {
        return switch (tipo) {
            case "HANZI_TO_TRANSLATION" -> c.getTraduccion();
            case "TRANSLATION_TO_HANZI" -> c.getHanzi();
            default -> c.getPinyin();
        };
    }
}
