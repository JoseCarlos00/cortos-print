export class TableManager {
  constructor({ table }) {
    this.table = table;
  }

  /**
   * Ordenar la tabla dependiendo del valor del dataset: `colIndex` y `sortOrder`
   * @param {HTMLElement} target
   */
  #sortTable(target) {
    try {
      if (!this.table) {
        throw new Error('Table is not initialized');
      }

      const { colIndex, sortOrder } = target.dataset;

      if (!colIndex) {
        throw new Error('Column index is not provided');
      }

      if (!sortOrder) {
        throw new Error('Sort order is not provided');
      }

      const tbody = this.table.tBodies[0];
      const rows = Array.from(tbody.querySelectorAll('tr'));

      // Ordenar las filas
      const sortedRows = rows.sort((a, b) => {
        const cellA = a.cells[colIndex].innerText;
        const cellB = b.cells[colIndex].innerText;

        if (sortOrder === 'ascending' || sortOrder === 'initial') {
          return cellA.localeCompare(cellB, undefined, { numeric: true });
        } else {
          return cellB.localeCompare(cellA, undefined, { numeric: true });
        }
      });

      // Volver a añadir las filas ordenadas
      sortedRows.forEach(row => tbody.appendChild(row));
    } catch (error) {
      console.error('Error: al ordenar la tabla:', error);
    }
  }

  /**
   * Verifica el elemento HTML y
   *
   * cambia los atributos `title`, `sortOrder` y `ariaSort`
   *
   * Si `title` es igual a `ordenado ascendente` lo cambia  a `ordenado descendente`
   *
   * invirtiendo los valores segun sea el caso
   * @param {HTMLElement} target
   */
  #onClickChangeIndicator(target) {
    if (!target) {
      throw new Error('Error:[handleClick]: No se encotro el elemento "target"');
    }

    const { sortOrder } = target.dataset;

    const setAscendig = () => {
      target.setAttribute('title', 'ordenado ascendente');
      target.dataset.sortOrder = 'ascending';
      target.dataset.ariaSort = 'ascending';
    };

    const setDescending = () => {
      target.setAttribute('title', 'ordenado descendente');
      target.dataset.sortOrder = 'descending';
      target.dataset.ariaSort = 'descending';
    };

    const toggleMap = {
      ascending: setDescending,
      initial: setAscendig,
      descending: setAscendig,
    };

    if (toggleMap[sortOrder]) {
      toggleMap[sortOrder]();
    } else {
      console.warn('no se encotro el dataset [sortOrder]');
    }
  }

  /**
   * Maneja el evento click de la `table`
   *
   * y verifica que el elemento clickeado se un `nodeName` `th`
   * @param {Event} e
   */
  #handleClick(e) {
    const { target } = e;

    if (!target) {
      throw new Error('Error:[handleClick]: No se encotro el elemento "target"');
    }

    const { nodeName } = target;

    if (nodeName == 'TH') {
      this.#onClickChangeIndicator(target);
      this.#sortTable(target);
    }
  }

  /**
   * Agrega un event listener de tipo `click` a `this.table`
   */
  #setEventClick() {
    try {
      if (!this.table) {
        throw new Error('Error:[setEventListener]: No se encontró la tabla');
      }

      this.table.addEventListener('click', e => this.#handleClick(e));
    } catch (error) {
      console.error('Error setting event listener:', error);
    }
  }

  init() {
    try {
      this.#setEventClick();
    } catch (error) {
      console.error('Error initializing [TableManager]:', error);
    }
  }
}
