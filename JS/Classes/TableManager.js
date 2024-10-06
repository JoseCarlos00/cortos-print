export class TableManager {
  constructor({ table }) {
    this.table = table;
  }

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

  #setEventListener() {
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
      this.#setEventListener();
    } catch (error) {
      console.error('Error initializing [TableManager]:', error);
    }
  }
}
