package bo.com.oxipuroriente.inventory.shared.security;

import java.io.IOException;
import java.util.Map;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import bo.com.oxipuroriente.inventory.modules.iam.security.JwtAuthenticationFilter;
import bo.com.oxipuroriente.inventory.modules.iam.security.JwtProperties;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

@Configuration
@EnableMethodSecurity
@EnableConfigurationProperties(JwtProperties.class)
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter)
            throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint())
                        .accessDeniedHandler(accessDeniedHandler()))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/iam/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/status", "/actuator/health", "/actuator/health/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/profiles/*/activity", "/api/profiles/*/offline").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/profiles/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/utilities/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.POST, "/api/profiles/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/profiles/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/profiles/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.POST, "/api/products/**", "/api/warehouses/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/products/**", "/api/warehouses/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMINISTRADOR")
                        .requestMatchers("/api/**").authenticated()
                        .requestMatchers("/actuator/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "unauthorized");
    }

    @Bean
    AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> writeError(response, HttpServletResponse.SC_FORBIDDEN, "access_denied");
    }

    private static void writeError(HttpServletResponse response, int status, String error) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), Map.of("error", error));
    }
}
