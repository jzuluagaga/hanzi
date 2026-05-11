package com.hanzi.controller;

import com.hanzi.dto.QuizDto;
import com.hanzi.repository.UsuarioRepository;
import com.hanzi.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/lecciones/{id}/quiz")
    public ResponseEntity<QuizDto> getQuiz(
            @PathVariable Long id,
            @RequestParam(defaultValue = "20") int size
    ) {
        int sizeClamped = Math.max(5, Math.min(size, 50));
        Long usuarioId = getUsuarioId();
        return ResponseEntity.ok(quizService.generarQuiz(id, usuarioId, sizeClamped));
    }

    private Long getUsuarioId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"))
                .getId();
    }
}
