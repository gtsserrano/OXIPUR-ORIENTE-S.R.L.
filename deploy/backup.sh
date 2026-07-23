#!/usr/bin/env bash
set -Eeuo pipefail

readonly APP_DIR="/opt/oxipur"
readonly ENV_FILE="${APP_DIR}/.env.production"
readonly COMPOSE_FILE="${APP_DIR}/docker-compose.production.yml"
readonly BACKUP_DIR="${APP_DIR}/backups"
readonly RETENTION_DAYS="30"

umask 077

if [[ ! -r "${ENV_FILE}" ]]; then
  echo "Missing production environment file: ${ENV_FILE}" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

mkdir -p "${BACKUP_DIR}"

timestamp="$(date +'%Y%m%d_%H%M%S')"
backup_file="${BACKUP_DIR}/oxipur_inventory_${timestamp}.sql.gz"
temporary_file="${backup_file}.tmp"

cleanup() {
  rm -f "${temporary_file}"
}
trap cleanup EXIT

docker compose \
  --env-file "${ENV_FILE}" \
  --file "${COMPOSE_FILE}" \
  exec -T \
  -e MYSQL_PWD="${DB_ROOT_PASSWORD}" \
  mysql \
  mysqldump \
    --user=root \
    --single-transaction \
    --quick \
    --routines \
    --events \
    --triggers \
    --no-tablespaces \
    --default-character-set=utf8mb4 \
    oxipur_inventory \
  | gzip -9 > "${temporary_file}"

gzip -t "${temporary_file}"
mv "${temporary_file}" "${backup_file}"
sha256sum "${backup_file}" > "${backup_file}.sha256"

find "${BACKUP_DIR}" -type f -name 'oxipur_inventory_*.sql.gz' -mtime "+${RETENTION_DAYS}" -delete
find "${BACKUP_DIR}" -type f -name 'oxipur_inventory_*.sql.gz.sha256' -mtime "+${RETENTION_DAYS}" -delete

echo "Backup completed: ${backup_file}"
