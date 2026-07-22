package bo.com.oxipuroriente.inventory.modules.clientes.presentation;

import java.time.Instant;

import bo.com.oxipuroriente.inventory.modules.clientes.domain.Customer;

public record CustomerResponse(
        Long id,
        String name,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {

    public static CustomerResponse from(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.isActive(),
                customer.getCreatedAt(),
                customer.getUpdatedAt());
    }
}
