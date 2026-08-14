package bo.com.oxipuroriente.inventory.modules.auditoria.application;

import java.io.IOException;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditAction;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuditRequestLoggingFilter extends OncePerRequestFilter {

    private static final Set<String> PAGINATION_PARAMETERS = Set.of("page", "size", "usage");

    private final AuditLogService auditLogService;

    public AuditRequestLoggingFilter(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        filterChain.doFilter(request, response);

        AuditEvent event = resolveEvent(request, response.getStatus());
        if (event == null) {
            return;
        }
        try {
            auditLogService.record(
                    event.action(),
                    event.entityType(),
                    event.entityId(),
                    null,
                    eventDetails(request, response.getStatus(), event.action()));
        } catch (RuntimeException ignored) {
            // Auditing must never turn an otherwise valid user operation into an error.
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return "OPTIONS".equalsIgnoreCase(request.getMethod())
                || !path.startsWith("/api/")
                || path.equals("/api/status")
                || path.equals("/api/iam/login")
                || path.matches("/api/profiles/[^/]+/activity")
                || (path.equals("/api/profiles") && "GET".equalsIgnoreCase(request.getMethod()));
    }

    private AuditEvent resolveEvent(HttpServletRequest request, int responseStatus) {
        Target target = resolveTarget(request.getRequestURI());
        if (target == null) {
            return null;
        }
        if (responseStatus == HttpServletResponse.SC_UNAUTHORIZED
                || responseStatus == HttpServletResponse.SC_FORBIDDEN) {
            return new AuditEvent(AuditAction.ACCESS_DENIED, target.entityType(), target.entityId());
        }
        if (responseStatus >= 400) {
            return new AuditEvent(AuditAction.OPERATION_FAILED, target.entityType(), target.entityId());
        }

        String method = request.getMethod();
        if ("PATCH".equalsIgnoreCase(method) && request.getRequestURI().matches("/api/profiles/[^/]+/offline")) {
            return new AuditEvent(AuditAction.LOGOUT, "SESSION", target.entityId());
        }
        if (!"GET".equalsIgnoreCase(method)) {
            return null;
        }
        if (request.getRequestURI().endsWith(".xlsx")) {
            return new AuditEvent(AuditAction.EXPORT, target.entityType(), target.entityId());
        }
        if ("PRINT".equalsIgnoreCase(request.getParameter("usage"))) {
            return new AuditEvent(AuditAction.PRINT, target.entityType(), target.entityId());
        }
        AuditAction action = hasSearchParameters(request) ? AuditAction.SEARCH : AuditAction.VIEW;
        return new AuditEvent(action, target.entityType(), target.entityId());
    }

    private boolean hasSearchParameters(HttpServletRequest request) {
        return request.getParameterMap().keySet().stream().anyMatch(name -> !PAGINATION_PARAMETERS.contains(name));
    }

    private Map<String, Object> eventDetails(
            HttpServletRequest request,
            int responseStatus,
            AuditAction action) {
        Map<String, Object> details = new LinkedHashMap<>();
        String result = switch (action) {
            case ACCESS_DENIED -> "Acceso denegado";
            case OPERATION_FAILED -> "Operación fallida";
            default -> "Exitoso";
        };
        details.put("resultado", result);
        details.put("estadoHttp", responseStatus);
        request.getParameterMap().forEach((name, values) -> {
            if (!"usage".equals(name)) {
                details.put(name, values.length == 1 ? values[0] : Arrays.asList(values));
            }
        });
        return details;
    }

    private Target resolveTarget(String path) {
        if (path.startsWith("/api/inventory-movements")) {
            return target("INVENTORY_MOVEMENT", path, "/api/inventory-movements");
        }
        if (path.startsWith("/api/inventory/")) {
            return target("INVENTORY", path, "/api/inventory");
        }
        if (path.startsWith("/api/sales-notes")) {
            return target("SALES_NOTE", path, "/api/sales-notes");
        }
        if (path.startsWith("/api/cylinders")) {
            return target("CYLINDER", path, "/api/cylinders");
        }
        if (path.startsWith("/api/products")) {
            return target("PRODUCT", path, "/api/products");
        }
        if (path.startsWith("/api/customers")) {
            return target("CUSTOMER", path, "/api/customers");
        }
        if (path.startsWith("/api/warehouses")) {
            return target("WAREHOUSE", path, "/api/warehouses");
        }
        if (path.startsWith("/api/profiles")) {
            return target("USER_PROFILE", path, "/api/profiles");
        }
        if (path.startsWith("/api/audit-logs")) {
            return target("AUDIT_LOG", path, "/api/audit-logs");
        }
        if (path.startsWith("/api/utilities")) {
            return target("UTILITY", path, "/api/utilities");
        }
        if (path.startsWith("/api/operational-alerts")) {
            return target("OPERATIONAL_ALERT", path, "/api/operational-alerts");
        }
        return null;
    }

    private Target target(String entityType, String path, String rootPath) {
        String remainder = path.substring(rootPath.length()).replaceFirst("^/", "");
        String entityId = remainder.isBlank() ? "TODOS" : remainder.split("/")[0];
        return new Target(entityType, entityId);
    }

    private record Target(String entityType, String entityId) {
    }

    private record AuditEvent(AuditAction action, String entityType, String entityId) {
    }
}
