package com.hanzi.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(
    name = "carta_escritura_estado",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_usuario_carta_escritura", columnNames = {"usuario_id", "carta_id"})
    },
    indexes = {
        @Index(name = "idx_escritura_usuario", columnList = "usuario_id")
    }
)
public class CartaEscrituraEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "carta_id", nullable = false)
    private Carta carta;

    @Column(name = "veces_completado_facil", nullable = false)
    private Integer vecesCompletadoFacil = 0;

    @Column(name = "veces_completado_dificil", nullable = false)
    private Integer vecesCompletadoDificil = 0;

    @Column(name = "trazos_correctos_total", nullable = false)
    private Integer trazosCorrectosTotal = 0;

    @Column(name = "trazos_fallados_total", nullable = false)
    private Integer trazosFalladosTotal = 0;

    @Column(name = "ultima_escritura_at")
    private LocalDateTime ultimaEscrituraAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
