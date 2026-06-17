package bo.com.oxipuroriente.inventory.modules.iam.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import bo.com.oxipuroriente.inventory.modules.iam.application.PasswordService;
import bo.com.oxipuroriente.inventory.modules.iam.security.JwtTokenService;
import bo.com.oxipuroriente.inventory.modules.perfiles.domain.UserProfile;
import bo.com.oxipuroriente.inventory.modules.perfiles.infrastructure.UserProfileRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityAuthorizationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Test
    void rejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsMalformedToken() throws Exception {
        mockMvc.perform(get("/api/products")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsExpiredToken() throws Exception {
        UserProfile operator = createProfile("OPERADOR");
        String expiredToken = jwtTokenService.createToken(
                operator,
                Instant.now().minusSeconds(7200),
                Instant.now().minusSeconds(3600))
                .token();

        mockMvc.perform(get("/api/products").header(HttpHeaders.AUTHORIZATION, bearer(expiredToken)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void allowsAuthenticatedOperatorToReadCatalog() throws Exception {
        String token = loginToken(createProfile("OPERADOR"));

        mockMvc.perform(get("/api/products").header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk());
    }

    @Test
    void deniesOperatorCatalogMutation() throws Exception {
        String token = loginToken(createProfile("OPERADOR"));

        mockMvc.perform(post("/api/products")
                        .header(HttpHeaders.AUTHORIZATION, bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "code": "%s",
                                  "name": "Producto protegido"
                                }
                                """.formatted(unique("SEC-PROD"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void allowsAdministratorCatalogMutation() throws Exception {
        String token = loginToken(createProfile("ADMINISTRADOR"));

        JsonNode response = objectMapper.readTree(mockMvc.perform(post("/api/products")
                        .header(HttpHeaders.AUTHORIZATION, bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "code": "%s",
                                  "name": "Producto protegido"
                                }
                                """.formatted(unique("SEC-ADMIN-PROD"))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(response.get("name").asText()).isEqualTo("Producto protegido");
    }

    @Test
    void deniesOperatorRoleEscalationAttempt() throws Exception {
        String token = loginToken(createProfile("OPERADOR"));

        mockMvc.perform(post("/api/profiles")
                        .header(HttpHeaders.AUTHORIZATION, bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Escalada %s",
                                  "roleName": "ADMINISTRADOR",
                                  "username": "%s",
                                  "password": "Clave123"
                                }
                                """.formatted(UUID.randomUUID(), unique("escalada"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void deniesOperatorUpdatingAnotherProfilePresence() throws Exception {
        UserProfile operator = createProfile("OPERADOR");
        UserProfile other = createProfile("OPERADOR");
        String token = loginToken(operator);

        mockMvc.perform(patch("/api/profiles/{id}/activity", other.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isForbidden());
    }

    private String loginToken(UserProfile profile) throws Exception {
        JsonNode response = objectMapper.readTree(mockMvc.perform(post("/api/iam/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "%s",
                                  "password": "Clave123"
                                }
                                """.formatted(profile.getUsername())))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());
        return response.get("accessToken").asText();
    }

    private UserProfile createProfile(String roleName) {
        String username = unique("user").toLowerCase();
        UserProfile profile = new UserProfile();
        profile.setFullName("Perfil " + username);
        profile.setRoleName(roleName);
        profile.setUsername(username);
        profile.setPasswordHash(passwordService.encode("Clave123"));
        profile.setActive(true);
        return userProfileRepository.save(profile);
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private String unique(String prefix) {
        return prefix + "-" + UUID.randomUUID();
    }
}
