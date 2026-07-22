-- Historial inmutable de acciones sensibles realizadas en el sistema.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    actor_user_id BIGINT,
    actor_username VARCHAR(80),
    entity_type VARCHAR(80) NOT NULL,
    entity_id VARCHAR(80) NOT NULL,
    action VARCHAR(40) NOT NULL,
    previous_data LONGTEXT,
    new_data LONGTEXT,
    source_type VARCHAR(40) NOT NULL DEFAULT 'USER',
    request_method VARCHAR(10),
    request_path VARCHAR(255),
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_audit_logs PRIMARY KEY (id),
    CONSTRAINT fk_audit_logs_actor_user
        FOREIGN KEY (actor_user_id) REFERENCES user_profiles (id) ON DELETE SET NULL,
    INDEX idx_audit_logs_created_at (created_at),
    INDEX idx_audit_logs_actor_user (actor_user_id),
    INDEX idx_audit_logs_entity (entity_type, entity_id)
) ENGINE=InnoDB;

