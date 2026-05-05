package com.hanzi.controller;

import com.hanzi.dto.ActualizarNombreRequest;
import com.hanzi.dto.AuthResponse;
import com.hanzi.dto.CambiarPasswordRequest;
import com.hanzi.dto.UserStatsDto;
import com.hanzi.repository.UsuarioRepository;
import com.hanzi.service.AuthService;
import com.hanzi.service.EstudioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final AuthService authService;
    private final EstudioService estudioService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/stats")
    public ResponseEntity<UserStatsDto> getStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long usuarioId = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"))
                .getId();
        return ResponseEntity.ok(estudioService.getUserStats(usuarioId));
    }

    @PutMapping("/nombre")
    public ResponseEntity<?> actualizarNombre(@RequestBody ActualizarNombreRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        AuthResponse response = authService.actualizarNombre(email, request.nombre());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<?> cambiarPassword(@RequestBody CambiarPasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            authService.cambiarPassword(email, request.passwordActual(), request.passwordNueva());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }
}
