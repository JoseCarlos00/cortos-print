export async function getVisibleTableData(table) {
  if (!table) {
    throw new Error('No se encontró el elemento <table>');
  }

  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');

  if (!tbody || !thead) {
    throw new Error('Error al obtener el <thead> AND <tbody>');
  }

  // Crea una nueva tabla
  const visibleTable = document.createElement('table');
  const newThead = await createNewThead(thead);
  const newTbody = await createNewTbody(tbody);

  visibleTable.appendChild(newThead);
  visibleTable.appendChild(newTbody);

  resolve(visibleTable);
}

function createNewThead(thead) {
  return new Promise((resolve, reject) => {
    if (!thead) {
      reject(new Error('No se encontró el elemento <thead>'));
    }

    const newThead = document.createElement('thead');

    if (thead.rows && thead.rows.length > 0) {
      const visibleColumns = Array.from(thead.rows[0].cells).filter(
        cell => cell && !cell.classList.contains('hidden') && cell.style.display !== 'none'
      );

      const newRowHeader = document.createElement('tr');
      visibleColumns.forEach(cell => {
        const newCell = document.createElement('th');
        newCell.textContent = cell.textContent;
        newRowHeader.appendChild(newCell);
      });

      newThead.appendChild(newRowHeader);
    } else {
      reject(new Error('No se encontraron filas en el elemento <thead>'));
    }

    resolve(newThead);
  });
}

function createNewTbody(tbody) {
  return new Promise((resolve, reject) => {
    if (!tbody) {
      reject(new Error('No se encontró el elemento <tbody>'));
    }

    const newTbody = document.createElement('tbody');

    if (tbody.rows && tbody.rows.length > 0) {
      const visibleRows = Array.from(tbody.rows).filter(
        row => row && !row.classList.contains('hidden') && row.style.display !== 'none'
      );

      visibleRows.forEach(row => {
        const newRow = document.createElement('tr');

        const visibleCells = Array.from(row.cells).filter(
          cell => cell && !cell.classList.contains('hidden') && cell.style.display !== 'none'
        );

        visibleCells.forEach(cell => {
          const newCell = document.createElement('td');
          newCell.textContent = cell.textContent;
          newRow.appendChild(newCell);
        });

        newTbody.appendChild(newRow);
      });
    } else {
      reject(new Error('No se encontraron filas en el elemento <tbody>'));
    }

    resolve(newTbody);
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
