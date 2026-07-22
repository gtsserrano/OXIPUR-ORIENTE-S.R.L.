package bo.com.oxipuroriente.inventory.modules.productos.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.auditoria.application.AuditLogService;
import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditAction;
import bo.com.oxipuroriente.inventory.modules.productos.domain.Product;
import bo.com.oxipuroriente.inventory.modules.productos.infrastructure.ProductRepository;
import bo.com.oxipuroriente.inventory.modules.productos.presentation.CreateProductRequest;
import bo.com.oxipuroriente.inventory.modules.productos.presentation.ProductResponse;
import bo.com.oxipuroriente.inventory.modules.productos.presentation.UpdateProductRequest;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final AuditLogService auditLogService;

    public ProductService(ProductRepository repository, AuditLogService auditLogService) {
        this.repository = repository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        if (repository.existsByCode(request.code())) {
            throw new DuplicateProductCodeException(request.code());
        }

        Product product = new Product();
        product.setCode(request.code());
        product.setName(request.name());
        product.setDescription(request.description());
        product.setActive(request.active() == null || request.active());

        ProductResponse response = ProductResponse.from(repository.save(product));
        auditLogService.record(AuditAction.CREATE, "PRODUCT", response.id(), null, response);
        return response;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return repository.findAll()
                .stream()
                .filter(Product::isActive)
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return ProductResponse.from(findProduct(id));
    }

    @Transactional
    public ProductResponse update(Long id, UpdateProductRequest request) {
        Product product = findProduct(id);
        ProductResponse previous = ProductResponse.from(product);

        if (request.code() != null && !request.code().isBlank()) {
            if (repository.existsByCodeAndIdNot(request.code(), id)) {
                throw new DuplicateProductCodeException(request.code());
            }
            product.setCode(request.code());
        }
        if (request.name() != null && !request.name().isBlank()) {
            product.setName(request.name());
        }
        if (request.description() != null) {
            product.setDescription(request.description());
        }
        if (request.active() != null) {
            product.setActive(request.active());
        }

        ProductResponse response = ProductResponse.from(repository.save(product));
        auditLogService.record(AuditAction.UPDATE, "PRODUCT", id, previous, response);
        return response;
    }

    @Transactional
    public void delete(Long id) {
        Product product = findProduct(id);
        ProductResponse previous = ProductResponse.from(product);
        product.setActive(false);
        ProductResponse response = ProductResponse.from(repository.save(product));
        auditLogService.record(AuditAction.DEACTIVATE, "PRODUCT", id, previous, response);
    }

    private Product findProduct(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
