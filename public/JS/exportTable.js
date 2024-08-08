export function getVisibleTableData(table) {
  return new Promise((resolve, reject) => {
    if (!table) {
      console.error('No se encontró el elemento <table>');
      reject();
      return;
    }

    // Obtén la tabla original
    const tbody = table.querySelector('tbody');
    const thead = table.querySelector('thead');

    if (!tbody || !thead) {
      // maneja el error
      reject(new Error('Error al obtener el <thead> AND <tbody>'));
    }

    // Crea una nueva tabla
    const visibleTable = document.createElement('table');
    const newTbody = document.createElement('tbody');

    // Filtra las filas visibles
    const visibleRows = Array.from(tbody.rows).filter(
      row => !row.classList.contains('hidden') && row.style.display !== 'none'
    );

    // Recorre las filas visibles
    visibleRows.forEach(row => {
      const newRow = document.createElement('tr');

      // Filtra las columnas visibles dentro de la fila
      const visibleCells = Array.from(row.cells).filter(
        cell => !cell.classList.contains('hidden') && cell.style.display !== 'none'
      );

      // Agrega las celdas visibles a la nueva fila
      visibleCells.forEach(cell => {
        const newCell = document.createElement('td');
        newCell.innerHTML = cell.innerHTML; // O copia otros atributos si es necesario
        newRow.appendChild(newCell);
      });

      // Agrega la fila a la nueva tabla
      newTbody.appendChild(newRow);
    });

    // Agrega el tbody filtrado a la nueva tabla
    visibleTable.appendChild(newTbody);

    // Añade la nueva tabla al documento (por ejemplo, al final del cuerpo del documento)
    // document.body.appendChild(visibleTable);

    resolve(visibleTable);
  });
}

export function exportTable({ table, title }) {
  try {
    if (!table) {
      throw new Error('No se encontro la <table> para exportar');
    }

    // Usa SheetJS para crear un libro y agregar una hoja con los datos de la tabla
    const workbook = XLSX.utils.table_to_book(table);

    XLSX.writeFile(workbook, `${title}.xlsx`);
    console.log('El archivo se ha descargado exitosamente.');
  } catch (error) {
    console.error('Error:', error);
  }
}
