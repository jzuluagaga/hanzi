package com.hanzi.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    private final Resend resend;
    private final String baseUrl;

    public EmailService(
            @Value("${resend.api-key}") String apiKey,
            @Value("${app.base-url}") String baseUrl) {
        this.resend = new Resend(apiKey);
        this.baseUrl = baseUrl;
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = baseUrl + "/forgot-password/reset?token=" + token;

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("noreply@hanziapp.co")
                .to(toEmail)
                .subject("Recupera tu contraseña - Hanzi")
                .html(buildResetEmailHtml(resetLink))
                .build();

        try {
            resend.emails().send(params);
            log.info("Email de recuperación enviado a {}", toEmail);
        } catch (ResendException e) {
            log.error("Error al enviar email de recuperación a {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("No se pudo enviar el email de recuperación", e);
        }
    }

    private String buildResetEmailHtml(String resetLink) {
        return """
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                  <h2 style="color: #1a1a1a;">Recupera tu contraseña</h2>
                  <p>Haz clic en el siguiente botón para establecer una nueva contraseña.
                     El enlace es válido por <strong>1 hora</strong>.</p>
                  <a href="%s"
                     style="display:inline-block; padding: 12px 24px; background:#dc2626;
                            color:#fff; border-radius:8px; text-decoration:none; font-weight:600;">
                    Restablecer contraseña
                  </a>
                  <p style="color:#666; font-size:13px; margin-top:24px;">
                    Si no solicitaste este cambio, ignora este mensaje.
                  </p>
                </div>
                """.formatted(resetLink);
    }
}
