package bo.com.oxipuroriente.inventory.modules.inventario.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.cilindros.infrastructure.CylinderRepository;
import bo.com.oxipuroriente.inventory.modules.inventario.presentation.OperationalAlertsResponse;

@Service
public class OperationalAlertService {

    private static final String OXIPUR_OWNER = "OXIPUR";

    private final CylinderRepository cylinderRepository;

    public OperationalAlertService(CylinderRepository cylinderRepository) {
        this.cylinderRepository = cylinderRepository;
    }

    @Transactional(readOnly = true)
    public OperationalAlertsResponse getAlerts() {
        return new OperationalAlertsResponse(
                OXIPUR_OWNER,
                cylinderRepository.countActiveByNormalizedOwner(OXIPUR_OWNER));
    }
}
