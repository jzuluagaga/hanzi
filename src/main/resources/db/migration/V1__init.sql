CREATE TABLE leccion (
    id         BIGSERIAL PRIMARY KEY,
    nombre     VARCHAR(255) NOT NULL,
    orden      INTEGER      NOT NULL,
    created_at TIMESTAMP    NOT NULL
);

CREATE TABLE usuario (
    id                 BIGSERIAL PRIMARY KEY,
    nombre             VARCHAR(255) NOT NULL,
    email              VARCHAR(255) NOT NULL UNIQUE,
    password_hash      VARCHAR(255),
    foto_url           VARCHAR(255),
    provider           VARCHAR(10)  NOT NULL,
    rol                VARCHAR(10)  NOT NULL,
    reset_token        VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at         TIMESTAMP    NOT NULL
);

CREATE TABLE carta (
    id          BIGSERIAL PRIMARY KEY,
    hanzi       VARCHAR(255) NOT NULL,
    pinyin      VARCHAR(255) NOT NULL,
    traduccion  VARCHAR(255) NOT NULL,
    hsk_nivel   INTEGER,
    categoria   VARCHAR(255),
    tipo        VARCHAR(255),
    image_url   VARCHAR(255),
    audio_url   VARCHAR(255),
    leccion_id  BIGINT REFERENCES leccion(id),
    created_at  TIMESTAMP    NOT NULL,
    CONSTRAINT uk_carta_hanzi_leccion UNIQUE (hanzi, leccion_id),
    CONSTRAINT uk_carta_hanzi_hsk     UNIQUE (hanzi, hsk_nivel)
);

CREATE INDEX idx_carta_hanzi_leccion ON carta (hanzi, leccion_id);
CREATE INDEX idx_carta_hanzi_hsk     ON carta (hanzi, hsk_nivel);

CREATE TABLE carta_estado (
    id               BIGSERIAL PRIMARY KEY,
    usuario_id       BIGINT           NOT NULL REFERENCES usuario(id),
    carta_id         BIGINT           NOT NULL REFERENCES carta(id),
    recordo          BOOLEAN          NOT NULL,
    stability        DOUBLE PRECISION NOT NULL,
    retrievability   DOUBLE PRECISION NOT NULL,
    difficulty       DOUBLE PRECISION NOT NULL,
    next_review_date DATE,
    updated_at       TIMESTAMP        NOT NULL,
    CONSTRAINT uk_carta_estado_usuario_carta UNIQUE (usuario_id, carta_id)
);

CREATE INDEX idx_carta_estado_usuario_carta       ON carta_estado (usuario_id, carta_id);
CREATE INDEX idx_carta_estado_usuario_next_review ON carta_estado (usuario_id, next_review_date);
