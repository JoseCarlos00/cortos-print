export function sortValueNumeric(rows, table, headerPositionElement) {
  return new Promise((resolve, reject) => {
    try {
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
    } catch (error) {
      reject(`Error al ordenar la tabla: ${error}`);
    }
  });
}

export function sortValueString(rows, table, headerPositionElement) {
  return new Promise((resolve, reject) => {
    try {
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
    } catch (error) {
      reject(`Error al ordenar la tabla: ${error}`);
    }
  });
}

export function ordenarPorBodega(rows, table, headerPositionElement) {
  return new Promise((resolve, reject) => {
    try {
      rows.sort((a, b) => {
        let aValue = a.querySelector(`td:nth-child(${headerPositionElement})`).innerText.trim();
        let bValue = b.querySelector(`td:nth-child(${headerPositionElement})`).innerText.trim();

        // Eliminar 'W-Mar Bodega ' de los valores si está presente
        if (aValue.startsWith('W-Mar Bodega ')) {
          aValue = aValue.replace('W-Mar Bodega ', '');
        }
        if (bValue.startsWith('W-Mar Bodega ')) {
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
      const tbody = table.querySelector('tbody');
      rows.forEach(row => {
        tbody?.appendChild(row);
      });

      resolve('Ordenar tabla por valor bodega correcto');
    } catch (error) {
      reject(`Error al ordenar la tabla: ${error}`);
    }
  });
}

export function ordenarPorPiso(rows, table, headerPositionElement) {
  const primerPiso = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'W-Mar Vinil', 'W-Mar Mayoreo'];
  const segundoPiso = ['10', '11', '12', '13', '14', '15', '16', '17', 'W-Mar No Banda'];

  const getIndex = value => {
    if (primerPiso.includes(value)) {
      return { index: primerPiso.indexOf(value), priority: 1 };
    } else if (segundoPiso.includes(value)) {
      return { index: segundoPiso.indexOf(value), priority: 2 };
    } else {
      return { index: Infinity, priority: Infinity };
    }
  };

  return new Promise((resolve, reject) => {
    try {
      // Ordenar las filas
      rows.sort((a, b) => {
        let aValue = a.querySelector(`td:nth-child(${headerPositionElement})`).innerText.trim();
        let bValue = b.querySelector(`td:nth-child(${headerPositionElement})`).innerText.trim();

        // Eliminar 'W-Mar Bodega ' de los valores si está presente
        if (aValue.startsWith('W-Mar Bodega ')) {
          aValue = aValue.replace('W-Mar Bodega ', '');
        }
        if (bValue.startsWith('W-Mar Bodega ')) {
          bValue = bValue.replace('W-Mar Bodega ', '');
        }

        // Obtener los índices de los valores en los arrays de prioridad
        const aIndex = getIndex(aValue);
        const bIndex = getIndex(bValue);

        // Comparar primero por prioridad y luego por índice
        if (aIndex.priority !== bIndex.priority) {
          return aIndex.priority - bIndex.priority;
        } else {
          return aIndex.index - bIndex.index;
        }
      });

      // Reinsertar las filas ordenadas en la tabla
      const tbody = table.querySelector('tbody');
      rows.forEach(row => {
        tbody.appendChild(row);
      });

      resolve('Ordenar tabla por valor bodega correcto');
    } catch (error) {
      reject(`Error al ordenar la tabla: ${error.message}`);
    }
  });
}
