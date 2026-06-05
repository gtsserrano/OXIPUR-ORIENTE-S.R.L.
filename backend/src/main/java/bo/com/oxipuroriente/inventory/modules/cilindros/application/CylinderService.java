package bo.com.oxipuroriente.inventory.modules.cilindros.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderOwnerType;
import bo.com.oxipuroriente.inventory.modules.cilindros.infrastructure.CylinderRepository;
import bo.com.oxipuroriente.inventory.modules.cilindros.presentation.CreateCylinderRequest;
import bo.com.oxipuroriente.inventory.modules.cilindros.presentation.CylinderResponse;
import bo.com.oxipuroriente.inventory.modules.cilindros.presentation.UpdateCylinderRequest;

@Service
public class CylinderService {

    private final CylinderRepository repository;

    public CylinderService(CylinderRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public CylinderResponse create(CreateCylinderRequest request) {
        if (repository.existsBySerialNumber(request.serialNumber())) {
            throw new DuplicateCylinderSerialNumberException(request.serialNumber());
        }

        Cylinder cylinder = new Cylinder();
        cylinder.setSerialNumber(request.serialNumber());
        cylinder.setCapacityM3(request.capacityM3());
        cylinder.setOwner(request.owner());
        cylinder.setPrice(request.price());
        cylinder.setActive(request.active() == null || request.active());
        cylinder.setOwnerType(request.ownerType() == null ? CylinderOwnerType.COMPANY : request.ownerType());
        cylinder.setCurrentLocationType(CylinderLocationType.PLANTA);

        return CylinderResponse.from(repository.save(cylinder));
    }

    @Transactional(readOnly = true)
    public List<CylinderResponse> findAll() {
        return repository.findAll()
                .stream()
                .filter(Cylinder::isActive)
                .map(CylinderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CylinderResponse findById(Long id) {
        return CylinderResponse.from(findCylinder(id));
    }

    @Transactional
    public CylinderResponse update(Long id, UpdateCylinderRequest request) {
        Cylinder cylinder = findCylinder(id);

        if (request.serialNumber() != null && !request.serialNumber().isBlank()) {
            if (repository.existsBySerialNumberAndIdNot(request.serialNumber(), id)) {
                throw new DuplicateCylinderSerialNumberException(request.serialNumber());
            }
            cylinder.setSerialNumber(request.serialNumber());
        }
        if (request.capacityM3() != null) {
            cylinder.setCapacityM3(request.capacityM3());
        }
        if (request.owner() != null && !request.owner().isBlank()) {
            cylinder.setOwner(request.owner());
        }
        if (request.price() != null) {
            cylinder.setPrice(request.price());
        }
        if (request.active() != null) {
            cylinder.setActive(request.active());
        }
        if (request.ownerType() != null) {
            cylinder.setOwnerType(request.ownerType());
        }

        return CylinderResponse.from(repository.save(cylinder));
    }

    @Transactional
    public void delete(Long id) {
        Cylinder cylinder = findCylinder(id);
        cylinder.setActive(false);
        repository.save(cylinder);
    }

    private Cylinder findCylinder(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CylinderNotFoundException(id));
    }
}
