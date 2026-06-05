package bo.com.oxipuroriente.inventory.shared.presentation;

import java.time.Instant;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiStatusController {

    @GetMapping("/status")
    public ApiStatusResponse status() {
        return new ApiStatusResponse("ok", "OXIPUR Oriente Inventory Platform", Instant.now());
    }

    public record ApiStatusResponse(String status, String application, Instant timestamp) {
    }
}
