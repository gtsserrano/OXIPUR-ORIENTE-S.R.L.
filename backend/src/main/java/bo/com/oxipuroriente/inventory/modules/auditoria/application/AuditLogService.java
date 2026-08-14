package bo.com.oxipuroriente.inventory.modules.auditoria.application;

import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditAction;
import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditLog;
import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditSourceType;
import bo.com.oxipuroriente.inventory.modules.auditoria.infrastructure.AuditLogRepository;
import bo.com.oxipuroriente.inventory.modules.auditoria.presentation.AuditLogPageResponse;
import bo.com.oxipuroriente.inventory.modules.auditoria.presentation.AuditLogResponse;
import bo.com.oxipuroriente.inventory.modules.iam.security.AuthenticatedUser;
import bo.com.oxipuroriente.inventory.modules.iam.security.CurrentUser;
import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.databind.ObjectMapper;

@Service
public class AuditLogService {

    private static final int MAX_PAGE_SIZE = 200;

    private final AuditLogRepository repository;
    private final CurrentUser currentUser;
    private final ObjectMapper objectMapper;

    public AuditLogService(AuditLogRepository repository, CurrentUser currentUser, ObjectMapper objectMapper) {
        this.repository = repository;
        this.currentUser = currentUser;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void record(
            AuditAction action,
            String entityType,
            Object entityId,
            Object previousData,
            Object newData) {
        record(action, entityType, entityId, previousData, newData, AuditSourceType.USER);
    }

    @Transactional
    public void record(
            AuditAction action,
            String entityType,
            Object entityId,
            Object previousData,
            Object newData,
            AuditSourceType sourceType) {
        AuthenticatedUser actor = currentUser.get().orElse(null);
        persist(action, entityType, entityId, previousData, newData, sourceType,
                actor == null ? null : actor.id(), actor == null ? null : actor.username());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordAsActor(
            AuditAction action,
            String entityType,
            Object entityId,
            Long actorUserId,
            String actorUsername,
            Object newData) {
        persist(action, entityType, entityId, null, newData, AuditSourceType.USER, actorUserId, actorUsername);
    }

    private void persist(
            AuditAction action,
            String entityType,
            Object entityId,
            Object previousData,
            Object newData,
            AuditSourceType sourceType,
            Long actorUserId,
            String actorUsername) {
        AuditLog auditLog = new AuditLog();
        auditLog.setActorUserId(actorUserId);
        auditLog.setActorUsername(actorUsername);
        RequestMetadata requestMetadata = currentRequestMetadata();
        auditLog.setEntityType(entityType.trim().toUpperCase(Locale.ROOT));
        auditLog.setEntityId(String.valueOf(entityId));
        auditLog.setAction(action);
        auditLog.setPreviousData(toJson(previousData));
        auditLog.setNewData(toJson(newData));
        auditLog.setSourceType(sourceType == null ? AuditSourceType.USER : sourceType);
        auditLog.setRequestMethod(requestMetadata.method());
        auditLog.setRequestPath(requestMetadata.path());
        auditLog.setIpAddress(requestMetadata.ipAddress());
        repository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public AuditLogPageResponse findAll(String entityType, String entityId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), MAX_PAGE_SIZE));
        Page<AuditLog> auditLogs;
        if (entityType != null && !entityType.isBlank() && entityId != null && !entityId.isBlank()) {
            auditLogs = repository.findByEntityTypeIgnoreCaseAndEntityIdOrderByCreatedAtDesc(
                    entityType.trim(),
                    entityId.trim(),
                    pageRequest);
        } else if (entityType != null && !entityType.isBlank()) {
            auditLogs = repository.findByEntityTypeIgnoreCaseOrderByCreatedAtDesc(entityType.trim(), pageRequest);
        } else {
            auditLogs = repository.findAllByOrderByCreatedAtDesc(pageRequest);
        }
        return AuditLogPageResponse.from(auditLogs.map(AuditLogResponse::from));
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw new IllegalStateException("Could not serialize audit data", exception);
        }
    }

    private RequestMetadata currentRequestMetadata() {
        if (!(RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes)) {
            return RequestMetadata.EMPTY;
        }
        HttpServletRequest request = attributes.getRequest();
        return new RequestMetadata(request.getMethod(), request.getRequestURI(), request.getRemoteAddr());
    }

    private record RequestMetadata(String method, String path, String ipAddress) {
        private static final RequestMetadata EMPTY = new RequestMetadata(null, null, null);
    }
}
