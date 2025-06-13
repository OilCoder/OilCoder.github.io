# Project Pages

Esta carpeta contiene las subpáginas detalladas de los proyectos del portfolio.

## Estructura

```
projects/
├── README.md                           # Este archivo
├── petrophysical-analysis.html         # Página del proyecto Kansas
└── [future-project].html              # Futuras páginas de proyectos
```

## Páginas Disponibles

### 1. Análisis Petrofísico (petrophysical-analysis.html)
- **Proyecto**: Neural Network Pipeline para Análisis Petrofísico
- **Repositorio**: https://github.com/OilCoder/Kansas
- **Documentación**: https://github.com/OilCoder/Kansas/tree/main/docs/Spanish
- **Tecnologías**: Python, TensorFlow, RAPIDS, Docker, Optuna
- **Estado**: Completado

## Características de las Páginas

- **SEO Optimizado**: Meta tags, Open Graph, Twitter Cards
- **Responsive Design**: Adaptado para móviles y desktop
- **Navegación**: Enlaces de vuelta al portfolio principal
- **Documentación**: Enlaces directos a documentación técnica
- **Interactividad**: Animaciones y efectos hover
- **Accesibilidad**: ARIA labels y navegación por teclado

## Cómo Agregar Nuevos Proyectos

1. **Crear página HTML**: Copiar `petrophysical-analysis.html` como plantilla
2. **Actualizar contenido**: Modificar títulos, descripciones, enlaces
3. **Agregar datos JSON**: Crear archivo en `../assets/data/project-[name].json`
4. **Actualizar portfolio**: Modificar `content-es.json` y `content-en.json`
5. **Agregar imágenes**: Subir imágenes a `../assets/images/projects/`

## Estilos

Los estilos específicos están en `../assets/css/project-detail.css` que incluye:
- Variables CSS para temas
- Componentes reutilizables
- Responsive design
- Animaciones y transiciones
- Paleta de colores profesional

## Navegación

- **Volver al Portfolio**: Botón en hero section
- **Enlaces Externos**: GitHub, documentación, demos
- **Navegación Interna**: Smooth scrolling entre secciones
- **Breadcrumbs**: Navegación contextual 