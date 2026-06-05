package bo.com.oxipuroriente.inventory.modules.inventario.presentation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bo.com.oxipuroriente.inventory.modules.inventario.application.InventoryCylinderQueryService;

@RestController
@RequestMapping("/api/inventory/customers")
public class CustomerInventoryController {

    private final InventoryCylinderQueryService service;

    public CustomerInventoryController(InventoryCylinderQueryService service) {
        this.service = service;
    }

    @GetMapping("/{customerName}/cylinders")
    public CustomerCylinderInventoryResponse findCustomerCylinders(@PathVariable String customerName) {
        return service.findCustomerCylinders(customerName);
    }
}
