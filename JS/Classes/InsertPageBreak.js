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

        // Iterar sobre las filas, comenzando desde la segunda (ignorando encabezado)
        filas.forEach((fila, index) => {
          if (index === 0) return; // Saltar la primera fila (encabezados)

          // Obtener el valor actual de la celda especificada en `positionElement`
          const celdaActual = fila.querySelector(`td:nth-child(${positionElement})`);
          if (!celdaActual)
            return reject(
              `No se encontró la celda en la posición ${positionElement} en la fila ${index + 1}.`
            );

          const valorDeLaFilaActual = celdaActual.textContent.trim();

          // Obtener el valor de la primera celda de la fila anterior
          const celdaAnterior = filas[index - 1].querySelector(`td:nth-child(${positionElement})`);
          if (!celdaAnterior)
            return reject(
              `No se encontró la celda en la posición ${positionElement} en la fila ${index}.`
            );

          const valorDeLaFilaAnterior = celdaAnterior.textContent.trim();

          // Agregar clase `page-break` si los valores de las celdas cambian entre filas
          if (valorDeLaFilaActual !== valorDeLaFilaAnterior) {
            if (index > 1) {
              celdaAnterior.classList.add('page-break');
            }
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

/**
  insertarPageBreak(positionElement) {
    return new Promise((resolve, reject) => {
      // Busca y agregar la clase page-break para el salto de paguina por el valor de la url
      const table = document.querySelector('#tablePreview table');

      if (!table) {
        return reject('No se encontro la tabla con el id: #tablePreview');
      }

      if (!positionElement) {
        return reject('No se encontro la posicion del elemento');
      }

      // filtrar y agregar clase al primer TD de cada grupo
      const filas = table.querySelectorAll('tr');

      // Iterar sobre las filas
      filas.forEach((fila, index) => {
        // Ignorar la primera fila (encabezados)
        if (index === 0) return;

        const valorDeLaFilaActual = fila.querySelector(
          `td:nth-child(${positionElement})`
        ).textContent;

        // Obtener el valor de la primera celda de la fila anterior
        const valorDeLaFilaAnterior = filas[index - 1].querySelector(
          `td:nth-child(${positionElement})`
        ).textContent;

        // Verificar si el valor actual es diferente al valor anterior
        if (valorDeLaFilaActual !== valorDeLaFilaAnterior) {
          if (index > 1) {
            filas[index - 1]
              .querySelector(`td:nth-child(${positionElement})`)
              .classList.add('page-break');
          }
        }
      });

      console.log('Insertar PageBreak Con Exito');
      resolve();
    });
  }

 */
