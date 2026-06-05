# Migracion de registros historicos

Este documento describe como preparar scripts para migrar registros en papel previos al uso operativo del sistema.

## Principio

Los registros historicos se cargan como movimientos normales.
No existe un movimiento especial para migracion historica.

## Movimientos permitidos

- `PLANTA_A_CLIENTE`
- `CLIENTE_A_PLANTA`

## Datos esperados

- Catalogos base: productos, unidades y el unico almacen `PLANTA`.
- Cilindros reales identificados por `serial_number`.
- Movimiento historico con `movement_date`.
- Ubicacion origen y destino.
- Cliente cuando el movimiento involucra cliente.
- Observacion opcional.

## Idempotencia

Los scripts deben poder ejecutarse mas de una vez cuando sea razonable:

- No insertar cilindros duplicados; usar `serial_number`.
- No insertar productos duplicados; usar `code`.
- No insertar el almacen `PLANTA` mas de una vez; usar `code`.
- Para MySQL, preferir `INSERT ... ON DUPLICATE KEY UPDATE` cuando aplique.
- Para otros motores, usar una estrategia equivalente.

## Trazabilidad

Los scripts historicos deben documentar:

- Archivo ejecutado.
- Periodo historico cubierto.
- Datos que carga.
- Validaciones realizadas.
- Si puede ejecutarse mas de una vez.
