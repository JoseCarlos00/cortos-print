export class SortTable {
  constructor({ table }) {
    this.table = table;
  }

  /**
   * Ordena tabla por su indice de columna
   *
   * accediendo a su `Element.textContet`
   * @param {Number} columnIndex Indice a Ordenar
   * @returns {Promise} - Promesa que se resuelve la tabla se ordena correctamente;
   * se rechaza si falta la tabla, el inidce de la columna o si hay un error en la operación.
   */
  sortTableByStringValue(columnIndex) {
    return new Promise((resolve, reject) => {
      try {
        // Validar el índice de columna
        const indiceNumber = Number(columnIndex);
        if (isNaN(indiceNumber) || indiceNumber < 0) {
          throw new Error('El índice de columna debe ser un número no negativo');
        }

        // Verificar la tabla
        if (!this.table) {
          throw new Error('Table no esta inizializada');
        }

        // Obtener el tbody de la tabla
        const tbody = this.table.querySelector('tbody');
        if (!tbody) {
          throw new Error('No se encontró el elemento <tbody>');
        }

        // Obtener las filas de la tabla
        const rows = Array.from(tbody.querySelectorAll('tr'));
        if (rows.length === 0) {
          throw new Error('No hay filas en la tabla para ordenar');
        }

        // Validar el índice de columna en las filas
        if (indiceNumber >= rows[0].cells.length) {
          throw new Error('El índice de columna es mayor que el número de columnas disponibles');
        }

        // Ordenar las filas
        const sortedRows = rows.sort((a, b) => {
          const cellA = a.cells[indiceNumber]?.textContent?.trim() || '';
          const cellB = b.cells[indiceNumber]?.textContent?.trim() || '';

          return cellA.localeCompare(cellB, undefined, { numeric: true });
        });

        // Reinsertar las filas ordenadas en el DOM
        sortedRows.forEach(row => tbody.appendChild(row));
        resolve();
      } catch (error) {
        console.error('Error al ordenar la tabla:', error);
        reject(error);
      }
    });
  }
}
