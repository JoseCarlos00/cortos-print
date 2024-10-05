export class TableManager {
  constructor({ table }) {
    this.table = table;
  }

  changesortOrder(target) {
    const { sortOrder } = target.dataset;

    if (sortOrder === 'ascending') {
      target.setAttribute('title', 'ordenado descendente');
      target.setAttribute('aria-sort', 'descending');
    } else {
      target.setAttribute('title', 'ordenado ascendente');
      target.setAttribute('aria-sort', 'ascending');
    }
  }

  sortTable(target) {
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

      // Obtener el valor del radio button seleccionado

      // Ordenar las filas
      const sortedRows = rows.sort((a, b) => {
        const cellA = a.cells[colIndex].innerText;
        const cellB = b.cells[colIndex].innerText;

        if (sortOrder === 'ascending') {
          return cellA.localeCompare(cellB, undefined, { numeric: true });
        } else {
          return cellB.localeCompare(cellA, undefined, { numeric: true });
        }
      });

      // Volver a añadir las filas ordenadas
      sortedRows.forEach(row => tbody.appendChild(row));

      this.changesortOrder(target);
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
    console.log('target', target);
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
