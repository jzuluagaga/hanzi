package com.hanzi.controller;

import com.hanzi.dto.CartaDto;
import com.hanzi.dto.HskCategoriaEstadoDto;
import com.hanzi.dto.HskNivelDto;
import com.hanzi.repository.UsuarioRepository;
import com.hanzi.service.EstudioService;
import com.hanzi.service.HskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hsk")
@RequiredArgsConstructor
public class HskController {

    private final HskService hskService;
    private final EstudioService estudioService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/{nivel}")
    public ResponseEntity<HskNivelDto> getHskNivel(@PathVariable int nivel) {
        Long usuarioId = getUsuarioId();
        return ResponseEntity.ok(hskService.getHskNivel(nivel, usuarioId));
    }

    @GetMapping("/{nivel}/categorias/{categoria}/cartas")
    public ResponseEntity<List<CartaDto>> getCartasDeCategoria(
            @PathVariable int nivel,
            @PathVariable String categoria) {
        Long usuarioId = getUsuarioId();
        return ResponseEntity.ok(hskService.getCartasDeCategoria(nivel, categoria, usuarioId));
    }

    @GetMapping("/{nivel}/categorias/{categoria}/cartas/pendientes")
    public ResponseEntity<List<CartaDto>> getCartasHskPendientes(
            @PathVariable int nivel,
            @PathVariable String categoria) {
        Long usuarioId = getUsuarioId();
        return ResponseEntity.ok(hskService.getCartasHskPendientes(nivel, categoria, usuarioId));
    }

    @GetMapping("/{nivel}/categorias/{categoria}/estado")
    public ResponseEntity<HskCategoriaEstadoDto> getCategoriaEstado(
            @PathVariable int nivel,
            @PathVariable String categoria) {
        Long usuarioId = getUsuarioId();
        return ResponseEntity.ok(estudioService.getHskCategoriaEstado(usuarioId, nivel, categoria));
    }

    private Long getUsuarioId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
                .getId();
    }
}
