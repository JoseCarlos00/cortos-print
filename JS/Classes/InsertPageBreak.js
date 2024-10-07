export class InsertPageBreak {
  constructor({ table }) {
    this.table = table;
  }

  /**
   * Agrega un salto de página visual (`page-break`) al final de cada grupo de filas
   * donde el valor de la columna especificada cambia.
   *
   * @param {number} positionElement - Índice (1-based) de la columna que se usará para identificar grupos de filas.
   * @returns {Promise} - Promesa que se resuelve si el salto de página se inserta correctamente;
   * se rechaza si falta la tabla, la posición del elemento o si hay un error en la operación.
   */
  insertPageBreak(positionElement) {
    return new Promise((resolve, reject) => {
      try {
        // Verificar que `positionElement` es un índice válido
        if (!positionElement || isNaN(positionElement) || positionElement <= 0) {
          return reject('El índice de columna debe ser un número positivo y válido.');
        }

        // Buscar la tabla en el DOM
        if (!this.table) {
          return reject('Table no esta inizializada');
        }

        // Obtener todas las filas de la tabla
        const filas = this.table.querySelectorAll('tr');
        if (filas.length <= 1) {
          return reject('La tabla no contiene suficientes filas para agrupar.');
        }

        filas.forEach((fila, index) => {
          if (index === 0) return; // Saltar la primera fila (encabezados)

          // Obtener el valor actual de la celda especificada en `positionElement`
          const celdaActual = fila.querySelector(`td:nth-child(${positionElement})`);
          const valorDeLaFilaActual = celdaActual?.textContent?.trim() ?? '';

          // Obtener el valor de la primera celda de la fila anterior
          const celdaAnterior = filas[index - 1].querySelector(`td:nth-child(${positionElement})`);
          const valorDeLaFilaAnterior = celdaAnterior?.textContent?.trim() ?? '';

          // Agregar clase `page-break` si los valores de las celdas cambian entre filas
          if (valorDeLaFilaActual !== valorDeLaFilaAnterior && index > 1) {
            celdaAnterior.classList.add('page-break');
          }
        });

        console.log('Insertar PageBreak con éxito');
        resolve();
      } catch (error) {
        console.error('Error al insertar PageBreak:', error);
        reject(error);
      }
    });
  }
}
