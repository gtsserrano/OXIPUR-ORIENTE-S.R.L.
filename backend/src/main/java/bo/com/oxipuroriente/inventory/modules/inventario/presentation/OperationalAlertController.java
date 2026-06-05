package bo.com.oxipuroriente.inventory.modules.inventario.presentation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bo.com.oxipuroriente.inventory.modules.inventario.application.OperationalAlertService;

@RestController
@RequestMapping("/api/operational-alerts")
public class OperationalAlertController {

    private final OperationalAlertService service;

    public OperationalAlertController(OperationalAlertService service) {
        this.service = service;
    }

    @GetMapping
    public OperationalAlertsResponse getAlerts() {
        return service.getAlerts();
    }
}
