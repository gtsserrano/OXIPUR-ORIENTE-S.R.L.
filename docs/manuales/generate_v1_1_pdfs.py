"""Genera la documentación oficial PDF del sistema OXIPUR v1.1.2.

El script crea primero los archivos en output/pdf y luego sincroniza las copias
oficiales incluidas en docs/manuales. No contiene credenciales ni secretos.
"""

from __future__ import annotations

import shutil
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
DOCS_DIR = ROOT / "docs" / "manuales"
OUTPUT_DIR = ROOT / "output" / "pdf"
LOGO = ROOT / "frontend" / "public" / "oxipur-logo.png"

VERSION = "1.1.2"
RELEASE_DATE = "13 de agosto de 2026"
DOMAIN = "https://oxipur.net"

NAVY = colors.HexColor("#0D2942")
TEAL = colors.HexColor("#087C95")
CYAN = colors.HexColor("#20B8D3")
SKY = colors.HexColor("#E9F7FB")
LIGHT = colors.HexColor("#F5F9FC")
BORDER = colors.HexColor("#CDDCE6")
INK = colors.HexColor("#172437")
MUTED = colors.HexColor("#5C6D7F")
GREEN = colors.HexColor("#187A55")
GREEN_BG = colors.HexColor("#EAF7F1")
AMBER = colors.HexColor("#A85A00")
AMBER_BG = colors.HexColor("#FFF5DF")
RED = colors.HexColor("#B42318")
WHITE = colors.white


def register_fonts() -> None:
    font_dir = Path("C:/Windows/Fonts")
    pdfmetrics.registerFont(TTFont("Arial", str(font_dir / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-Bold", str(font_dir / "arialbd.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-Italic", str(font_dir / "ariali.ttf")))
    pdfmetrics.registerFontFamily(
        "Arial",
        normal="Arial",
        bold="Arial-Bold",
        italic="Arial-Italic",
        boldItalic="Arial-Bold",
    )


register_fonts()
BASE = getSampleStyleSheet()

STYLES = {
    "body": ParagraphStyle(
        "body",
        parent=BASE["BodyText"],
        fontName="Arial",
        fontSize=8.4,
        leading=11.3,
        textColor=INK,
        spaceAfter=4,
    ),
    "small": ParagraphStyle(
        "small",
        parent=BASE["BodyText"],
        fontName="Arial",
        fontSize=7.3,
        leading=9.4,
        textColor=MUTED,
    ),
    "tiny": ParagraphStyle(
        "tiny",
        parent=BASE["BodyText"],
        fontName="Arial",
        fontSize=6.5,
        leading=8,
        textColor=MUTED,
    ),
    "h1": ParagraphStyle(
        "h1",
        parent=BASE["Heading1"],
        fontName="Arial-Bold",
        fontSize=18,
        leading=21,
        textColor=NAVY,
        spaceAfter=7,
    ),
    "h2": ParagraphStyle(
        "h2",
        parent=BASE["Heading2"],
        fontName="Arial-Bold",
        fontSize=10.8,
        leading=13,
        textColor=NAVY,
        spaceBefore=5,
        spaceAfter=4,
    ),
    "cover_title": ParagraphStyle(
        "cover_title",
        parent=BASE["Title"],
        fontName="Arial-Bold",
        fontSize=25,
        leading=29,
        textColor=WHITE,
        alignment=TA_LEFT,
        spaceAfter=10,
    ),
    "cover_subtitle": ParagraphStyle(
        "cover_subtitle",
        parent=BASE["BodyText"],
        fontName="Arial",
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor("#D9F4FA"),
    ),
    "cover_kicker": ParagraphStyle(
        "cover_kicker",
        parent=BASE["BodyText"],
        fontName="Arial-Bold",
        fontSize=8,
        leading=10,
        textColor=CYAN,
    ),
    "center": ParagraphStyle(
        "center",
        parent=BASE["BodyText"],
        fontName="Arial",
        fontSize=8,
        leading=10,
        alignment=TA_CENTER,
        textColor=INK,
    ),
    "center_bold": ParagraphStyle(
        "center_bold",
        parent=BASE["BodyText"],
        fontName="Arial-Bold",
        fontSize=8.4,
        leading=10,
        alignment=TA_CENTER,
        textColor=NAVY,
    ),
    "table": ParagraphStyle(
        "table",
        parent=BASE["BodyText"],
        fontName="Arial",
        fontSize=7.4,
        leading=9.2,
        textColor=INK,
    ),
    "table_header": ParagraphStyle(
        "table_header",
        parent=BASE["BodyText"],
        fontName="Arial-Bold",
        fontSize=7.5,
        leading=9.2,
        textColor=WHITE,
    ),
    "step_number": ParagraphStyle(
        "step_number",
        parent=BASE["BodyText"],
        fontName="Arial-Bold",
        fontSize=9,
        leading=11,
        alignment=TA_CENTER,
        textColor=WHITE,
    ),
    "stat_value": ParagraphStyle(
        "stat_value",
        parent=BASE["BodyText"],
        fontName="Arial-Bold",
        fontSize=14,
        leading=16,
        alignment=TA_CENTER,
        textColor=TEAL,
    ),
    "stat_label": ParagraphStyle(
        "stat_label",
        parent=BASE["BodyText"],
        fontName="Arial",
        fontSize=6.8,
        leading=8.4,
        alignment=TA_CENTER,
        textColor=MUTED,
    ),
}


def p(text: str, style: str = "body") -> Paragraph:
    return Paragraph(text, STYLES[style])


def cover(
    document_kind: str,
    title: str,
    subtitle: str,
    metadata: list[tuple[str, str]],
    highlights: list[str],
) -> list:
    logo = Image(str(LOGO), width=39 * mm, height=39 * mm)
    brand = Table(
        [[logo, p("OXIPUR ORIENTE S.R.L.<br/><font color='#20B8D3'>SISTEMA DE GESTIÓN</font>", "cover_kicker")]],
        colWidths=[45 * mm, 105 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        ),
    )
    hero = Table(
        [
            [brand],
            [Spacer(1, 8)],
            [p(document_kind.upper(), "cover_kicker")],
            [p(title, "cover_title")],
            [p(subtitle, "cover_subtitle")],
        ],
        colWidths=[170 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), NAVY),
                ("BOX", (0, 0), (-1, -1), 0, NAVY),
                ("LEFTPADDING", (0, 0), (-1, -1), 13 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 13 * mm),
                ("TOPPADDING", (0, 0), (-1, 0), 9 * mm),
                ("BOTTOMPADDING", (0, -1), (-1, -1), 11 * mm),
            ]
        ),
    )

    meta_rows = []
    for index in range(0, len(metadata), 2):
        pair = metadata[index : index + 2]
        row = []
        for label, value in pair:
            row.append(
                Table(
                    [[p(label.upper(), "tiny")], [p(value, "center_bold")]],
                    colWidths=[77 * mm],
                    style=TableStyle(
                        [
                            ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
                            ("BOX", (0, 0), (-1, -1), 0.6, BORDER),
                            ("LEFTPADDING", (0, 0), (-1, -1), 7),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                            ("TOPPADDING", (0, 0), (-1, -1), 5),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                        ]
                    ),
                )
            )
        if len(row) == 1:
            row.append("")
        meta_rows.append(row)

    meta = Table(
        meta_rows,
        colWidths=[82 * mm, 82 * mm],
        hAlign="CENTER",
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 3),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        ),
    )

    highlight_table = Table(
        [[p(item.upper(), "center_bold") for item in highlights]],
        colWidths=[166 * mm / len(highlights)] * len(highlights),
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), SKY),
                ("TEXTCOLOR", (0, 0), (-1, -1), TEAL),
                ("BOX", (0, 0), (-1, -1), 0.6, CYAN),
                ("INNERGRID", (0, 0), (-1, -1), 0.3, BORDER),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        ),
    )

    return [
        hero,
        Spacer(1, 13 * mm),
        meta,
        Spacer(1, 9 * mm),
        highlight_table,
        Spacer(1, 9 * mm),
        callout(
            "Control documental",
            f"Documento oficial de la versión {VERSION}, emitido el {RELEASE_DATE}. "
            "No contiene contraseñas, claves privadas ni secretos de infraestructura.",
            "info",
        ),
        PageBreak(),
    ]


def section_header(number: str, title: str, audience: str | None = None) -> Table:
    number_box = Table(
        [[p(number, "step_number")]],
        colWidths=[14 * mm],
        rowHeights=[12 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), TEAL),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOX", (0, 0), (-1, -1), 0, TEAL),
            ]
        ),
    )
    audience_cell = ""
    if audience:
        audience_cell = Table(
            [[p(audience, "center_bold")]],
            colWidths=[29 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), SKY),
                    ("BOX", (0, 0), (-1, -1), 0.6, CYAN),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            ),
        )
    return Table(
        [[number_box, p(title, "h1"), audience_cell]],
        colWidths=[18 * mm, 116 * mm, 31 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        ),
    )


def heading(text: str) -> Paragraph:
    return p(text, "h2")


def table(
    headers: list[str],
    rows: list[list[str]],
    widths: list[float] | None = None,
    compact: bool = False,
) -> Table:
    data = [[p(value, "table_header") for value in headers]]
    data.extend([[p(str(value), "table") for value in row] for row in rows])
    result = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    padding = 3.5 if compact else 5
    result.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("GRID", (0, 0), (-1, -1), 0.45, BORDER),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT]),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), padding),
                ("RIGHTPADDING", (0, 0), (-1, -1), padding),
                ("TOPPADDING", (0, 0), (-1, -1), padding),
                ("BOTTOMPADDING", (0, 0), (-1, -1), padding),
            ]
        )
    )
    return result


def bullets(items: list[str], compact: bool = False) -> ListFlowable:
    style = STYLES["small" if compact else "body"]
    return ListFlowable(
        [ListItem(Paragraph(item, style), leftIndent=9) for item in items],
        bulletType="bullet",
        bulletChar="-",
        leftIndent=16,
        bulletFontName="Arial-Bold",
        bulletFontSize=8,
        bulletColor=TEAL,
        spaceAfter=3,
    )


def steps(items: list[tuple[str, str]]) -> Table:
    rows = []
    for index, (title, detail) in enumerate(items, start=1):
        rows.append(
            [
                p(str(index), "step_number"),
                p(f"<b>{title}</b><br/><font color='#5C6D7F'>{detail}</font>", "body"),
            ]
        )
    result = Table(rows, colWidths=[12 * mm, 151 * mm], hAlign="LEFT")
    result.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), TEAL),
                ("GRID", (0, 0), (-1, -1), 0.45, BORDER),
                ("ROWBACKGROUNDS", (1, 0), (1, -1), [WHITE, LIGHT]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return result


def callout(title: str, text: str, tone: str = "info") -> Table:
    palette = {
        "info": (SKY, TEAL),
        "success": (GREEN_BG, GREEN),
        "warning": (AMBER_BG, AMBER),
        "danger": (colors.HexColor("#FDECEC"), RED),
    }
    background, accent = palette[tone]
    result = Table(
        [[p(f"<b>{title}</b><br/>{text}", "body")]],
        colWidths=[163 * mm],
        hAlign="LEFT",
    )
    result.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 0.7, accent),
                ("LINEBEFORE", (0, 0), (0, -1), 4, accent),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return result


