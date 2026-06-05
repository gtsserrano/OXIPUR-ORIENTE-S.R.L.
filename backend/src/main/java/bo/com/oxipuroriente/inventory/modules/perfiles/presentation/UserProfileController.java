package bo.com.oxipuroriente.inventory.modules.perfiles.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bo.com.oxipuroriente.inventory.modules.perfiles.application.UserProfileService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profiles")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UserProfileResponse> create(@Valid @RequestBody CreateUserProfileRequest request) {
        UserProfileResponse response = service.create(request);
        return ResponseEntity
                .created(URI.create("/api/profiles/" + response.id()))
                .body(response);
    }

    @GetMapping
    public List<UserProfileResponse> findAll() {
        return service.findAll();
    }

    @PutMapping("/{id}")
    public UserProfileResponse update(@PathVariable Long id, @Valid @RequestBody UpdateUserProfileRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activity")
    public UserProfileResponse markActivity(@PathVariable Long id) {
        return service.markActivity(id);
    }
}
