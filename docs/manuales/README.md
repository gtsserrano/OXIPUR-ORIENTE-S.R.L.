# Documentación del sistema OXIPUR

Esta carpeta contiene la documentación oficial correspondiente a la versión 1.1,
desplegada en producción el 27 de julio de 2026.

## Documentos

- `ficha_tecnica_sistema_oxipur.pdf`: arquitectura, infraestructura, seguridad,
  persistencia, migración histórica, cambios de v1.1, respaldos y validaciones
  técnicas.
- `guia_de_usuario_sistema_oxipur.pdf`: procedimientos paso a paso para todas
  las funciones visibles del sistema, diferenciados por rol y actualizados para
  el alta automática de cilindros, los importes y la impresión de v1.1.
- `generate_v1_1_pdfs.py`: fuente reproducible que genera ambos PDF y sincroniza
  las copias de `output/pdf/` y `docs/manuales/`.

## Generación

El script utiliza ReportLab y las fuentes Arial instaladas en Windows:

```powershell
python docs/manuales/generate_v1_1_pdfs.py
```

## Mantenimiento

Los documentos deben actualizarse cuando cambien pantallas, permisos, reglas
operativas, arquitectura, modelo de datos o procedimientos de despliegue y
respaldo.

No deben incluirse contraseñas, claves privadas, tokens ni otros secretos.