def stats(items: list[tuple[str, str]], columns: int = 4) -> Table:
    rows = []
    for index in range(0, len(items), columns):
        row = []
        for value, label in items[index : index + columns]:
            row.append(
                Table(
                    [[p(value, "stat_value")], [p(label, "stat_label")]],
                    colWidths=[38 * mm],
                    style=TableStyle(
                        [
                            ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
                            ("BOX", (0, 0), (-1, -1), 0.55, BORDER),
                            ("TOPPADDING", (0, 0), (-1, -1), 5),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                        ]
                    ),
                )
            )
        while len(row) < columns:
            row.append("")
        rows.append(row)
    return Table(
        rows,
        colWidths=[41 * mm] * columns,
        hAlign="LEFT",
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 2),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        ),
    )


def architecture_flow(labels: list[str]) -> Table:
    cells = []
    for index, label in enumerate(labels):
        cells.append(p(label, "center_bold"))
        if index < len(labels) - 1:
            cells.append(p(">", "center_bold"))
    widths = [28 * mm if index % 2 == 0 else 6 * mm for index in range(len(cells))]
    result = Table([cells], colWidths=widths, hAlign="CENTER")
    style = [
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]
    for index in range(0, len(cells), 2):
        style.extend(
            [
                ("BACKGROUND", (index, 0), (index, 0), SKY if index < len(cells) - 1 else GREEN_BG),
                ("BOX", (index, 0), (index, 0), 0.7, CYAN if index < len(cells) - 1 else GREEN),
            ]
        )
    result.setStyle(TableStyle(style))
    return result


def end_page(story: list, last: bool = False) -> None:
    if not last:
        story.append(PageBreak())


def page_decorator(document_label: str, title: str):
    def draw(canvas, doc) -> None:
        canvas.saveState()
        canvas.setTitle(title)
        canvas.setAuthor("OXIPUR ORIENTE S.R.L.")
        canvas.setCreator("OXIPUR Oriente Inventory Platform")
        canvas.setSubject(f"{document_label} - versión {VERSION}")
        width, height = A4
        if doc.page == 1:
            canvas.setFillColor(LIGHT)
            canvas.rect(0, 0, width, height, stroke=0, fill=1)
            canvas.setFillColor(CYAN)
            canvas.rect(0, 0, width, 7 * mm, stroke=0, fill=1)
            canvas.setFillColor(MUTED)
            canvas.setFont("Arial", 7)
            canvas.drawString(21 * mm, 12 * mm, f"Versión {VERSION} - {RELEASE_DATE}")
            canvas.drawRightString(width - 21 * mm, 12 * mm, "Uso interno")
        else:
            canvas.setFillColor(NAVY)
            canvas.rect(0, height - 19 * mm, width, 19 * mm, stroke=0, fill=1)
            canvas.setFillColor(WHITE)
            canvas.setFont("Arial-Bold", 8.2)
            canvas.drawString(18 * mm, height - 11.5 * mm, "OXIPUR ORIENTE S.R.L.")
            canvas.setFont("Arial", 7.2)
            canvas.drawRightString(width - 18 * mm, height - 11.5 * mm, f"{document_label} - v{VERSION}")
            canvas.setStrokeColor(CYAN)
            canvas.setLineWidth(1.2)
            canvas.line(18 * mm, height - 20.5 * mm, width - 18 * mm, height - 20.5 * mm)
            canvas.setStrokeColor(BORDER)
            canvas.setLineWidth(0.5)
            canvas.line(18 * mm, 15 * mm, width - 18 * mm, 15 * mm)
            canvas.setFillColor(MUTED)
            canvas.setFont("Arial", 6.8)
            canvas.drawString(18 * mm, 9.5 * mm, "Producción - Documento controlado")
            canvas.drawCentredString(width / 2, 9.5 * mm, DOMAIN)
            canvas.drawRightString(width - 18 * mm, 9.5 * mm, f"Página {doc.page}")
        canvas.restoreState()

    return draw


def build_document(path: Path, document_label: str, title: str, story: list) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=21 * mm,
        leftMargin=21 * mm,
        topMargin=27 * mm,
        bottomMargin=20 * mm,
        title=title,
        author="OXIPUR ORIENTE S.R.L.",
        subject=f"{document_label} - versión {VERSION}",
        creator="OXIPUR Oriente Inventory Platform",
    )
    decorator = page_decorator(document_label, title)
    doc.build(story, onFirstPage=decorator, onLaterPages=decorator)


