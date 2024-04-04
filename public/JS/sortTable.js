export function sortValueNumeric(rows, table, headerPositionElement) {
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
}

export function sortValueString(rows, table, headerPositionElement) {
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
}
