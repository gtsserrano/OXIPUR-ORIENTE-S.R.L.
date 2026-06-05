package bo.com.oxipuroriente.inventory.modules.inventario.presentation;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.inventario.application.InventoryCylinderQueryService;

@RestController
@RequestMapping("/api/inventory/cylinders")
public class InventoryCylinderController {

    private final InventoryCylinderQueryService service;

    public InventoryCylinderController(InventoryCylinderQueryService service) {
        this.service = service;
    }

    @GetMapping
    public List<InventoryCylinderResponse> findCylinders(
            @RequestParam(required = false) CylinderLocationType locationType,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String serialNumber) {
        return service.findCylinders(locationType, customerName, serialNumber);
    }
}
