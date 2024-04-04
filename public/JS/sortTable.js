export function sortValueNumeric(rows, table, headerPositionElement) {
  return new Promise((resolve, reject) => {
    if (!rows || !table || !headerPositionElement) {
      return reject('Error al ordenar tabla');
    }

    rows.sort((a, b) => {
      // Utilizar el valor de la URL en el selector
      let aValue = a.querySelector(`td:nth-child(${headerPositionElement})`).innerText;
      let bValue = b.querySelector(`td:nth-child(${headerPositionElement})`).innerText;
      aValue = aValue.split('-').pop();
      bValue = bValue.split('-').pop();
      // Verificar si los valores son numéricos
      const aValueNumeric = !isNaN(parseFloat(aValue)) && isFinite(aValue);
      const bValueNumeric = !isNaN(parseFloat(bValue)) && isFinite(bValue);
      // Comparar los valores numéricos
      if (aValueNumeric && bValueNumeric) {
        return parseFloat(aValue) - parseFloat(bValue);
      } else {
        // Si al menos uno de los valores no es numérico, comparar como cadenas
        return aValue.localeCompare(bValue);
      }
    });

    // Reinsertar las filas ordenadas en la tabla
    rows.forEach(row => {
      table.querySelector('tbody').appendChild(row);
    });

    resolve('Ordenar tabla por valor numerico correcto');
  });
}

export function sortValueString(rows, table, headerPositionElement) {
  return new Promise((resolve, reject) => {
    if (!rows || !table || !headerPositionElement) {
      return reject('Error al ordenar tabla');
    }

    rows.sort((a, b) => {
      // Utilizar el valor de la URL en el selector
      let aValue = a.querySelector(`td:nth-child(${headerPositionElement})`).innerText;
      let bValue = b.querySelector(`td:nth-child(${headerPositionElement})`).innerText;
      return aValue.localeCompare(bValue);
    });

    // Reinsertar las filas ordenadas en la tabla
    rows.forEach(row => {
      table.querySelector('tbody').appendChild(row);
    });

    resolve('Ordenar tabla por cadena de texto correcto');
  });
}

export function ordenarPorBodega(rows, table, headerPositionElement) {
  return new Promise((resolve, reject) => {
    rows.sort((a, b) => {
      let aValue = a.querySelector(`td:nth-child(${headerPositionElement})`).innerText;
      let bValue = b.querySelector(`td:nth-child(${headerPositionElement})`).innerText;

      // Eliminar 'W-Mar Bodega ' de los valores si está presente
      if (aValue.includes('W-Mar Bodega')) {
        aValue = aValue.replace('W-Mar Bodega ', '');
      }

      if (bValue.includes('W-Mar Bodega')) {
        bValue = bValue.replace('W-Mar Bodega ', '');
      }

      // Verificar si los valores son numéricos
      const aValueNumeric = !isNaN(parseFloat(aValue)) && isFinite(aValue);
      const bValueNumeric = !isNaN(parseFloat(bValue)) && isFinite(bValue);

      // Comparar los valores numéricos
      if (aValueNumeric && bValueNumeric) {
        return parseFloat(aValue) - parseFloat(bValue);
      } else {
        // Si al menos uno de los valores no es numérico, comparar como cadenas
        return aValue.localeCompare(bValue);
      }
    });

    // Reinsertar las filas ordenadas en la tabla
    rows.forEach(row => {
      table.querySelector('tbody').appendChild(row);
    });

    resolve('Ordenar tabla por valor bodega correcto');
  });
}
