package com.hanzi.service;

import com.hanzi.dto.CartaDto;
import com.hanzi.dto.RegistroEscrituraDto;
import com.hanzi.model.CartaEscrituraEstado;
import com.hanzi.repository.CartaEscrituraEstadoRepository;
import com.hanzi.repository.CartaRepository;
import com.hanzi.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EscrituraService {

    private final CartaEscrituraEstadoRepository escrituraRepository;
    private final CartaRepository cartaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public void registrarEscritura(Long usuarioId, Long cartaId, RegistroEscrituraDto dto) {
        if (!"FACIL".equals(dto.getModo()) && !"DIFICIL".equals(dto.getModo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Modo inválido");
        }

        var usuario = usuarioRepository.getReferenceById(usuarioId);
        var carta   = cartaRepository.findById(cartaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carta no encontrada"));

        CartaEscrituraEstado estado = escrituraRepository
                .findByUsuarioAndCarta(usuario, carta)
                .orElseGet(() -> {
                    CartaEscrituraEstado nuevo = new CartaEscrituraEstado();
                    nuevo.setUsuario(usuario);
                    nuevo.setCarta(carta);
                    nuevo.setVecesCompletadoFacil(0);
                    nuevo.setVecesCompletadoDificil(0);
                    nuevo.setTrazosCorrectosTotal(0);
                    nuevo.setTrazosFalladosTotal(0);
                    return nuevo;
                });

        estado.setTrazosCorrectosTotal(estado.getTrazosCorrectosTotal() + dto.getTrazosCorrectos());
        estado.setTrazosFalladosTotal(estado.getTrazosFalladosTotal() + dto.getTrazosFallados());

        if (Boolean.TRUE.equals(dto.getCompletadoSinErrores())) {
            if ("DIFICIL".equalsIgnoreCase(dto.getModo())) {
                estado.setVecesCompletadoDificil(estado.getVecesCompletadoDificil() + 1);
            } else {
                estado.setVecesCompletadoFacil(estado.getVecesCompletadoFacil() + 1);
            }
        }

        estado.setUltimaEscrituraAt(LocalDateTime.now());
        escrituraRepository.save(estado);
    }

    @Transactional(readOnly = true)
    public List<CartaDto> getCartasParaEscritura(Long leccionId) {
        return cartaRepository.findByLeccionIdOrderByIdAsc(leccionId).stream()
                .filter(carta -> {
                    int len = carta.getHanzi().codePointCount(0, carta.getHanzi().length());
                    return len >= 1 && len <= 2;
                })
                .map(carta -> CartaDto.builder()
                        .id(carta.getId())
                        .hanzi(carta.getHanzi())
                        .pinyin(carta.getPinyin())
                        .traduccion(carta.getTraduccion())
                        .esPrimeraVez(false)
                        .build())
                .collect(Collectors.toList());
    }
}
