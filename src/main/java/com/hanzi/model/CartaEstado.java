package com.hanzi.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(
    name = "carta_estado",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_carta_estado_usuario_carta", columnNames = {"usuario_id", "carta_id"})
    },
    indexes = {
        @Index(name = "idx_carta_estado_usuario_carta", columnList = "usuario_id, carta_id"),
        @Index(name = "idx_carta_estado_usuario_next_review", columnList = "usuario_id, next_review_date")
    }
)
public class CartaEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "carta_id", nullable = false)
    private Carta carta;

    @Column(nullable = false)
    private boolean recordo;

    @Column(nullable = false)
    private double stability;

    @Column(nullable = false)
    private double retrievability;

    @Column(nullable = false)
    private double difficulty;

    @Column(name = "next_review_date")
    private LocalDate nextReviewDate;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void prePersist() {
        this.updatedAt = LocalDateTime.now();
        if (this.nextReviewDate == null) {
            this.nextReviewDate = LocalDate.now();
        }
    }

    @PreUpdate
    protected void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

