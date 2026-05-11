ALTER TABLE carta_escritura_estado
    DROP CONSTRAINT carta_escritura_estado_usuario_id_fkey,
    ADD CONSTRAINT carta_escritura_estado_usuario_id_fkey
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        ON DELETE CASCADE;

ALTER TABLE carta_escritura_estado
    DROP CONSTRAINT carta_escritura_estado_carta_id_fkey,
    ADD CONSTRAINT carta_escritura_estado_carta_id_fkey
        FOREIGN KEY (carta_id) REFERENCES carta(id)
        ON DELETE CASCADE;
