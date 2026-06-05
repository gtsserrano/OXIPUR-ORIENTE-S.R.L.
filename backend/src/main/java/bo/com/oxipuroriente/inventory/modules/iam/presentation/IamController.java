package bo.com.oxipuroriente.inventory.modules.iam.presentation;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bo.com.oxipuroriente.inventory.modules.iam.application.IamService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/iam")
public class IamController {

    private final IamService service;

    public IamController(IamService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public IamLoginResponse login(@Valid @RequestBody IamLoginRequest request) {
        return service.login(request);
    }
}
