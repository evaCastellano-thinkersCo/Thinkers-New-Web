# Nosotros

# Índice
- [Nosotros](#nosotros)
- [Índice](#índice)
  - [Descripción](#descripción)
  - [Tecnologías utilizadas](#tecnologías-utilizadas)
    - [Librerías y plugins](#librerías-y-plugins)
  - [Capturas de pantalla](#capturas-de-pantalla)
    - [Mobile](#mobile)
    - [Tablet](#tablet)
    - [Ordenador](#ordenador)
  - [Estructura relevante](#estructura-relevante)
  - [Estructura de la página](#estructura-de-la-página)
    - [1. Header / Navbar](#1-header--navbar)
    - [2. Sección Sobre nosotros](#2-sección-sobre-nosotros)
    - [3. Nuestros Premios](#3-nuestros-premios)
    - [4. CTA (Call To Action)](#4-cta-call-to-action)
    - [5. Footer](#5-footer)
  - [Cómo añadir un nuevo premio](#cómo-añadir-un-nuevo-premio)
  - [Dependencias JS](#dependencias-js)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

## Descripción

Página de descripción sobre la empresa, explicando el recorrido cronológicamente y enseñando algunos de los premios que ha conseguido el equipo.

Incluye:
- Navegación principal del sitio
- Explicación de quienes somos
- Orden cronológico de hitos
- Premios
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
![Preview about - mobile](img/about/preview-about-mobile.png)

### Tablet
![Preview about - tablet](img/about/preview-about-tablet.png)

### Ordenador
![Preview about - ordenador](img/about/preview-about-ordenador.png)

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

 about.html  
```

---

## Estructura de la página

### 1. Header / Navbar

- Logo
- Menú de navegación principal

### 2. Sección Sobre nosotros

- Título e introducción
- Cronología

### 3. Nuestros Premios
Listado de premios conseguidos por el equipo.


### 4. CTA (Call To Action)

Sección para redirigir a contacto:

> Contáctanos →

### 5. Footer

- Información corporativa
- Redes sociales
- Contacto
- Navegación secundaria

---

## Cómo añadir un nuevo premio

Poner dentro del div: 
```html
<div class="cs_card cs_style_2 anim_div_ShowDowns">
```
el siguiente bloque:
```html
<div class="cs_card_left">
    <div class="cs_card_logo">
        <img src="" alt="Award" />
    </div>
    <div>
    <h2 class="cs_card_title">Título del premio</h2>
        <div class="cs_card_subtitle">
         Descripción del premio.
        </div>
    </div>
 </div>
<div class="cs_card_right">
    <h2 class="cs_card_brand">(Tipo/Año)?</h2>
</div>
```


---

## Dependencias JS

Incluidas al final del documento:

```
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

- El contenido de la página → Editando los bloques HTML
- Los estilos → buscando las clases correspondientes en `assets/css/style.css`
- Las animaciones → `assets/js/main.js` + GSAP

---

## Licencia

Uso interno / proyecto corporativo Thinkers Co.