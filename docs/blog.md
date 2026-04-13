# Blog

## Descripción

Página de listado de artículos del blog de Thinkers Co. donde se muestran diferentes publicaciones relacionadas con innovación, diseño, estrategia y transformación empresarial.

Incluye:

- Listado de posts en formato grid
- Navegación principal del sitio
- Sección CTA (Call To Action)
- Footer con información de contacto y redes sociales

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (vanilla + plugins)
- jQuery

### Librerías y plugins

- Bootstrap
- Swiper.js
- LightGallery
- GSAP (ScrollTrigger, ScrollSmoother, SplitText)
- Isotope

---
## Capturas de pantalla
### Mobile
![Preview blog - mobile](img/preview-blog-mobile.png)

### Tablet
![Preview blog - tablet](img/preview-blog-tablet.png)

### Ordenador
![Preview blog - ordenador](img/preview-blog-ordenador.png)

---

## Estructura relevante

```bash
assets/
 ├── css/
 │    ├── plugins/
 │    └── style.css
 ├── js/
 │    ├── plugins/
 │    └── main.js
 └── img/
      └── mis_img/

 blogs/
 ├── blog-detalle/    
 └── index.html   
```

---

## Estructura de la página

### 1. Header / Navbar

- Logo
- Menú de navegación principal

### 2. Sección Blog

- Título y descripción
- Grid de artículos
- Cada post contiene:
  - Imagen (thumbnail)
  - Título
  - Extracto
  - Enlace a detalle

### 3. CTA (Call To Action)

Sección para redirigir a contacto:

> Contáctanos →

### 4. Footer

- Información corporativa
- Redes sociales
- Contacto
- Navegación secundaria

---

## Cómo añadir un nuevo post

Duplicar un bloque dentro de:

```html
.cs_featured_cases_grid
```

Ejemplo:

```html
<div class="cs_featured_case_item">
  <a href="blog-detalle/nuevo-post.html">
    <div class="cs_post">
      <div class="cs_post_thumb">
        <img src="../assets/img/mis_img/placeholder3.png" />
      </div>
      <div class="cs_post_info">
        <h2 class="cs_post_title">Título del post</h2>
        <p>Descripción corta...</p>
      </div>
    </div>
  </a>
</div>
```

---

## Dependencias JS

Incluidas al final del documento:

```html
jquery-3.7.0.min.js
isotope.pkg.min.js
swiper.min.js
lightgallery.min.js
gsap + plugins
main.js
```

---

## Personalización

Se puede modificar:

- El contenido del blog → Editando los bloques HTML
- Los estilos → buscando las clases correspondientes en `assets/css/style.css`
- Las animaciones → `assets/js/main.js` + GSAP

---

## Licencia

Uso interno / proyecto corporativo Thinkers Co.