def technical_story() -> list:
    story: list = []
    story.extend(
        cover(
            "Ficha técnica - Producción",
            "Especificaciones del sistema de gestión de inventario",
            "Arquitectura, datos, seguridad, continuidad operativa y alcance funcional "
            "de OXIPUR Oriente Inventory Platform.",
            [
                ("Sistema", "OXIPUR Oriente Inventory Platform"),
                ("Versión", "1.1.2 - Patch validado"),
                ("Dominio", DOMAIN),
                ("Estado", "Validado para despliegue"),
                ("Plataforma", "Web responsiva, API REST y MySQL"),
                ("Publicación", RELEASE_DATE),
            ],
            ["Datos persistentes", "HTTPS", "Auditoría", "Respaldo diario"],
        )
    )

    story += [
        section_header("01", "Identificación, objetivo y alcance"),
        p(
            "La plataforma centraliza usuarios, clientes, productos, cilindros, movimientos "
            "de inventario y notas de venta. Cada nota conserva por separado cilindros "
            "entregados y vacíos recibidos, incluso cuando ambos flujos ocurren en una misma operación."
        ),
        table(
            ["Campo", "Especificación"],
            [
                ["Nombre", "OXIPUR Oriente Inventory Platform"],
                ["Organización", "OXIPUR ORIENTE S.R.L."],
                ["Tipo", "Aplicación web de gestión operativa e inventario"],
                ["Versión documentada", "1.1.2 - Patch validado"],
                ["Dominio", DOMAIN],
                ["Zona horaria", "America/La_Paz (UTC-04:00)"],
                ["Fecha de corte", RELEASE_DATE],
                ["Repositorio", "GitHub - etiqueta v1.1.2, commit 76f0c99"],
            ],
            widths=[43 * mm, 120 * mm],
            compact=True,
        ),
        heading("Alcance incluido"),
        bullets(
            [
                "Usuarios con roles, credenciales seguras y presencia operativa.",
                "Clientes canónicos, alias históricos y control de duplicados.",
                "Maestro de cilindros, alta manual o confirmada desde una nota, productos y ubicación actual.",
                "Notas de venta con numeración automática, búsqueda combinable y detalle de entregas y recepciones.",
                "Movimientos trazables vinculados a la nota correspondiente.",
                "Impresión PDF, exportación Excel, auditoría y respaldos automáticos.",
            ]
        ),
        callout(
            "Persistencia",
            "La operación se escribe en MySQL sobre un volumen Docker persistente. "
            "Actualizar o reiniciar los contenedores no elimina la información.",
            "success",
        ),
    ]
    end_page(story)

    story += [
        section_header("02", "Arquitectura de solución"),
        p(
            "La solución utiliza una arquitectura web en capas. Frontend y backend se despliegan "
            "como servicios independientes; el dominio de negocio permanece como monolito modular "
            "para mantener consistencia transaccional y simplificar el mantenimiento."
        ),
        Spacer(1, 4),
        architecture_flow(["Navegador", "Caddy", "React", "Spring", "MySQL"]),
        Spacer(1, 7),
        table(
            ["Capa", "Componente", "Responsabilidad"],
            [
                ["Acceso", "Caddy 2", "HTTPS automático, redirección HTTP y cabeceras de seguridad."],
                ["Presentación", "React 19 + Nginx", "Interfaz web y proxy interno de /api."],
                ["Aplicación", "Spring Boot 4 / Java 21", "API REST, reglas, JWT, auditoría y migraciones."],
                ["Persistencia", "MySQL 8.0", "Datos operativos, relaciones, índices y transacciones."],
                ["Migraciones", "Liquibase", "Evolución reproducible y carga histórica."],
                ["Operación", "Docker Compose", "Redes, volúmenes, límites y reinicio automático."],
            ],
            widths=[30 * mm, 43 * mm, 90 * mm],
        ),
        heading("Topología de red"),
        bullets(
            [
                "Caddy publica únicamente TCP 80 y 443.",
                "Frontend expone 127.0.0.1:8080 solo para diagnóstico local.",
                "Backend y MySQL no publican puertos en internet.",
                "Nginx dirige /api al backend en el puerto interno 8083.",
                "La red app_internal impide acceso externo directo a la base de datos.",
            ]
        ),
        callout(
            "Flujo de solicitud",
            "Usuario > HTTPS/Caddy > Nginx/React > API Spring > MySQL. "
            "Las respuestas regresan por el mismo canal cifrado.",
        ),
    ]
    end_page(story)

    story += [
        section_header("03", "Tecnologías e infraestructura"),
        table(
            ["Componente", "Versión / familia", "Uso"],
            [
                ["Java", "21 LTS", "Runtime del backend."],
                ["Spring Boot", "4.0.6", "Web, seguridad, JPA, Actuator y Liquibase."],
                ["Maven", "3.9", "Compilación y dependencias."],
                ["React", "19.1", "Interfaz de usuario."],
                ["Vite", "6.x", "Construcción optimizada del frontend."],
                ["Nginx", "Alpine", "Archivos estáticos y proxy de API."],
                ["Caddy", "2.x", "TLS y HTTPS automático."],
                ["MySQL", "8.0.46 Bookworm", "Motor relacional de producción."],
                ["Docker Compose", "Plugin v2", "Orquestación de servicios."],
            ],
            widths=[36 * mm, 43 * mm, 84 * mm],
            compact=True,
        ),
        Spacer(1, 7),
        stats(
            [
                ("2 GB", "Memoria RAM"),
                ("2 GB", "Swap persistente"),
                ("40 GB", "Disco VPS"),
                ("1 TB", "Transferencia mensual"),
            ]
        ),
        heading("Servidor de producción"),
        table(
            ["Parámetro", "Configuración"],
            [
                ["Proveedor / plan", "Namecheap VPS Pulsar, autogestionado"],
                ["Sistema operativo", "Ubuntu Server 24.04.4 LTS, 64 bits"],
                ["Virtualización", "KVM"],
                ["Hostname", "server1.oxipur.net"],
                ["Directorio", "/opt/oxipur"],
                ["Reinicio", "unless-stopped en todos los servicios"],
                ["Logs", "Rotación Docker: 10 MB, máximo 3 archivos"],
                ["Recursos", "Límites por contenedor y swap de contingencia"],
            ],
            widths=[43 * mm, 120 * mm],
            compact=True,
        ),
        callout(
            "Dimensionamiento",
            "La capacidad actual es adecuada para una operación empresarial con concurrencia moderada. "
            "Debe monitorearse memoria, disco y tiempos de respuesta conforme crezca el uso.",
            "warning",
        ),
    ]
    end_page(story)

    story += [
        section_header("04", "Módulos y novedades funcionales"),
        table(
            ["Módulo", "Funciones principales", "Persistencia"],
            [
                ["Centro operativo", "Indicadores, alertas y movimientos recientes.", "Consultas agregadas"],
                ["Inventario", "Ubicación y disponibilidad de cilindros.", "cylinders, inventory_movements"],
                ["Clientes", "Alta, edición, normalización, posesión y alias.", "customers, customer_aliases"],
                ["Notas de venta", "Creación, numeración, detalle, edición y anulación.", "sales_notes y detalles"],
                ["Impresión", "Selección, importe total y PDF multipágina.", "Notas y plantilla PDF"],
                ["Utilidades", "Importes por período.", "sales_notes"],
                ["Cilindros", "Alta, edición, propietario, estado y ubicación.", "cylinders"],
                ["Productos", "Catálogo de gases.", "products"],
                ["Perfiles", "Usuarios, roles y actividad.", "user_profiles"],
                ["Auditoría", "Consulta administrativa de cambios.", "audit_logs"],
            ],
            widths=[32 * mm, 82 * mm, 49 * mm],
            compact=True,
        ),
        heading("Cambios acumulados hasta v1.1.2"),
        bullets(
            [
                "La consulta de notas admite filtros combinables por fecha, número de nota y cliente.",
                "Un cilindro desconocido nunca se incorpora silenciosamente: requiere confirmación explícita.",
                "Antes de confirmar se presenta una vista previa con movimiento, serie, producto, capacidad, propiedad y monto.",
                "Aceptar registra el cilindro y la nota en una sola transacción; rechazar no guarda ninguno de los dos.",
                "Un cilindro nuevo exige serie, capacidad mayor que cero y propietario.",
                "El propietario que comienza con OXIPUR se clasifica como empresa; los demás, como cliente.",
                "Operador y Administrador pueden acceder al catálogo de cilindros.",
                "La impresión consulta el detalle completo, muestra importe total y numera filas entre páginas.",
                "Los importes históricos se recalcularon desde las líneas entregadas.",
            ],
            compact=True,
        ),
        callout(
            "Regla central",
            "Una nota puede contener entregas y recepciones. La creación registra líneas, movimientos, "
            "ubicaciones, posibles cilindros nuevos y auditoría dentro de una misma transacción.",
            "success",
        ),
    ]
    end_page(story)

    story += [
        section_header("05", "Modelo de datos y trazabilidad"),
        architecture_flow(["customers", "sales_notes", "details", "movements", "cylinders"]),
        Spacer(1, 6),
        table(
            ["Tabla", "Responsabilidad"],
            [
                ["user_profiles", "Usuario, BCrypt, rol, actividad y estado."],
                ["audit_logs", "Actor, acción, datos anterior/nuevo, ruta, IP, origen y fecha."],
                ["customers", "Catálogo canónico de clientes."],
                ["customer_aliases", "Variantes históricas del cliente canónico."],
                ["sales_notes", "Cabecera, número, cliente, fecha, estado y totales."],
                ["sales_note_number_sequence", "Control transaccional del siguiente número automático."],
                ["sales_note_delivered_cylinders", "Cilindros entregados, producto, capacidad y monto."],
                ["sales_note_collected_cylinders", "Cilindros vacíos recibidos."],
                ["inventory_movements", "Movimiento individual de entrada o salida."],
                ["cylinders", "Serie, capacidad, propietario, estado y ubicación actual."],
                ["products / warehouses", "Productos y ubicaciones operativas."],
            ],
            widths=[61 * mm, 102 * mm],
            compact=True,
        ),
        heading("Controles de integridad"),
        bullets(
            [
                "Claves foráneas enlazan notas, cilindros, productos, clientes y almacenes.",
                "Unicidad en números de nota, series, usuarios, clientes normalizados y alias.",
                "Búsqueda de serie normalizada ignora espacios extremos y diferencias de mayúsculas.",
                "Liquibase es la autoridad del esquema; Hibernate lo valida.",
                "source_row_number conserva la correspondencia con el histórico importado.",
            ],
            compact=True,
        ),
    ]
    end_page(story)

    story += [
        section_header("06", "Migración histórica y calidad de datos"),
        p(
            "La carga inicial permanece integrada como migración Liquibase reproducible. "
            "La actualización v1.1 añadió el changeset 034 para recalcular total_amount desde "
            "las líneas de cilindros entregados. La v1.1.2 no modifica el esquema ni carga datos: "
            "su comportamiento se implementa en API e interfaz, conservando intacta la base existente."
        ),
        stats(
            [
                ("6.761", "Notas de venta"),
                ("9.045", "Movimientos"),
                ("5.678", "Entregados"),
                ("3.367", "Vacíos recibidos"),
                ("108", "Notas con ambos flujos"),
                ("157", "Clientes activos"),
                ("37", "Clientes fusionados"),
                ("64", "Alias registrados"),
            ]
        ),
        Spacer(1, 6),
        table(
            ["Comprobación de producción", "Resultado"],
            [
                ["Notas sin detalle", "0"],
                ["Movimientos sin nota", "0"],
                ["Filas históricas sin trazabilidad", "0"],
                ["Importaciones auditadas", "1"],
                ["Notas con importe inconsistente después de v1.1", "0"],
                ["Migraciones nuevas en v1.1.2", "0"],
                ["Migración 034 ejecutada", "1 vez - 27/07/2026 11:07:40"],
                ["Clientes totales verificados", "194"],
            ],
            widths=[115 * mm, 48 * mm],
        ),
        callout(
            "Tratamiento de duplicados",
            "Los nombres equivalentes se conservan como alias y apuntan a clientes canónicos. "
            "Las referencias históricas permanecen trazables después de la fusión.",
        ),
        callout(
            "Caso de control",
            "NV-006775 mantiene un movimiento RECIBIDO y otro ENTREGADO con cilindros, "
            "productos y capacidades correspondientes.",
            "success",
        ),
    ]
    end_page(story)

    story += [
        section_header("07", "Seguridad, acceso y auditoría"),
        table(
            ["Control", "Implementación"],
            [
                ["Transporte", "HTTPS automático con Caddy y redirección HTTP."],
                ["Cabeceras", "HSTS, X-Content-Type-Options, X-Frame-Options y Referrer-Policy."],
                ["Autenticación", "JWT firmado, emisor propio y vigencia de 1 hora."],
                ["Contraseñas", "BCrypt costo 12; nunca en texto plano."],
                ["Roles", "ADMINISTRADOR y OPERADOR con permisos diferenciados."],
                ["Cilindros", "Lectura y mantenimiento operativo para ambos roles."],
                ["Auditoría", "Actor, entidad, estado anterior/nuevo, IP, ruta, origen y fecha."],
                ["SSH", "Ed25519; root y autenticación por contraseña deshabilitados."],
                ["Firewall", "UFW: solo 22, 80 y 443."],
                ["Protección SSH", "Fail2ban activo."],
                ["Secretos", ".env.production, root:root, modo 600."],
            ],
            widths=[42 * mm, 121 * mm],
            compact=True,
        ),
        heading("Eventos auditados"),
        bullets(
            [
                "Creación manual o confirmada desde una nota, actualización y desactivación de cilindros.",
                "Creación, actualización y anulación de notas de venta.",
                "Altas y cambios de clientes, productos y perfiles.",
                "Importación histórica y normalización administrativa.",
            ]
        ),
        callout(
            "Protección de auditoría",
            "La API de auditoría es de solo consulta y está restringida al rol ADMINISTRADOR. "
            "No existe una operación web para modificar o borrar eventos.",
            "success",
        ),
    ]
    end_page(story)

    story += [
        section_header("08", "Continuidad operativa y validación"),
        table(
            ["Elemento", "Especificación"],
            [
                ["Frecuencia", "Diaria, alrededor de las 02:15 (America/La_Paz)."],
                ["Mecanismo", "systemd timer y mysqldump transaccional."],
                ["Formato", "SQL comprimido con gzip."],
                ["Integridad", "Validación gzip y archivo SHA-256."],
                ["Retención", "30 días en /opt/oxipur/backups."],
                ["Persistencia", "Volumen Docker oxipur_mysql_data."],
                ["Respaldo previo v1.1", "oxipur_inventory_20260727_110441.sql.gz"],
                ["Respaldo previo v1.1.2", "Obligatorio antes del despliegue"],
            ],
            widths=[48 * mm, 115 * mm],
        ),
        Spacer(1, 6),
        stats(
            [
                ("66/66", "Pruebas backend"),
                ("OK", "Build frontend"),
                ("3/3", "Servicios locales saludables"),
                ("OK", "API de estado"),
            ]
        ),
        heading("Evidencias de validación v1.1.2"),
        bullets(
            [
                "Compilación Maven y 66 pruebas sin fallos, errores ni omisiones.",
                "Build Vite de producción completado.",
                "MySQL, backend y frontend levantados en Docker con health checks saludables.",
                "GET /api/status respondió status ok en el entorno integral de validación.",
                "Pruebas específicas cubren filtros combinados y rechazo de cilindros sin confirmación.",
                "Docker Compose validado y paquete de publicación verificado con SHA-256.",
                "Commit 76f0c99 y etiqueta v1.1.2 publicados en el repositorio.",
            ],
            compact=True,
        ),
        callout(
            "Operación segura",
            "No ejecutar docker compose down --volumes en producción. Mantener una copia externa "
            "de respaldos y realizar pruebas de restauración trimestrales.",
            "warning",
        ),
    ]
    end_page(story)

    story += [
        section_header("09", "Referencia operativa y control documental"),
        table(
            ["Concepto", "Valor"],
            [
                ["URL de usuarios", DOMAIN],
                ["API base", "/api"],
                ["Estado técnico", "GET /api/status"],
                ["Siguiente nota", "GET /api/sales-notes/next-number"],
                ["Auditoría", "GET /api/audit-logs - solo ADMINISTRADOR"],
                ["Despliegue", "/opt/oxipur"],
                ["Compose", "docker-compose.production.yml"],
                ["Configuración privada", ".env.production - root:root, modo 600"],
                ["Respaldos", "/opt/oxipur/backups"],
                ["Temporizador", "oxipur-backup.timer"],
            ],
            widths=[52 * mm, 111 * mm],
            compact=True,
        ),
        heading("Comandos de comprobación"),
        table(
            ["Finalidad", "Comando"],
            [
                ["Servicios", "sudo docker compose --env-file .env.production -f docker-compose.production.yml ps"],
                ["API", "curl -fsS https://oxipur.net/api/status"],
                ["Logs", "sudo docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=100"],
                ["Respaldo", "sudo systemctl status oxipur-backup.timer --no-pager"],
                ["Ejecutar copia", "sudo /opt/oxipur/deploy/backup.sh"],
            ],
            widths=[34 * mm, 129 * mm],
            compact=True,
        ),
        heading("Historial de versión"),
        table(
            ["Versión", "Fecha", "Resumen"],
            [
                ["1.0", "23/07/2026", "Primera publicación productiva y migración histórica."],
                [
                    "1.1",
                    "27/07/2026",
                    "Alta automática de cilindros, acceso operativo al catálogo, importes corregidos e impresión completa.",
                ],
                [
                    "1.1.2",
                    "13/08/2026",
                    "Filtros por nota y cliente; confirmación, vista previa y bloqueo seguro para cilindros desconocidos.",
                ],
            ],
            widths=[24 * mm, 36 * mm, 103 * mm],
        ),
        Spacer(1, 7),
        callout(
            "Estado de entrega",
            "Versión 1.1.2 validada y empaquetada para producción. Su despliegue conserva la base histórica, "
            "los usuarios, los hashes de contraseña, la auditoría y el volumen persistente.",
            "success",
        ),
        table(
            ["Control", "Valor"],
            [
                ["Elaborado para", "OXIPUR ORIENTE S.R.L."],
                ["Documento", "Ficha técnica de especificaciones"],
                ["Versión", "1.1.2"],
                ["Clasificación", "Uso interno"],
            ],
            widths=[48 * mm, 115 * mm],
            compact=True,
        ),
    ]
    end_page(story, last=True)
    return story


