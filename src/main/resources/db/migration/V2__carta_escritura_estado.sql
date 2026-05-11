CREATE TABLE carta_escritura_estado (
    id                      BIGSERIAL    PRIMARY KEY,
    usuario_id              BIGINT       NOT NULL REFERENCES usuario(id),
    carta_id                BIGINT       NOT NULL REFERENCES carta(id),
    veces_completado_facil  INTEGER      NOT NULL DEFAULT 0,
    veces_completado_dificil INTEGER     NOT NULL DEFAULT 0,
    trazos_correctos_total  INTEGER      NOT NULL DEFAULT 0,
    trazos_fallados_total   INTEGER      NOT NULL DEFAULT 0,
    ultima_escritura_at     TIMESTAMP,
    created_at              TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_usuario_carta_escritura UNIQUE (usuario_id, carta_id)
);

CREATE INDEX idx_escritura_usuario ON carta_escritura_estado (usuario_id);
