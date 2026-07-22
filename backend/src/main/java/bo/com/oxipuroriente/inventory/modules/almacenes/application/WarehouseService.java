package bo.com.oxipuroriente.inventory.modules.almacenes.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.auditoria.application.AuditLogService;
import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditAction;
import bo.com.oxipuroriente.inventory.modules.almacenes.domain.Warehouse;
import bo.com.oxipuroriente.inventory.modules.almacenes.infrastructure.WarehouseRepository;
import bo.com.oxipuroriente.inventory.modules.almacenes.presentation.CreateWarehouseRequest;
import bo.com.oxipuroriente.inventory.modules.almacenes.presentation.UpdateWarehouseRequest;
import bo.com.oxipuroriente.inventory.modules.almacenes.presentation.WarehouseResponse;

@Service
public class WarehouseService {

    private final WarehouseRepository repository;
    private final AuditLogService auditLogService;

    public WarehouseService(WarehouseRepository repository, AuditLogService auditLogService) {
        this.repository = repository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public WarehouseResponse create(CreateWarehouseRequest request) {
        if (repository.existsByCode(request.code())) {
            throw new DuplicateWarehouseCodeException(request.code());
        }

        Warehouse warehouse = new Warehouse();
        warehouse.setCode(request.code());
        warehouse.setName(request.name());
        warehouse.setAddress(request.address());
        warehouse.setActive(request.active() == null || request.active());

        WarehouseResponse response = WarehouseResponse.from(repository.save(warehouse));
        auditLogService.record(AuditAction.CREATE, "WAREHOUSE", response.id(), null, response);
        return response;
    }

    @Transactional(readOnly = true)
    public List<WarehouseResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(WarehouseResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public WarehouseResponse findById(Long id) {
        return WarehouseResponse.from(findWarehouse(id));
    }

    @Transactional
    public WarehouseResponse update(Long id, UpdateWarehouseRequest request) {
        Warehouse warehouse = findWarehouse(id);
        WarehouseResponse previous = WarehouseResponse.from(warehouse);

        if (request.code() != null && !request.code().isBlank()) {
            if (repository.existsByCodeAndIdNot(request.code(), id)) {
                throw new DuplicateWarehouseCodeException(request.code());
            }
            warehouse.setCode(request.code());
        }
        if (request.name() != null && !request.name().isBlank()) {
            warehouse.setName(request.name());
        }
        if (request.address() != null) {
            warehouse.setAddress(request.address());
        }
        if (request.active() != null) {
            warehouse.setActive(request.active());
        }

        WarehouseResponse response = WarehouseResponse.from(repository.save(warehouse));
        auditLogService.record(AuditAction.UPDATE, "WAREHOUSE", id, previous, response);
        return response;
    }

    private Warehouse findWarehouse(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new WarehouseNotFoundException(id));
    }
}
