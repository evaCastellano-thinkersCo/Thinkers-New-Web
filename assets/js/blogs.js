fetch('/blogs/index.html')
  .then((res) => res.text())
  .then((html) => {
    const contenedor = document.getElementById('destino');

    if (!contenedor) {
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Clonamos el bloque completo para conservar la estructura que usa el CSS.
    const blogs = doc.querySelectorAll('.cs_featured_case_item');
    const primeros3 = Array.from(blogs).slice(0, 3);
    const fragmento = document.createDocumentFragment();

    primeros3.forEach((blog) => {
      fragmento.appendChild(blog.cloneNode(true));
    });

    contenedor.replaceChildren(fragmento);
  })
  .catch((err) => console.error('Error cargando blogs:', err));