def detailed_user_appendices(story: list) -> list:
    chapter_intro(
        story,
        "25",
        "Confirmación de cilindros no registrados",
        "TODOS",
        "Procedimiento completo de la v1.1.2 para decidir de forma segura si una serie nueva debe incorporarse.",
    )
    story += [
        heading("Cuándo aparece la ventana"),
        p(
            "La ventana aparece después de pulsar Crear nota cuando al menos una serie escrita no existe en el "
            "catálogo activo de cilindros. Antes de mostrarla, el sistema ya comprobó cliente, fecha, líneas, "
            "productos, capacidades, propietarios, importes y cilindros repetidos."
        ),
        table(
            ["Dato de la vista previa", "Qué debe comparar", "Riesgo que evita"],
            [
                ["Movimiento", "ENTREGADO o RECIBIDO según la sección utilizada.", "Invertir una salida y una devolución."],
                ["Cilindro", "Serie exacta grabada o pintada en el cilindro.", "Crear una serie duplicada por error de digitación."],
                ["Producto", "Gas seleccionado para la línea.", "Asignar un producto incorrecto."],
                ["Capacidad", "Volumen físico expresado en m3.", "Inventario con capacidad errónea."],
                ["Propiedad", "OXIPUR o nombre del propietario externo.", "Clasificación patrimonial incorrecta."],
                ["Monto", "Importe de una entrega; en recepción puede mostrarse guion.", "Total de venta incorrecto."],
            ],
            widths=[38 * mm, 72 * mm, 53 * mm],
            compact=True,
        ),
        heading("Si la información es correcta: elegir Sí"),
        steps(
            [
                ("Compare cada dato", "No confirme basándose únicamente en la serie."),
                ("Pulse Sí, agregar y crear nota", "El botón cambia a Registrando; espere sin volver a pulsarlo."),
                ("Espere el check verde", "Confirma que el cilindro y la nota se guardaron correctamente."),
                ("Abra Notas registradas", "Busque el número recién asignado y abra el detalle."),
                ("Revise Cilindros e Inventario", "Compruebe que la serie existe y quedó en la ubicación correspondiente."),
            ]
        ),
        heading("Si existe cualquier duda: elegir No"),
        steps(
            [
                ("Pulse No, cancelar", "No se incorpora la serie."),
                ("Observe la X roja", "Confirma que la nota tampoco fue creada."),
                ("Regrese al formulario", "Los datos permanecen disponibles para corregir la línea."),
                ("Corrija o elimine", "Cambie la serie, capacidad, propiedad o quite la fila."),
                ("Vuelva a crear", "Solo cuando toda la información esté verificada."),
            ]
        ),
        callout(
            "Garantía de consistencia",
            "El backend rechaza una nota que contenga una serie desconocida si no recibió confirmación. "
            "La interfaz no puede guardar la nota por accidente después de pulsar No. Si hay varias series nuevas, "
            "la ventana las muestra juntas y la decisión se aplica al conjunto; revise todas antes de aceptar.",
            "success",
        ),
    ]
    end_page(story)

    chapter_intro(
        story,
        "26",
        "Búsqueda avanzada de notas",
        "TODOS",
        "Utilice fecha, número y cliente por separado o al mismo tiempo para localizar rápidamente una operación.",
    )
    story += [
        heading("Principio de combinación"),
        p(
            "Los criterios se combinan con la regla Y. Por ejemplo, si selecciona agosto de 2026, escribe 675 en "
            "Número de nota y BETHEL en Cliente, solo aparecen notas que estén en agosto, contengan 675 en el "
            "número y contengan BETHEL en el nombre del cliente."
        ),
        table(
            ["Necesidad", "Fecha", "Número", "Cliente", "Acción"],
            [
                ["Conozco el número completo", "Sin filtro", "NV-006775", "Vacío", "Aplicar"],
                ["Conozco parte del número", "Sin filtro", "6775", "Vacío", "Aplicar"],
                ["Quiero todas las notas de un cliente", "Sin filtro", "Vacío", "BETHEL", "Aplicar"],
                ["Cliente durante un mes", "Mes / año", "Vacío", "BETHEL", "Aplicar"],
                ["Nota aproximada de un cliente", "Sin filtro", "67", "BETHEL", "Aplicar"],
                ["Volver a ver todo", "Cualquiera", "Cualquiera", "Cualquiera", "Limpiar"],
            ],
            widths=[48 * mm, 31 * mm, 29 * mm, 29 * mm, 26 * mm],
            compact=True,
        ),
        heading("Procedimiento recomendado"),
        steps(
            [
                ("Empiece con el dato más seguro", "Número completo si lo tiene; en caso contrario, cliente."),
                ("Pulse Aplicar", "Revise la cantidad de resultados antes de añadir más criterios."),
                ("Refine", "Agregue fecha o parte del otro campo si aparecen demasiadas notas."),
                ("Amplíe si no aparece", "Quite caracteres o seleccione Sin filtro en fecha."),
                ("Abra el detalle", "Verifique cliente, fecha, líneas, estado y origen; no se base solo en la fila."),
            ]
        ),
        heading("Cómo interpretar una búsqueda vacía"),
        bullets(
            [
                "Revise que el año no haya quedado en un valor diferente al esperado.",
                "Pruebe una parte distintiva del cliente en lugar del nombre completo.",
                "Quite el prefijo NV- o ceros iniciales si no recuerda el formato exacto.",
                "Pulse Limpiar y repita con un solo criterio para identificar cuál estaba restringiendo la consulta.",
                "Confirme si la nota fue anulada: las anuladas siguen visibles y llevan su estado correspondiente.",
            ]
        ),
        callout("Tecla Enter", "En Número de nota o Cliente puede pulsar Enter para ejecutar la misma búsqueda que Aplicar."),
    ]
    end_page(story)

    chapter_intro(
        story,
        "27",
        "Escenarios completos de registro",
        "TODOS",
        "Tres recorridos prácticos desde la preparación física hasta la comprobación en el sistema.",
    )
    story += [
        heading("Escenario A: entregar un cilindro ya registrado"),
        steps(
            [
                ("Verifique la serie física", "Léala directamente del cilindro."),
                ("Consulte Inventario", "Confirme que la serie está activa y disponible en PLANTA."),
                ("Abra Crear nota", "Revise número automático, cliente y fecha."),
                ("Complete Entregados", "Serie, producto y monto; capacidad y propiedad se recuperan del catálogo."),
                ("Revise el resumen", "Debe mostrar una entrega y el total correcto."),
                ("Cree la nota", "No debe aparecer confirmación de alta si la serie existe."),
                ("Compruebe", "La nota aparece registrada y el cilindro queda con el cliente."),
            ]
        ),
        heading("Escenario B: recibir un vacío ya registrado"),
        steps(
            [
                ("Consulte el cliente", "Compruebe que actualmente posee la serie."),
                ("Abra Crear nota", "Complete cliente y fecha real de recepción."),
                ("Complete Recogidos", "Serie, producto si aplica y observación RECIBIDO VACÍO."),
                ("Cree la nota", "Espere confirmación."),
                ("Compruebe", "La serie queda en PLANTA y existe un movimiento RECIBIDO."),
            ]
        ),
        PageBreak(),
        section_header("27B", "Escenario combinado: entrega y recepción", "TODOS"),
        p("Continuación del capítulo 27. Use una sola nota cuando la entrega y la devolución pertenecen al mismo documento físico."),
        steps(
            [
                ("Complete la cabecera una vez", "El cliente y la fecha aplican a ambos movimientos."),
                ("Agregue las entregas", "Una fila por cilindro lleno que sale."),
                ("Agregue las recepciones", "Una fila por vacío que regresa."),
                ("Evite repetir series", "Una misma serie no puede figurar en ambos bloques."),
                ("Revise ambos conteos", "La vista previa separa entregados y recogidos."),
                ("Guarde y abra el detalle", "Deben verse ambos bloques vinculados al mismo número de nota."),
            ]
        ),
        callout("Documento central", "Nunca cree una nota separada por comodidad si entrega y recepción pertenecen al mismo documento físico."),
    ]
    end_page(story)

    chapter_intro(
        story,
        "28",
        "Validaciones y recuperación sin perder datos",
        "TODOS",
        "Qué significa cada bloqueo y cuál es la corrección segura antes de volver a intentar.",
    )
    story += [
        table(
            ["Validación", "Por qué bloquea", "Corrección segura", "Qué se guardó"],
            [
                ["Cliente vacío", "La nota necesita titular.", "Escriba o seleccione un cliente.", "Nada"],
                ["Sin líneas", "No existe movimiento que registrar.", "Agregue entrega o recepción.", "Nada"],
                ["Producto faltante", "Toda entrega debe identificar producto.", "Seleccione un producto activo.", "Nada"],
                ["Capacidad inválida", "Una serie nueva necesita volumen mayor que cero.", "Revise el valor físico.", "Nada"],
                ["Propiedad vacía", "No puede clasificarse el cilindro.", "Indique OXIPUR o propietario externo.", "Nada"],
                ["Serie repetida", "Un cilindro no puede moverse dos veces en una nota.", "Quite o corrija una fila.", "Nada"],
                ["Serie inactiva", "El catálogo la excluye de nuevas operaciones.", "Revise Cilindros con un responsable.", "Nada"],
                ["X roja", "El usuario rechazó el alta.", "Corrija o quite la serie.", "Nada"],
                ["Check verde", "La transacción terminó correctamente.", "Solo verificar el resultado.", "Nota, cilindro y movimientos"],
            ],
            widths=[36 * mm, 47 * mm, 52 * mm, 28 * mm],
            compact=True,
        ),
        heading("Si la conexión se interrumpe al guardar"),
        steps(
            [
                ("No vuelva a pulsar inmediatamente", "Evite producir un segundo intento mientras desconoce el resultado."),
                ("Abra Notas registradas", "Busque por cliente, fecha y el número que estaba visible."),
                ("Si aparece", "Abra el detalle y continúe; el registro fue exitoso."),
                ("Si no aparece", "Revise Inventario y Cilindros para confirmar que no hubo cambio."),
                ("Solo entonces reintente", "Use el formulario conservado o vuelva a completar la operación."),
            ]
        ),
        callout(
            "Atomicidad",
            "La creación usa una transacción: ante un error del servidor no debe quedar media nota con líneas o movimientos incompletos.",
            "success",
        ),
    ]
    end_page(story)

    chapter_intro(
        story,
        "29",
        "Comprobación posterior y correcciones",
        "TODOS",
        "Una confirmación exitosa debe verificarse en nota, inventario y movimientos antes de imprimir.",
    )
    story += [
        heading("Comprobación mínima después de crear"),
        table(
            ["Lugar", "Qué revisar", "Resultado esperado"],
            [
                ["Notas registradas", "Número, cliente, fecha, total y estado.", "REGISTRADA y datos correctos."],
                ["Detalle de nota", "Entregados, recibidos, series, producto, propiedad y monto.", "Coincide con documento físico."],
                ["Inventario", "Ubicación de las series críticas.", "Entregados en CLIENTE; recibidos en PLANTA."],
                ["Clientes", "Cilindros actualmente en poder del cliente.", "Posesión actualizada."],
                ["Centro operativo", "Movimiento reciente y alertas.", "Movimiento visible tras actualizar."],
                ["Cilindros", "Serie nueva autorizada.", "Activa, con capacidad y propietario correctos."],
            ],
            widths=[38 * mm, 67 * mm, 58 * mm],
            compact=True,
        ),
        heading("Elegir la corrección adecuada"),
        table(
            ["Error detectado", "Acción permitida"],
            [
                ["Cliente, fecha, utilidad u observación general", "Editar la nota desde Notas registradas."],
                ["Serie, producto, capacidad, propiedad o línea equivocada", "Anular la nota y crear una nueva correcta."],
                ["Nota duplicada", "Comprobar ambos detalles y anular la incorrecta."],
                ["Cilindro nuevo con datos maestros erróneos", "Corregir el cilindro y evaluar si la nota también debe anularse."],
                ["Impresión equivocada", "Corregir primero el registro; después generar un PDF nuevo."],
            ],
            widths=[72 * mm, 91 * mm],
        ),
        callout(
            "Nunca oculte una corrección",
            "Anular conserva el historial y genera compensaciones. No solicite borrar directamente una nota o sus movimientos de la base de datos.",
            "warning",
        ),
    ]
    end_page(story)

    chapter_intro(
        story,
        "30",
        "Permanencia, sincronización y publicación",
        "TODOS",
        "Diferencie el código de la aplicación, la base local y la base de producción.",
    )
    story += [
        table(
            ["Elemento", "Dónde está", "Qué contiene", "Se actualiza automáticamente"],
            [
                ["Código local", "Computadora de desarrollo", "Pantallas, reglas y configuración versionada.", "No afecta la web hasta desplegar."],
                ["Base local", "Entorno de desarrollo", "Datos usados al probar en 127.0.0.1.", "No se sincroniza con producción."],
                ["Código productivo", "VPS /opt/oxipur", "Versión publicada de frontend y backend.", "Cambia al desplegar un paquete."],
                ["Base productiva", "Volumen MySQL del VPS", "Usuarios, clientes, notas, movimientos y cilindros reales.", "Sí, con cada operación web."],
                ["Respaldos", "VPS /opt/oxipur/backups", "Copias SQL comprimidas e integridad SHA-256.", "Diariamente por temporizador."],
            ],
            widths=[31 * mm, 36 * mm, 61 * mm, 35 * mm],
            compact=True,
        ),
        heading("Consecuencias prácticas"),
        bullets(
            [
                "La computadora personal puede apagarse: la web y MySQL siguen funcionando en el VPS.",
                "Cambiar código en Visual Studio Code no modifica oxipur.net hasta realizar el despliegue.",
                "Los usuarios y contraseñas no viajan dentro del paquete; permanecen en la base productiva.",
                "Las contraseñas se almacenan como hash, no pueden leerse como texto desde el código.",
                "Actualizar contenedores no borra el volumen MySQL; aun así, siempre debe hacerse un respaldo previo.",
                "Nunca ejecutar down --volumes en producción, porque elimina volúmenes persistentes.",
            ]
        ),
        callout("Mantenimiento del proveedor", "Si SSH y HTTPS no responden durante un mantenimiento, espere. No cambie DNS, firewall ni reinstale el VPS sin diagnóstico.", "warning"),
    ]
    end_page(story)

    chapter_intro(
        story,
        "31",
        "Seguridad y administración de usuarios",
        "ADMIN / TODOS",
        "Responsabilidades del Administrador y hábitos obligatorios de cada usuario.",
    )
    story += [
        heading("Alta y entrega de una cuenta"),
        steps(
            [
                ("Identifique a la persona", "Cree una cuenta individual; no use nombres genéricos compartidos."),
                ("Asigne el rol mínimo", "Operador para tareas diarias; Administrador solo si necesita funciones administrativas."),
                ("Defina una contraseña temporal", "No la escriba en el manual, código, chat público o captura."),
                ("Entregue por canal seguro", "Comuníquela directamente a su titular."),
                ("Pruebe el acceso", "El titular debe ingresar y confirmar los módulos visibles."),
                ("Documente el responsable", "Mantenga un registro empresarial separado de las credenciales."),
            ]
        ),
        heading("Cambio o recuperación de contraseña"),
        bullets(
            [
                "Una contraseña existente no puede recuperarse en texto porque se almacena mediante BCrypt.",
                "Si se olvida, el Administrador asigna una nueva desde Perfiles.",
                "Después del cambio, pruebe el acceso en oxipur.net y cierre la sesión anterior.",
                "Un cambio realizado solo en la base local no modifica la cuenta productiva.",
                "No reutilice la misma contraseña del VPS, correo, Namecheap o llave SSH.",
            ]
        ),
        heading("Retiro de acceso"),
        steps(
            [
                ("Localice el perfil", "Compruebe nombre y usuario antes de actuar."),
                ("Desactive o elimine el acceso", "El historial y la auditoría permanecen."),
                ("Verifique", "La persona ya no debe poder iniciar una sesión nueva."),
                ("No borre auditoría", "Los actos históricos deben conservar su actor."),
            ]
        ),
        callout("Responsabilidad", "Cada acción sensible queda asociada al usuario autenticado. Compartir cuentas elimina la trazabilidad personal.", "warning"),
    ]
    end_page(story)

    chapter_intro(
        story,
        "32",
        "Listas de comprobación, preguntas y glosario",
        "TODOS",
        "Referencia final para trabajo diario, soporte y capacitación de nuevos usuarios.",
    )
    story += [
        heading("Inicio de jornada"),
        bullets(
            [
                "Ingrese por https://oxipur.net y confirme su nombre y rol.",
                "Abra Centro operativo y compruebe que los indicadores cargan.",
                "Verifique que la fecha y hora de la computadora sean correctas.",
                "Antes de registrar, tenga a mano nota física, cliente, series, productos, capacidades y montos.",
            ]
        ),
        heading("Fin de jornada"),
        bullets(
            [
                "Compruebe las últimas notas registradas y cualquier anulación realizada.",
                "Revise movimientos e inventario de operaciones excepcionales.",
                "Descargue los informes requeridos por el procedimiento interno.",
                "Pulse Salir y cierre la pestaña, especialmente en equipos compartidos.",
            ]
        ),
        heading("Preguntas frecuentes"),
        table(
            ["Pregunta", "Respuesta"],
            [
                ["¿Puedo buscar sin fecha?", "Sí. Elija Sin filtro y use número, cliente o ambos."],
                ["¿Puedo escribir solo parte del cliente?", "Sí. La búsqueda acepta coincidencias parciales."],
                ["¿Qué ocurre al pulsar No para un cilindro nuevo?", "No se crea el cilindro y tampoco la nota."],
                ["¿Puedo corregir las líneas de una nota?", "No directamente: anule y cree una nota correcta."],
                ["¿Cerrar el navegador borra datos?", "No. Todo lo confirmado permanece en MySQL del VPS."],
                ["¿Mi computadora debe quedar encendida?", "No. El servidor funciona independientemente."],
                ["¿Actualizar la web borra usuarios?", "No si se mantiene el volumen; se realiza respaldo antes del despliegue."],
            ],
            widths=[72 * mm, 91 * mm],
            compact=True,
        ),
        heading("Glosario esencial"),
        table(
            ["Término", "Definición"],
            [
                ["Nota registrada", "Documento activo cuyos movimientos afectan la ubicación actual."],
                ["Nota anulada", "Documento conservado con movimientos compensatorios."],
                ["Entregado", "Cilindro que sale de PLANTA hacia un cliente."],
                ["Recibido / recogido", "Cilindro que regresa desde un cliente a PLANTA."],
                ["Serie", "Identificador único del cilindro."],
                ["Propiedad", "Titular patrimonial: OXIPUR o tercero."],
                ["Origen SCRIPT", "Dato proveniente de la migración histórica."],
                ["Origen USER", "Dato registrado mediante la aplicación web."],
                ["Hash", "Representación irreversible utilizada para proteger contraseñas."],
            ],
            widths=[45 * mm, 118 * mm],
            compact=True,
        ),
        callout(
            "Solicitud de soporte",
            "Indique módulo, usuario, fecha y hora, número de nota o serie, pasos realizados y texto exacto del mensaje. "
            "Adjunte una captura solo si no contiene contraseñas, tokens ni claves.",
        ),
    ]
    end_page(story, last=True)
    return story


