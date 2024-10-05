export class TableManager {
  constructor({ table }) {
    this.table = table;
  }

  async changeState(target) {
    const { sortOrder } = target.dataset;

    console.log('[changeState] 1:', target);

    const setAscendig = () => {
      target.setAttribute('title', 'ordenado ascendente');
      target.dataset.sortOrder = 'ascending';
      target.dataset.ariaSort = 'ascending';
    };

    const toggleMap = {
      ascending: () => {
        target.setAttribute('title', 'ordenado descendente');
        target.dataset.sortOrder = 'descending';
        target.dataset.ariaSort = 'descending';
      },
      initial: setAscendig,
      descending: setAscendig,
    };

    if (toggleMap[sortOrder]) {
      toggleMap[sortOrder]();
      console.log('[changeState] 2:', target);
    } else {
      console.log('[changeState] 3:', target);
    }
  }

  async sortTable(target) {
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

      await this.changeState(target);

      const tbody = this.table.tBodies[0];
      const rows = Array.from(tbody.querySelectorAll('tr'));

      // Obtener el valor del radio button seleccionado

      // Ordenar las filas
      const sortedRows = rows.sort((a, b) => {
        const cellA = a.cells[colIndex].innerText;
        const cellB = b.cells[colIndex].innerText;

        console.log('[sortedRows]:', sortOrder);

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

  handleClick(e) {
    const { target } = e;

    if (!target) {
      throw new Error('Error:[handleClick]: No se encotro el elemento "target"');
    }

    const { nodeName, type, dataset } = target;

    console.group();
    console.log('[handleClick] : target', target);
    console.log('nodeName', nodeName);
    console.log('type', type);
    console.log('dataset', dataset);
    console.groupEnd();

    if (nodeName == 'TH') {
      this.sortTable(target);
    }
  }

  setEventListener() {
    try {
      this.table.addEventListener('click', e => this.handleClick(e));
    } catch (error) {
      console.error('Error setting event listener:', error);
    }
  }

  init() {
    try {
      this.setEventListener();
    } catch (error) {
      console.error('Error initializing [TableManager]:', error);
    }
  }
}
