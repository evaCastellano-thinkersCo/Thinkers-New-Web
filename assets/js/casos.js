fetch('/casos/index.html')
  .then((res) => res.text())
  .then((html) => {
    const contenedor = document.getElementById('destino');

    if (!contenedor) {
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Clonamos el bloque completo para conservar la estructura que usa el CSS.
    const casos = doc.querySelectorAll('.cs_featured_case_item');
    const primeros3 = Array.from(casos).slice(0, 3);
    const fragmento = document.createDocumentFragment();

    primeros3.forEach((caso) => {
      fragmento.appendChild(caso.cloneNode(true));
    });

    contenedor.replaceChildren(fragmento);
  })
  .catch((err) => console.error('Error cargando casos:', err));
