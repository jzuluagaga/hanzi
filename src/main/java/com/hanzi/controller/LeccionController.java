package com.hanzi.controller;

import com.hanzi.dto.CartaDto;
import com.hanzi.dto.LeccionDto;
import com.hanzi.dto.ProximoRepasoDto;
import com.hanzi.dto.RespuestaRequest;
import com.hanzi.repository.UsuarioRepository;
import com.hanzi.service.EstudioService;
import com.hanzi.service.LeccionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LeccionController {

    private final LeccionService leccionService;
    private final EstudioService estudioService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/lecciones")
    public ResponseEntity<List<LeccionDto>> getLecciones() {
        Long usuarioId = getUsuarioId();
        return ResponseEntity.ok(leccionService.getLeccionesConProgreso(usuarioId));
    }

    @GetMapping("/lecciones/{id}/cartas/pendientes")
    public ResponseEntity<List<CartaDto>> getCartasPendientes(@PathVariable Long id) {
        Long usuarioId = getUsuarioId();
        return ResponseEntity.ok(leccionService.getCartasPendientes(id, usuarioId));
    }

    @GetMapping("/lecciones/{id}/cartas")
    public ResponseEntity<List<CartaDto>> getCartasDeLeccion(@PathVariable Long id) {
        Long usuarioId = getUsuarioId();
        return ResponseEntity.ok(leccionService.getCartasDeLeccion(id, usuarioId));
    }

    @GetMapping("/lecciones/{id}/proximo-repaso")
    public ResponseEntity<ProximoRepasoDto> getProximoRepaso(@PathVariable Long id) {
        Long usuarioId = getUsuarioId();
        LocalDate fecha = leccionService.getProximoRepaso(id, usuarioId);
        return ResponseEntity.ok(new ProximoRepasoDto(fecha != null ? fecha.toString() : null));
    }

    @PostMapping("/cartas/{id}/respuesta")
    public ResponseEntity<Void> registrarRespuesta(
            @PathVariable Long id,
            @RequestBody RespuestaRequest request
    ) {
        Long usuarioId = getUsuarioId();
        estudioService.registrarRespuesta(id, usuarioId, request.isRecordo());
        return ResponseEntity.ok().build();
    }

    // Extrae el usuarioId del JWT a través del email almacenado en el SecurityContext
    private Long getUsuarioId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"))
                .getId();
    }
}
