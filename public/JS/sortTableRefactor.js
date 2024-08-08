export function sortValueString(rows, table, columnIndex) {
  console.log('[sortValueString]');

  return new Promise(resolve => {
    // Verifica que el columnIndex sea válido
    if (rows.length === 0 || columnIndex < 0 || columnIndex >= rows[0].cells.length) {
      console.error('Índice de columna no válido o sin filas.');
      reject();
      return;
    }

    const tbody = table.querySelector('tbody');

    if (!tbody) {
      throw new Error('No se eencontro el elemento <tbody>');
    }

    // Ordena las filas basándose en el valor de la columna
    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex] ? rowA.cells[columnIndex].innerText.trim() : '';
      const cellB = rowB.cells[columnIndex] ? rowB.cells[columnIndex].innerText.trim() : '';

      // Comparar los valores como cadenas de texto
      return cellA.localeCompare(cellB, undefined, { numeric: true });
    });

    rows.forEach(row => tbody.appendChild(row));
    resolve();
  });
}
