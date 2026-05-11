package com.hanzi.controller;

import com.hanzi.dto.CartaDto;
import com.hanzi.dto.RegistroEscrituraDto;
import com.hanzi.repository.UsuarioRepository;
import com.hanzi.service.EscrituraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EscrituraController {

    private final EscrituraService escrituraService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/lecciones/{leccionId}/escritura/cartas")
    public ResponseEntity<List<CartaDto>> getCartasParaEscritura(@PathVariable Long leccionId) {
        return ResponseEntity.ok(escrituraService.getCartasParaEscritura(leccionId));
    }

    @PostMapping("/cartas/{cartaId}/escritura")
    public ResponseEntity<Void> registrarEscritura(
            @PathVariable Long cartaId,
            @Valid @RequestBody RegistroEscrituraDto dto
    ) {
        Long usuarioId = getUsuarioId();
        escrituraService.registrarEscritura(usuarioId, cartaId, dto);
        return ResponseEntity.ok().build();
    }

    private Long getUsuarioId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"))
                .getId();
    }
}
