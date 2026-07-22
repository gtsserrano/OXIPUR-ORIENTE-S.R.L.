package bo.com.oxipuroriente.inventory.modules.auditoria.presentation;

import java.time.Instant;

import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditAction;
import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditLog;
import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditSourceType;

public record AuditLogResponse(
        Long id,
        Long actorUserId,
        String actorUsername,
        String entityType,
        String entityId,
        AuditAction action,
        String previousData,
        String newData,
        AuditSourceType sourceType,
        String requestMethod,
        String requestPath,
        String ipAddress,
        Instant createdAt) {

    public static AuditLogResponse from(AuditLog auditLog) {
        return new AuditLogResponse(
                auditLog.getId(),
                auditLog.getActorUserId(),
                auditLog.getActorUsername(),
                auditLog.getEntityType(),
                auditLog.getEntityId(),
                auditLog.getAction(),
                auditLog.getPreviousData(),
                auditLog.getNewData(),
                auditLog.getSourceType(),
                auditLog.getRequestMethod(),
                auditLog.getRequestPath(),
                auditLog.getIpAddress(),
                auditLog.getCreatedAt());
    }
}

