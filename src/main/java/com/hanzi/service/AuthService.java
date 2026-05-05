package com.hanzi.service;

import com.hanzi.dto.AuthResponse;
import com.hanzi.dto.LoginRequest;
import com.hanzi.dto.NewPasswordRequest;
import com.hanzi.dto.RegisterRequest;
import com.hanzi.model.Usuario;
import com.hanzi.model.enums.Provider;
import com.hanzi.model.enums.Rol;
import com.hanzi.repository.UsuarioRepository;
import com.hanzi.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Ya existe una cuenta con ese email");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setEmail(request.email());
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setProvider(Provider.LOCAL);
        usuario.setRol(Rol.USER);

        usuarioRepository.save(usuario);

        return buildAuthResponse(usuario, jwtUtil.generateToken(usuario.getEmail()));
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.password(), usuario.getPasswordHash())) {
            throw new IllegalArgumentException("Email o contraseña incorrectos");
        }

        return buildAuthResponse(usuario, jwtUtil.generateToken(usuario.getEmail()));
    }

    public void requestPasswordReset(String email) {
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            String token = UUID.randomUUID().toString();
            usuario.setResetToken(token);
            usuario.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
            usuarioRepository.save(usuario);
            emailService.sendPasswordResetEmail(email, token);
        });
    }

    public void resetPassword(NewPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByResetToken(request.token())
                .orElseThrow(() -> new IllegalArgumentException("Token inválido o expirado"));

        if (usuario.getResetTokenExpiry() == null
                || usuario.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token inválido o expirado");
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        usuario.setResetToken(null);
        usuario.setResetTokenExpiry(null);
        usuarioRepository.save(usuario);
    }

    public AuthResponse actualizarNombre(String email, String nuevoNombre) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setNombre(nuevoNombre);
        usuarioRepository.save(usuario);
        return buildAuthResponse(usuario, jwtUtil.generateToken(email));
    }

    public void cambiarPassword(String email, String passwordActual, String passwordNueva) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!passwordEncoder.matches(passwordActual, usuario.getPasswordHash())) {
            throw new IllegalArgumentException("Contraseña actual incorrecta");
        }
        usuario.setPasswordHash(passwordEncoder.encode(passwordNueva));
        usuarioRepository.save(usuario);
    }

    private AuthResponse buildAuthResponse(Usuario usuario, String token) {
        return AuthResponse.builder()
                .token(token)
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .fotoUrl(usuario.getFotoUrl())
                .rol(usuario.getRol().name())
                .build();
    }
}
