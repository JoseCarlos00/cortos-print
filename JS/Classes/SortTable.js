export function sortTable(colIndex) {
  const table = document.getElementById('dataTable');
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // Obtener el valor del radio button seleccionado
  const sortOrder = document.querySelector('input[name="sortOrder"]:checked').value;

  // Ordenar las filas
  const sortedRows = rows.sort((a, b) => {
    const cellA = a.cells[colIndex].innerText;
    const cellB = b.cells[colIndex].innerText;

    if (sortOrder === 'ascendente') {
      return cellA.localeCompare(cellB, undefined, { numeric: true });
    } else {
      return cellB.localeCompare(cellA, undefined, { numeric: true });
    }
  });

  // Volver a añadir las filas ordenadas
  sortedRows.forEach(row => tbody.appendChild(row));
}
