-- Tabla de usuarios utilizada por el modulo de perfiles e inicio de sesion.
-- La contrasena original nunca se almacena: password_hash contiene un hash BCrypt.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Identificador interno del usuario',
    full_name VARCHAR(160) NOT NULL COMMENT 'Nombre completo ingresado al crear el usuario',
    username VARCHAR(80) COMMENT 'Nombre unico utilizado para iniciar sesion',
    password_hash VARCHAR(128) COMMENT 'Hash seguro de la contrasena; nunca contiene la contrasena original',
    role_name VARCHAR(80) NOT NULL COMMENT 'Rol del usuario: ADMINISTRADOR u OPERADOR',
    active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Indica si el usuario puede acceder al sistema',
    last_activity_at TIMESTAMP NOT NULL COMMENT 'Fecha y hora de la ultima actividad',
    online_until TIMESTAMP NOT NULL COMMENT 'Limite utilizado para determinar si se encuentra conectado',
    created_at TIMESTAMP NOT NULL COMMENT 'Fecha y hora de creacion',
    updated_at TIMESTAMP NOT NULL COMMENT 'Fecha y hora de la ultima modificacion',
    CONSTRAINT pk_user_profiles PRIMARY KEY (id),
    CONSTRAINT uq_user_profiles_username UNIQUE (username),
    INDEX idx_user_profiles_full_name (full_name),
    INDEX idx_user_profiles_online_until (online_until),
    INDEX idx_user_profiles_username (username)
) ENGINE=InnoDB;
