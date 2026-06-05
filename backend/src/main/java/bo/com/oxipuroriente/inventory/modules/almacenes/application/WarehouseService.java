package bo.com.oxipuroriente.inventory.modules.almacenes.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.almacenes.domain.Warehouse;
import bo.com.oxipuroriente.inventory.modules.almacenes.infrastructure.WarehouseRepository;
import bo.com.oxipuroriente.inventory.modules.almacenes.presentation.CreateWarehouseRequest;
import bo.com.oxipuroriente.inventory.modules.almacenes.presentation.UpdateWarehouseRequest;
import bo.com.oxipuroriente.inventory.modules.almacenes.presentation.WarehouseResponse;

@Service
public class WarehouseService {

    private final WarehouseRepository repository;

    public WarehouseService(WarehouseRepository repository) {
        this.repository = repository;
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

        return WarehouseResponse.from(repository.save(warehouse));
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

        return WarehouseResponse.from(repository.save(warehouse));
    }

    private Warehouse findWarehouse(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new WarehouseNotFoundException(id));
    }
}
