package com.room911.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Extrae el token Bearer, lo valida y publica la autenticación con la
 * autoridad ROLE_<rol> para que @PreAuthorize resuelva los permisos.
 * Si el token falta o es inválido, no publica autenticación y los
 * endpoints protegidos responden 401.
 * No lleva @Component: se registra como @Bean en SecurityConfig para que
 * el contenedor de servlets no lo instancie dos veces.
 */
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String PREFIJO_BEARER = "Bearer ";
    private static final String PREFIJO_ROL = "ROLE_";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith(PREFIJO_BEARER)) {
            String token = header.substring(PREFIJO_BEARER.length());
            if (jwtService.esValido(token)) {
                String usuario = jwtService.obtenerUsuario(token);
                String rol = jwtService.obtenerRol(token);

                var autoridades = List.of(new SimpleGrantedAuthority(PREFIJO_ROL + rol));
                var autenticacion = new UsernamePasswordAuthenticationToken(usuario, null, autoridades);
                SecurityContextHolder.getContext().setAuthentication(autenticacion);
            }
        }

        filterChain.doFilter(request, response);
    }
}