def chapter_intro(story: list, number: str, title: str, audience: str, intro: str) -> None:
    story.extend([section_header(number, title, audience), p(intro)])


def user_story() -> list:
    story: list = []
    story.extend(
        cover(
            "Manual de usuario - Producción",
            "Guía completa de uso del sistema",
            "Procedimientos paso a paso para consultar inventario, registrar notas, "
            "imprimir documentos y administrar catálogos y perfiles.",
            [
                ("Sistema", "OXIPUR Oriente Inventory Platform"),
                ("Versión", "1.1.2 - Patch validado"),
                ("Sitio", DOMAIN),
                ("Usuarios", "Administrador y Operador"),
                ("Cobertura", "Todas las funciones visibles"),
                ("Actualización", RELEASE_DATE),
            ],
            ["Paso a paso", "Datos permanentes", "Roles", "Solución de problemas"],
        )
    )

    chapter_intro(story, "01", "Cómo usar esta guía", "TODOS", "Cada capítulo corresponde a una opción del menú o a una acción frecuente.")
    story += [
        table(
            ["Bloque", "Capítulos", "Contenido"],
            [
                ["Acceso", "02-03", "Ingreso, sesión, navegación y controles."],
                ["Consulta", "04-07", "Centro operativo, filtros, inventario y clientes."],
                ["Notas de venta", "08-16", "Creación, detalle, edición, impresión y Excel."],
                ["Administración", "17-21", "Utilidades, cilindros, productos y perfiles."],
                ["Ayuda", "22-24", "Perfil, mensajes, prácticas y referencia."],
                ["Guía avanzada", "25-32", "Confirmaciones, escenarios, recuperación, seguridad, preguntas y glosario."],
            ],
            widths=[37 * mm, 28 * mm, 98 * mm],
        ),
        heading("Novedades de la versión 1.1.2"),
        bullets(
            [
                "Búsqueda de notas por número, cliente y fecha, de forma individual o combinada.",
                "Confirmación obligatoria antes de incorporar un cilindro desconocido.",
                "Vista previa completa del cilindro y respuesta visual verde o roja según la decisión.",
                "Capacidad y propiedad obligatorias para cilindros nuevos.",
                "Catálogo de cilindros visible para Administrador y Operador.",
                "Importe total visible en Impresión y PDF con detalle completo.",
                "Numeración continua en notas impresas de varias páginas.",
            ]
        ),
        callout("Convenciones", "TODOS: Administrador y Operador. ADMIN: solo Administrador. ADMIN / OPERADOR: función operativa compartida."),
        callout("Datos permanentes", "Una acción termina solamente cuando aparece su confirmación. Cerrar el navegador después de confirmar no elimina lo guardado.", "success"),
    ]
    end_page(story)

    chapter_intro(story, "02", "Ingresar y cerrar sesión", "TODOS", "Utilice únicamente las credenciales asignadas por la empresa.")
    story += [
        heading("Cómo ingresar"),
        steps(
            [
                ("Abra el sistema", f"En el navegador ingrese a {DOMAIN}."),
                ("Escriba el usuario", "Use exactamente el nombre asignado."),
                ("Escriba la contraseña", "El campo la oculta mientras escribe."),
                ("Pulse Ingresar", "Espere la bienvenida y el Centro operativo."),
            ]
        ),
        heading("Perfil y cierre de sesión"),
        steps(
            [
                ("Consultar su sesión", "Pulse el nombre o abra Perfil."),
                ("Terminar el trabajo", "Pulse Salir en la esquina superior derecha."),
                ("Equipo compartido", "Cierre también la pestaña del navegador."),
            ]
        ),
        callout("Seguridad", "No comparta credenciales. El sistema registra qué usuario realizó cada acción sensible.", "warning"),
        callout("Sesión expirada", "La sesión dura un tiempo limitado. Si expira, vuelva a ingresar; los datos ya confirmados permanecen guardados."),
    ]
    end_page(story)

    chapter_intro(story, "03", "Navegación y controles comunes", "TODOS", "La aplicación utiliza menú lateral, encabezado y un área central de trabajo.")
    story += [
        architecture_flow(["Menú", "Página", "Formulario", "Tabla", "Detalle"]),
        Spacer(1, 6),
        table(
            ["Elemento", "Cómo se usa"],
            [
                ["Menú lateral", "Pulse una opción. Notas de venta despliega subopciones."],
                ["Encabezado", "Muestra página, sesión activa y Salir."],
                ["Aplicar", "Ejecuta el filtro seleccionado."],
                ["Limpiar", "Restablece filtros y vuelve a consultar."],
                ["Actualizar", "Recarga los datos guardados."],
                ["Lápiz", "Edita el registro."],
                ["Papelera", "Anula o desactiva según el módulo."],
                ["Ojo / fila", "Abre el detalle."],
                ["X / Escape", "Cierra una ventana sin guardar cambios pendientes."],
            ],
            widths=[43 * mm, 120 * mm],
            compact=True,
        ),
        heading("Opciones según rol"),
        table(
            ["Módulos compartidos", "Solo Administrador"],
            [["Centro operativo, Inventario, Clientes, Notas, Impresión, Cilindros y Perfil.", "Utilidades, Productos, Perfiles y Auditoría."]],
            widths=[82 * mm, 81 * mm],
        ),
        callout("Actualización de pantalla", "Después de una publicación use Ctrl + F5 si el navegador conserva una versión anterior."),
    ]
    end_page(story)

    chapter_intro(story, "04", "Centro operativo", "TODOS", "Resumen rápido del estado actual de cilindros, clientes y movimientos.")
    story += [
        table(
            ["Indicador", "Significado"],
            [
                ["En PLANTA", "Cilindros cuya ubicación actual es la planta."],
                ["En clientes", "Cilindros fuera de planta."],
                ["Clientes con cilindros", "Clientes que actualmente poseen cilindros."],
                ["Productos activos", "Productos disponibles en nuevas notas."],
                ["Alertas", "Cilindros OXIPUR fuera de planta, sin ubicación y movimientos."],
                ["Movimientos recientes", "Últimos cinco movimientos del período."],
            ],
            widths=[48 * mm, 115 * mm],
        ),
        heading("Consultar movimientos recientes"),
        steps(
            [
                ("Abra Centro operativo", "Es la pantalla inicial después de ingresar."),
                ("Seleccione el período", "Día, mes, año o sin filtro."),
                ("Pulse Aplicar", "Se actualizan tarjetas y movimientos."),
                ("Revise el movimiento", "Compruebe estado, serie, nota, cliente y fecha."),
            ]
        ),
        callout("Lectura operativa", "Los indicadores se calculan desde los datos guardados; no son valores escritos manualmente.", "success"),
    ]
    end_page(story)

    chapter_intro(story, "05", "Filtros por día, mes o año", "TODOS", "El mismo control aparece en movimientos, notas registradas, exportación y utilidades.")
    story += [
        table(
            ["Tipo", "Campos requeridos", "Resultado"],
            [
                ["Sin filtro", "Ninguno", "Toda la información disponible."],
                ["Día", "Fecha", "Registros de la fecha elegida."],
                ["Mes", "Mes y año", "Registros del mes completo."],
                ["Año", "Año", "Registros de enero a diciembre."],
            ],
            widths=[35 * mm, 48 * mm, 80 * mm],
        ),
        heading("Aplicar un filtro"),
        steps(
            [
                ("Elija Tipo de fecha", "Día, Mes o Año."),
                ("Complete los campos", "No deje fecha, mes o año vacío."),
                ("Pulse Aplicar", "La tabla se actualiza."),
                ("Verifique el período", "Confirme que corresponde a la búsqueda."),
                ("Pulse Limpiar", "Vuelve al estado sin filtro."),
            ]
        ),
        callout("Sin resultados", "Compruebe el año, limpie los filtros y confirme la fecha real de la operación.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "06", "Consultar el inventario", "TODOS", "Busque cilindros por ubicación, cliente o número de serie.")
    story += [
        steps(
            [
                ("Abra Inventario", "Use el menú lateral."),
                ("Elija Ubicación", "Todas, PLANTA o CLIENTE."),
                ("Escriba Cliente", "Opcional; puede combinarse con CLIENTE."),
                ("Escriba Serie", "Opcional; use el número físico del cilindro."),
                ("Pulse Buscar", "Se mostrarán coincidencias."),
            ]
        ),
        heading("Información mostrada"),
        table(
            ["Dato", "Interpretación"],
            [
                ["Serie", "Identificación única del cilindro."],
                ["Capacidad", "Volumen nominal en m3."],
                ["Propietario", "OXIPUR o tercero/cliente."],
                ["Ubicación", "PLANTA, CLIENTE o situación registrada."],
                ["Cliente actual", "Poseedor cuando está fuera de planta."],
                ["Fecha / observación", "Última actualización de ubicación."],
            ],
            widths=[45 * mm, 118 * mm],
        ),
        callout("Trazabilidad", "La ubicación se actualiza mediante notas y movimientos. No se corrige escribiéndola directamente.", "success"),
    ]
    end_page(story)

    chapter_intro(story, "07", "Consultar clientes", "TODOS", "Directorio canónico de clientes y cilindros que actualmente tienen en su poder.")
    story += [
        stats([("194", "Registros verificados"), ("157", "Clientes activos históricos"), ("37", "Registros fusionados"), ("64", "Alias históricos")]),
        heading("Ver el detalle"),
        steps(
            [
                ("Abra Clientes", "La lista aparece ordenada alfabéticamente."),
                ("Pulse Actualizar", "Consulta nuevamente la posesión actual."),
                ("Seleccione un cliente", "Abra la tarjeta o fila correspondiente."),
                ("Revise cilindros", "Compruebe serie, capacidad, producto y ubicación."),
            ]
        ),
        heading("Nombres y alias"),
        bullets(
            [
                "Use las sugerencias del formulario para no crear duplicados.",
                "Las variantes históricas apuntan al cliente canónico.",
                "Un cliente nuevo puede crearse automáticamente al guardar una nota.",
                "Revise ortografía antes de aceptar un nombre no detectado.",
            ]
        ),
        callout("Importante", "Fusionar clientes es una tarea administrativa de datos. No elimine un nombre solo porque parezca duplicado.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "08", "Flujo de una nota de venta", "TODOS", "Las notas conectan clientes, cilindros, productos, movimientos e inventario.")
    story += [
        architecture_flow(["Cabecera", "Entregados", "Recogidos", "Vista previa", "Guardar"]),
        Spacer(1, 6),
        table(
            ["Contenido", "Efecto automático"],
            [
                ["Número de nota", "El sistema propone el siguiente consecutivo NV."],
                ["Cilindro entregado", "Salida PLANTA a CLIENTE y nueva ubicación."],
                ["Cilindro recogido", "Entrada CLIENTE a PLANTA."],
                ["Cilindro desconocido", "Solicita confirmación y muestra una vista previa antes de guardar."],
                ["Monto por entrega", "Se suma al Total venta."],
                ["Cliente nuevo", "Se crea o se resuelve mediante alias."],
                ["Toda la nota", "Guarda detalle, movimientos y auditoría."],
            ],
            widths=[48 * mm, 115 * mm],
        ),
        heading("Reglas esenciales"),
        bullets(
            [
                "Debe existir al menos una entrega o recepción.",
                "El mismo cilindro no puede repetirse dentro de la nota.",
                "Las entregas requieren producto.",
                "Un cilindro nuevo requiere capacidad, propiedad y confirmación explícita.",
                "Un cilindro inactivo no puede utilizarse.",
                "Una nota puede contener ambos tipos de movimiento.",
            ],
            compact=True,
        ),
    ]
    end_page(story)

    chapter_intro(story, "09", "Crear nota: datos generales", "TODOS", "Abra Notas de venta y seleccione Crear nota de venta.")
    story += [
        table(
            ["Campo", "Obligatorio", "Cómo completarlo"],
            [
                ["Número", "Sí / automático", "Se asigna y muestra bloqueado. No se escribe manualmente."],
                ["Cliente", "Sí", "Use una sugerencia o revise cuidadosamente un nombre nuevo."],
                ["Fecha", "Sí", "Fecha y hora real de la operación."],
                ["Utilidad (Bs)", "No", "Monto administrativo opcional."],
                ["Observación", "No", "Comentario general de la nota."],
            ],
            widths=[35 * mm, 32 * mm, 96 * mm],
        ),
        steps(
            [
                ("Revise el número", "Debe aparecer automáticamente como NV-xxxxxx."),
                ("Escriba el cliente", "El texto se normaliza en mayúsculas."),
                ("Acepte una sugerencia", "Pulse la sugerencia, Tab o flecha derecha."),
                ("Revise fecha y hora", "El sistema propone la actual; corríjala si corresponde."),
                ("Complete lo opcional", "Utilidad y observación pueden quedar vacías."),
            ]
        ),
        callout("Numeración automática", "No modifique el número ni intente reutilizar uno anterior. Al guardar, el servidor valida el consecutivo y evita duplicados.", "success"),
        callout("Cliente no detectado", "Puede continuar si realmente es nuevo. Revise ortografía para no generar duplicados.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "10", "Crear nota: cilindros entregados", "TODOS", "Registre los cilindros llenos que salen de PLANTA hacia el cliente.")
    story += [
        table(
            ["Campo", "Cilindro existente", "Cilindro nuevo"],
            [
                ["Nro. cilindro", "Obligatorio; muestra Cilindro ya existe.", "Obligatorio; avisa que requiere confirmación."],
                ["Producto", "Obligatorio.", "Obligatorio."],
                ["Capacidad (m3)", "Se completa; puede ajustarse en la línea.", "Obligatoria y mayor que cero."],
                ["Monto (Bs)", "Opcional; suma al total.", "Opcional; suma al total."],
                ["Propiedad", "Se completa desde catálogo.", "Obligatoria: OXIPUR o tercero."],
                ["Observación", "Opcional.", "Opcional."],
            ],
            widths=[34 * mm, 64 * mm, 65 * mm],
            compact=True,
        ),
        steps(
            [
                ("Escriba la serie", "Confirme si existe; si es nueva, la pantalla advierte que solicitará autorización."),
                ("Seleccione producto", "Solo aparecen productos activos."),
                ("Complete datos nuevos", "Si no existe, ingrese capacidad y propiedad."),
                ("Ingrese monto", "El sistema lo suma al Total venta."),
                ("Agregue o quite líneas", "Use Agregar línea o la X de cada fila."),
            ]
        ),
        callout("Alta confirmada", "Un cilindro nuevo solo se crea cuando el usuario acepta la ventana de confirmación. La creación del cilindro, su movimiento y la nota forman una sola operación.", "success"),
    ]
    end_page(story)

    chapter_intro(story, "11", "Crear nota: cilindros recogidos", "TODOS", "Registre cilindros vacíos que regresan del cliente a PLANTA.")
    story += [
        table(
            ["Campo", "Uso"],
            [
                ["Nro. cilindro", "Obligatorio. Si no existe, requiere confirmación antes de registrarse."],
                ["Producto", "Opcional para una recepción vacía."],
                ["Capacidad (m3)", "Automática si existe; obligatoria si es nuevo."],
                ["Propiedad", "Automática si existe; obligatoria si es nuevo."],
                ["Observación", "Use RECIBIDO VACÍO u otro detalle aplicable."],
            ],
            widths=[45 * mm, 118 * mm],
        ),
        steps(
            [
                ("Escriba la serie", "Revise el mensaje de cilindro existente o pendiente de confirmación."),
                ("Complete capacidad y propiedad", "Solo son obligatorias para uno nuevo."),
                ("Seleccione producto si aplica", "Puede quedar vacío en una recepción."),
                ("Añada observación", "Identifique el estado de devolución."),
                ("Agregue o quite líneas", "Use los controles del encabezado y la fila."),
            ]
        ),
        callout("Efecto en inventario", "Al crear la nota, el cilindro recogido queda en PLANTA y se registra un movimiento de Recogida.", "success"),
        callout("Una nota, dos movimientos", "Puede entregar un cilindro y recibir otro vacío en la misma nota. Complete ambas secciones antes de guardar."),
    ]
    end_page(story)

    chapter_intro(story, "12", "Validar, previsualizar y guardar", "TODOS", "Revise toda la nota antes de pulsar Crear nota.")
    story += [
        table(
            ["Comprobación", "Resultado esperado"],
            [
                ["Número y cliente", "Número automático visible y cliente correcto."],
                ["Fecha", "Corresponde a la operación."],
                ["Entregas", "Serie, producto, capacidad, propiedad y monto correctos."],
                ["Recepciones", "Serie, capacidad, propiedad y observación correctas."],
                ["Cilindro nuevo", "Capacidad y propiedad completas."],
                ["Duplicados", "Ningún cilindro aparece dos veces."],
                ["Vista previa", "Conteos, capacidades y Total venta coinciden."],
            ],
            widths=[48 * mm, 115 * mm],
            compact=True,
        ),
        steps(
            [
                ("Revise la vista previa", "Separa entregados de recogidos."),
                ("Pulse Crear nota", "Si todos existen, espere Nota de venta registrada; si falta alguno, revise la confirmación."),
                ("No pulse dos veces", "Aguarde la primera respuesta."),
                ("Abra Notas registradas", "Localice la nota y revise el detalle."),
                ("Compruebe Inventario", "Verifique una ubicación crítica si es necesario."),
            ]
        ),
        callout("Guardado permanente", "El check verde confirma que nota, líneas, movimientos, cilindros autorizados, ubicaciones y auditoría quedaron almacenados en la base de datos.", "success"),
        callout("Errores frecuentes", "Producto faltante en una entrega, capacidad o propiedad faltante en un cilindro nuevo, serie inactiva o cilindro repetido.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "13", "Notas registradas y detalle", "TODOS", "Consulte notas actuales e históricas, incluidas las importadas desde Excel.")
    story += [
        table(
            ["Criterio", "Cómo funciona", "Ejemplo"],
            [
                ["Fecha", "Día, mes, año o sin filtro.", "Mes: agosto de 2026"],
                ["Número de nota", "Busca coincidencias parciales, sin exigir el número completo.", "675 busca NV-006750 y similares"],
                ["Cliente", "Busca una parte del nombre sin distinguir mayúsculas.", "BETHEL encuentra CLINICA BETHEL"],
                ["Combinación", "Todos los criterios escritos deben cumplirse al mismo tiempo.", "Agosto + 675 + BETHEL"],
            ],
            widths=[36 * mm, 79 * mm, 48 * mm],
            compact=True,
        ),
        steps(
            [
                ("Abra Notas de venta", "Seleccione Notas de venta registradas."),
                ("Elija el período", "Día, mes, año o sin filtro; puede dejarlo sin filtro."),
                ("Escriba número o cliente", "Puede usar uno, ambos o ninguno. No necesita escribir el texto completo."),
                ("Pulse Aplicar", "Se muestran número, cliente, fecha, total, estado y acciones."),
                ("Ajuste la búsqueda", "Si no encuentra la nota, borre parte del número o nombre y vuelva a aplicar."),
                ("Restablezca", "Pulse Limpiar para borrar fecha, número y cliente juntos."),
                ("Abra el detalle", "Pulse la fila o el ojo."),
            ]
        ),
        table(
            ["Bloque", "Contenido"],
            [
                ["Cabecera", "Cliente, fecha, Total venta, utilidad, estado y origen."],
                ["Origen", "SCRIPT para histórico; USER para operación web."],
                ["Entregados", "Serie, producto, capacidad, propiedad, monto y observación."],
                ["Recibidos", "Serie, producto, capacidad, propiedad y observación."],
            ],
            widths=[44 * mm, 119 * mm],
        ),
        callout("Búsqueda v1.1.2", "Número, cliente y fecha son combinables. Si completa los tres, una nota debe cumplir los tres criterios para aparecer.", "success"),
        callout("Importes", "Total venta corresponde a la suma de montos de cilindros entregados. Los importes históricos fueron recalculados y validados.", "success"),
        callout("Estado ANULADA", "La nota permanece visible para conservar el historial; sus movimientos originales fueron compensados."),
    ]
    end_page(story)

    chapter_intro(story, "14", "Editar o anular una nota", "TODOS", "Estas acciones se realizan desde Notas de venta registradas.")
    story += [
        heading("Editar datos generales"),
        steps(
            [
                ("Localice la nota", "Use el filtro si es necesario."),
                ("Pulse el lápiz", "Se abre el formulario en modo edición."),
                ("Modifique", "Cliente, fecha, utilidad u observación general."),
                ("Pulse Guardar cambios", "Espere la confirmación."),
                ("Cancelar edición", "Descarta cambios no guardados."),
            ]
        ),
        callout("Límite de edición", "El número y las líneas de cilindros no se modifican. Para corregir cilindros, anule y registre una nota nueva.", "warning"),
        heading("Anular una nota"),
        steps(
            [
                ("Pulse la papelera", "Solo está habilitada en notas registradas."),
                ("Lea la advertencia", "Se crearán movimientos inversos."),
                ("Confirme", "El estado cambia a ANULADA."),
                ("Verifique", "Abra el detalle y revise el estado e inventario."),
            ]
        ),
        callout("No es una eliminación", "La anulación conserva nota, detalles, movimientos y auditoría.", "success"),
    ]
    end_page(story)

    chapter_intro(story, "15", "Imprimir una nota de venta", "TODOS", "La impresión genera un PDF sobre la plantilla oficial con el detalle completo.")
    story += [
        steps(
            [
                ("Abra Impresión", "La tabla muestra número, cliente, fecha, importe total y estado."),
                ("Seleccione una nota", "Marque el círculo de la primera columna."),
                ("Revise la selección", "Confirme número, cliente e importe."),
                ("Pulse Imprimir nota", "Se consulta el detalle completo y se abre el PDF."),
                ("Use el visor", "Imprima o guarde el archivo."),
            ]
        ),
        table(
            ["Dato impreso", "Origen"],
            [
                ["Número, cliente y fecha", "Cabecera de la nota."],
                ["Entregado / Recibido", "Tipo de cada línea."],
                ["Serie, capacidad, propiedad y observación", "Detalle completo."],
                ["Monto", "Líneas entregadas."],
                ["Importe total", "Suma de montos entregados."],
                ["Numeración", "Continúa entre páginas sin reiniciarse."],
            ],
            widths=[76 * mm, 87 * mm],
        ),
        callout("Notas extensas", "La plantilla distribuye hasta 16 líneas por página y crea páginas adicionales. La v1.1 mantiene la numeración global y el total correcto.", "success"),
        callout("No se abre el PDF", "Habilite ventanas emergentes para oxipur.net y vuelva a pulsar Imprimir nota.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "16", "Exportar movimientos a Excel", "TODOS", "Genere el detalle de entregas y recepciones del período elegido.")
    story += [
        steps(
            [
                ("Abra Notas de venta", "Seleccione Exportar movimientos."),
                ("Elija el período", "Sin filtro, día, mes o año."),
                ("Pulse Generar Excel", "El botón muestra Generando."),
                ("Espere la descarga", "El navegador guardará un .xlsx."),
                ("Revise la confirmación", "Compruebe nombre y cantidad de movimientos."),
            ]
        ),
        heading("Columnas principales"),
        table(
            ["Grupo", "Columnas"],
            [
                ["Documento", "Boleta, fecha y cliente de la nota."],
                ["Cilindro", "Serie, tamaño, producto y propietario."],
                ["Movimiento", "Cliente, estado Entregado/Recibido y monto."],
                ["Control", "Observaciones y trazabilidad disponible."],
            ],
            widths=[42 * mm, 121 * mm],
        ),
        callout("Uso del archivo", "Excel es una salida de consulta. Editarlo no modifica el sistema ni la base de datos."),
        callout("No descarga", "Revise la carpeta Descargas y los bloqueos del navegador; después vuelva a generar.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "17", "Consultar Utilidades", "ADMIN", "Resumen monetario de notas activas. Disponible solo para Administrador.")
    story += [
        steps(
            [
                ("Abra Utilidades", "La opción solo aparece al Administrador."),
                ("Seleccione período", "Use los filtros comunes."),
                ("Pulse Aplicar", "Se actualizan total, cantidad, moneda y rango."),
                ("Revise Desde / Hasta", "Confirme el intervalo utilizado."),
            ]
        ),
        table(
            ["Indicador", "Interpretación"],
            [
                ["Total del período", "Suma del Total venta de notas REGISTRADAS."],
                ["Notas consideradas", "Cantidad de notas activas incluidas."],
                ["Moneda", "Bolivianos (Bs)."],
                ["Desde / Hasta", "Rango derivado del filtro."],
            ],
            widths=[54 * mm, 109 * mm],
        ),
        callout("Aclaración contable", "El módulo resume ventas registradas. No calcula costos, margen neto ni utilidad contable.", "warning"),
        callout("Notas anuladas", "No se incluyen en el total ni en la cantidad de notas activas.", "success"),
    ]
    end_page(story)

    chapter_intro(story, "18", "Crear cilindros", "ADMIN / OPERADOR", "El cilindro puede crearse manualmente desde el catálogo o, con confirmación, desde una nota.")
    story += [
        table(
            ["Campo", "Regla"],
            [
                ["Serie", "Obligatoria y única; debe coincidir con la identificación física."],
                ["Capacidad m3", "Obligatoria y mayor que cero."],
                ["Propietario", "Obligatorio; OXIPUR o cliente/tercero."],
                ["Valor interno", "Opcional, numérico y no negativo."],
            ],
            widths=[48 * mm, 115 * mm],
        ),
        heading("Alta manual"),
        steps(
            [
                ("Abra Cilindros", "La opción es visible para ambos roles."),
                ("Complete los campos", "Verifique la serie física."),
                ("Pulse Crear cilindro", "Espere la confirmación."),
                ("Compruebe la tabla", "Revise estado y ubicación."),
            ]
        ),
        heading("Alta desde una nota"),
        steps(
            [
                ("Escriba una serie nueva", "La pantalla avisa que no existe y que solicitará confirmación."),
                ("Complete capacidad y propiedad", "Ambas son obligatorias."),
                ("Pulse Crear nota", "Se abre una ventana con la información que se pretende registrar."),
                ("Revise la vista previa", "Compruebe movimiento, serie, producto, capacidad, propiedad y monto."),
                ("Elija Sí", "Se crea el cilindro y la nota; un check verde confirma el resultado."),
                ("Elija No", "Aparece una X roja y no se guarda ni el cilindro ni la nota."),
            ]
        ),
        callout("Evite duplicados", "Antes de crear manualmente, busque la serie y revise espacios o diferencias de mayúsculas.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "19", "Editar o desactivar cilindros", "ADMIN / OPERADOR", "Corrija el maestro sin alterar manualmente la trazabilidad.")
    story += [
        heading("Editar"),
        steps(
            [
                ("Pulse la fila o el lápiz", "Se abre la ventana de edición."),
                ("Modifique", "Serie, capacidad, propietario o valor."),
                ("Pulse Guardar cambios", "Espere la confirmación."),
                ("Cancelar", "Cierra sin guardar."),
            ]
        ),
        heading("Desactivar"),
        steps(
            [
                ("Pulse la papelera", "Aparece una confirmación con la serie."),
                ("Confirme si corresponde", "Queda inactivo para nuevas operaciones."),
                ("Revise la tabla", "El historial permanece registrado."),
            ]
        ),
        callout("Desactivación, no borrado", "Las notas y movimientos anteriores se conservan. Un cilindro inactivo no puede usarse en una nota.", "success"),
        callout("Ubicación actual", "No intente corregir PLANTA o CLIENTE editando el catálogo. La ubicación depende de notas y movimientos.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "20", "Administrar productos", "ADMIN", "Catálogo de gases o productos disponibles para cilindros entregados.")
    story += [
        table(
            ["Campo", "Regla"],
            [
                ["Código", "Obligatorio y único, por ejemplo OX-MED."],
                ["Nombre", "Obligatorio, por ejemplo Oxígeno medicinal."],
                ["Descripción", "Opcional."],
            ],
            widths=[45 * mm, 118 * mm],
        ),
        heading("Crear"),
        steps(
            [
                ("Complete el formulario", "Código, nombre y descripción."),
                ("Pulse Crear producto", "Espere la confirmación."),
                ("Verifique la tabla", "Debe aparecer como activo."),
            ]
        ),
        heading("Editar o desactivar"),
        steps(
            [
                ("Pulse el lápiz", "Modifique nombre o descripción."),
                ("Pulse Guardar", "Confirme el cambio."),
                ("Pulse la papelera", "Desactiva para nuevas notas."),
            ]
        ),
        callout("Historial", "Desactivar un producto no elimina su presencia en notas y movimientos anteriores.", "success"),
    ]
    end_page(story)

    chapter_intro(story, "21", "Administrar perfiles y roles", "ADMIN", "Crear, editar y retirar accesos al sistema.")
    story += [
        heading("Crear un perfil"),
        steps(
            [
                ("Abra Perfiles", "Use el formulario Nuevo perfil."),
                ("Ingrese Nombre y Usuario", "El usuario debe ser único."),
                ("Defina contraseña temporal", "Entréguela de forma segura."),
                ("Seleccione rol", "Administrador u Operador."),
                ("Pulse Crear perfil", "El acceso queda habilitado."),
            ]
        ),
        table(
            ["Rol", "Alcance"],
            [
                ["Administrador", "Todos los módulos, catálogos, perfiles, utilidades y auditoría."],
                ["Operador", "Operación diaria, notas, inventario, clientes, impresión y cilindros."],
            ],
            widths=[45 * mm, 118 * mm],
        ),
        heading("Editar o eliminar"),
        bullets(
            [
                "Edite nombre, rol, contraseña o estado desde la fila del usuario.",
                "Eliminar retira el acceso, pero conserva auditoría y referencias históricas.",
                "Nunca reutilice una cuenta de otra persona.",
            ]
        ),
        callout("Contraseñas", "No pueden recuperarse en texto. Si se olvidan, el Administrador debe asignar una nueva.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "22", "Perfil personal y presencia", "TODOS", "Consulte los datos de la sesión actual.")
    story += [
        table(
            ["Dato", "Descripción"],
            [
                ["Empresa", "OXIPUR ORIENTE S.R.L."],
                ["Rol", "Administrador u Operador."],
                ["Usuario", "Nombre utilizado para ingresar."],
                ["Almacén", "PLANTA."],
                ["API", "Ruta interna utilizada por la aplicación."],
            ],
            widths=[45 * mm, 118 * mm],
        ),
        heading("Estado en línea"),
        bullets(
            [
                "Mientras la aplicación está abierta, actualiza periódicamente la actividad.",
                "Salir marca la sesión como fuera de línea.",
                "Cerrar el navegador puede tardar algunos minutos en reflejarse.",
            ]
        ),
        heading("Buenas prácticas de sesión"),
        bullets(
            [
                "Use su propia cuenta.",
                "Pulse Salir al terminar.",
                "No guarde la contraseña en equipos compartidos.",
                "Informe al Administrador si observa accesos no reconocidos.",
            ]
        ),
        callout("Privacidad", "No envíe capturas que muestren contraseñas, claves privadas o información sensible.", "warning"),
    ]
    end_page(story)

    chapter_intro(story, "23", "Mensajes y solución de problemas", "TODOS", "Actúe según el mensaje mostrado por la aplicación.")
    story += [
        table(
            ["Situación", "Qué hacer"],
            [
                ["Usuario o contraseña incorrectos", "Revise teclado y credenciales; contacte al Administrador."],
                ["Sesión expirada", "Vuelva a ingresar."],
                ["No tienes permiso", "Use el rol correcto o solicite autorización."],
                ["Cilindro nuevo incompleto", "Complete capacidad y propiedad antes de solicitar la confirmación."],
                ["X roja al rechazar", "El cilindro y la nota no se guardaron; corrija o quite la línea."],
                ["Error después de aceptar", "Vuelva a la nota, revise el mensaje y confirme que la serie no fue creada antes de reintentar."],
                ["Cilindro inactivo", "Revise el catálogo antes de continuar."],
                ["Producto no aparece", "El Administrador debe crearlo o activarlo."],
                ["Cilindro repetido", "Quite una línea o use la serie correcta."],
                ["No abre impresión", "Habilite ventanas emergentes para oxipur.net."],
                ["No descarga Excel", "Revise Descargas y bloqueos del navegador."],
                ["No hay resultados", "Limpie número, cliente y fecha; luego aplique otra vez."],
            ],
            widths=[58 * mm, 105 * mm],
            compact=True,
        ),
        callout("No repita a ciegas", "Si no aparece confirmación, lea el mensaje y compruebe la tabla antes de volver a pulsar Crear, Guardar o Anular.", "warning"),
        callout("Datos para soporte", "Anote usuario, módulo, fecha y hora, número de nota o serie, y texto exacto del mensaje. Nunca envíe su contraseña."),
    ]
    end_page(story)

    chapter_intro(story, "24", "Buenas prácticas y referencia rápida", "TODOS", "Rutina recomendada para una operación segura y trazable.")
    story += [
        table(
            ["Antes de registrar", "Después de registrar"],
            [[
                "Revise cliente, fecha y hora.<br/>Verifique series físicas.<br/>Diferencie entregados y vacíos.<br/>Complete datos de cilindros nuevos.",
                "Espere confirmación.<br/>Abra el detalle.<br/>Revise el inventario.<br/>Imprima o exporte después de comprobar.",
            ]],
            widths=[81.5 * mm, 81.5 * mm],
        ),
        heading("Acciones y efecto permanente"),
        table(
            ["Acción", "Efecto"],
            [
                ["Crear nota", "Guarda nota, detalles, movimientos, ubicaciones, altas confirmadas y auditoría."],
                ["Editar nota", "Actualiza datos generales y audita."],
                ["Anular nota", "Conserva historial y crea movimientos inversos."],
                ["Desactivar cilindro/producto", "Impide nuevas operaciones; conserva historial."],
                ["Eliminar perfil", "Retira acceso; conserva auditoría."],
            ],
            widths=[52 * mm, 111 * mm],
            compact=True,
        ),
        callout("Regla de oro", "La nota de venta es el documento central. Si entregados, recibidos, series y montos son correctos, inventario, movimientos, clientes e informes se mantienen coherentes.", "success"),
        heading("Control de versión"),
        table(
            ["Versión", "Fecha", "Cambios principales"],
            [
                ["1.0", "23/07/2026", "Primera publicación productiva."],
                ["1.1", "27/07/2026", "Cilindros automáticos, acceso operativo, totales e impresión mejorada."],
                ["1.1.2", "13/08/2026", "Filtros de notas y confirmación segura para cilindros desconocidos."],
            ],
            widths=[25 * mm, 36 * mm, 102 * mm],
        ),
    ]
    end_page(story)
    return detailed_user_appendices(story)


def main() -> None:
    technical_output = OUTPUT_DIR / "ficha_tecnica_sistema_oxipur.pdf"
    user_output = OUTPUT_DIR / "guia_de_usuario_sistema_oxipur.pdf"
    build_document(
        technical_output,
        "Ficha técnica",
        "Ficha técnica de especificaciones del sistema OXIPUR",
        technical_story(),
    )
    build_document(
        user_output,
        "Guía de usuario",
        "Guía de usuario del sistema OXIPUR",
        user_story(),
    )
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(technical_output, DOCS_DIR / technical_output.name)
    shutil.copy2(user_output, DOCS_DIR / user_output.name)
    print(technical_output)
    print(user_output)


if __name__ == "__main__":
    main()
