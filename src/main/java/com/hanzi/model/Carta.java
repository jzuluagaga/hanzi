package com.hanzi.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(
    name = "carta",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_carta_hanzi_leccion", columnNames = {"hanzi", "leccion_id"}),
        @UniqueConstraint(name = "uk_carta_hanzi_hsk",    columnNames = {"hanzi", "hsk_nivel"})
    },
    indexes = {
        @Index(name = "idx_carta_hanzi_leccion", columnList = "hanzi, leccion_id"),
        @Index(name = "idx_carta_hanzi_hsk",     columnList = "hanzi, hsk_nivel")
    }
)
public class Carta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String hanzi;

    @Column(nullable = false)
    private String pinyin;

    @Column(nullable = false)
    private String traduccion;

    @Column(name = "hsk_nivel")
    private Integer hskNivel;

    private String categoria;

    private String tipo;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "audio_url")
    private String audioUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "leccion_id")
    private Leccion leccion;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
