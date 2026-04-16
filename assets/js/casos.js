fetch('/casos/index.html')
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Seleccionamos TODOS los casos
    const casos = doc.querySelectorAll('.cs_featured_case_item');

    // Cogemos los 3 primeros
    const primeros3 = Array.from(casos).slice(0, 3);

    const contenedor = document.getElementById('destino');

    primeros3.forEach(caso => {
      // clonamos el nodo completo
      const clon = caso.cloneNode(true);

      contenedor.appendChild(clon);
    });
  })
  .catch(err => console.error('Error cargando casos:', err));