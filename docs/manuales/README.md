# Documentación del sistema OXIPUR

Esta carpeta contiene la documentación oficial correspondiente a la versión
`1.1.4-snapshot`, validada como candidata de publicación el 14 de agosto de 2026.

## Documentos

- `ficha_tecnica_sistema_oxipur.pdf`: arquitectura, infraestructura, seguridad,
  persistencia, migración histórica, auditoría ampliada, cambios de
  `1.1.4-snapshot`, respaldos y validaciones técnicas.
- `guia_de_usuario_sistema_oxipur.pdf`: manual exhaustivo de todas las funciones
  visibles, diferenciado por rol y actualizado con filtros exclusivos,
  búsqueda previa de impresión, auditoría detallada y alta guiada de cilindros.
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
