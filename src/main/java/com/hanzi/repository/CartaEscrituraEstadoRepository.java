package com.hanzi.repository;

import com.hanzi.model.Carta;
import com.hanzi.model.CartaEscrituraEstado;
import com.hanzi.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartaEscrituraEstadoRepository extends JpaRepository<CartaEscrituraEstado, Long> {

    Optional<CartaEscrituraEstado> findByUsuarioAndCarta(Usuario usuario, Carta carta);
}
