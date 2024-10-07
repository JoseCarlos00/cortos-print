import { CheckBoxManangerColumn } from '../Classes/checkbox/CheckBoxManangerColumn.js';
import { TableManager } from '../Classes/TableManager.js';
import { SortTableManager } from './SortByManager.js';

import { urlParameters } from '../utils/URL.js';

export class FileManager {
  constructor() {
    this.loadingContainer = document.getElementById('loading-container');
    this.tablePreview = document.getElementById('tablePreview');
    this.fileActive = null;
    this.fileExtensionsSupported = ['xls', 'csv', 'xlsx'];

    // Intanciar classes manejadoras
    this.checkBoxMananger = new CheckBoxManangerColumn();
    this.tableManager = new TableManager({ table: this.tablePreview });
    this.SortByManager = new SortTableManager({ table: this.tablePreview });

    this.columnIndex = {
      status1: -1,
    };
    this.mapIndex = [{ key: 'status1', values: ['status 1'] }];
  }

  get valueOrderBy() {
    return urlParameters.getQueryParamValue('ordenar').toLowerCase();
  }

  handleFile({ file, callback }) {
    try {
      if (!file) {
        throw new Error("[handleFile]: 'No file selected");
      }

      // Verificar la extensión del archivo para determinar el tipo de parseo
      const extension = file.name.split('.').pop().toLowerCase();

      if (!this.fileExtensionsSupported.includes(extension)) {
        console.log('Formato de archivo no compatible');
        alert('Formato de archivo no compatible');
        callback({ statusCode: 'error' });
        return;
      }

      this.fileActive = file;
      this.processFile();
      callback({ statusCode: 'ok', file });
    } catch (error) {
      console.error('Error:[FileManager]:[handleFile]:', error);
      callback({ statusCode: 'error' });
    }
  }

  async verifySortTable() {
    return new Promise((resolve, reject) => {
      const valueOrderBy = this.valueOrderBy;
      if (valueOrderBy === 'no ordenar') {
        resolve(false);
        return;
      }

      resolve(true);
    });
  }

  async handleSortTable() {
    this.showTable();
  }

  async render() {
    // Mostrar la animación de carga
    await this.showLoaderTable();
    this.tablePreview.innerHTML = '';

    if (!this.tablePreview) {
      throw new Error("[proccesFile]: 'tablePreview' is null");
    }

    const tableContent = await this.parseExcel();

    if (!tableContent) {
      throw new Error('Error al parsear el archivo');
    }

    this.tablePreview.innerHTML = tableContent;
  }

  /**
   * Retorna un String con el contenido innerHTML de un elemento table
   * @returns  {Promise<string>}
   */
  async parseExcel() {
    try {
      const { fileActive: file } = this;

      if (!file) {
        throw new Error("[parseExcel]: 'No file selected");
      }

      const data = await file.arrayBuffer();

      // Parse and load first worksheet
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];

      // Create String HTML page
      const html = XLSX.utils.sheet_to_html(ws);

      const temporalElement = document.createElement('div');
      temporalElement.innerHTML = html;

      // Seleccion y asingacion de la tabla
      const tableContent = await this.insertTagThead(temporalElement.querySelector('table'));

      return tableContent ? tableContent.innerHTML : null;
    } catch (error) {
      console.error('Error: [FileManager]:[parseExcel]:Error al procesar el archivo:', error);
      return null;
    }
  }

  /**
   *  A partir de la tabla obtenida se recupera
   *  la primera row para los Headers
   *  se crea un elemento thead y se inserta en la tabla
   * @param {HTMLTableElement} table
   * @returns HTMLTableElement
   */
  async insertTagThead(table) {
    try {
      if (!table) {
        throw new Error("[FileManager]:[insertTagThead]: 'No table found'");
      }

      const firstRow = table.rows[0];
      if (!firstRow) {
        throw new Error("[FileManager]:[insertTagThead]: 'No rows found'");
      }

      const rowsHeaders = Array.from(firstRow.cells);
      if (rowsHeaders.length === 0) {
        throw new Error("[FileManager]:[insertTagThead]: 'No cells found'");
      }

      const thead = table.createTHead();
      const row = thead.insertRow(0);

      rowsHeaders.forEach((td, index) => {
        const th = document.createElement('th');

        th.className = 'position-relative';
        th.title = 'haga clic para ordenar la columna';
        th.innerHTML = td.textContent + `<div class="ui-iggrid-indicatorcontainer"></div>`;
        th.dataset.colIndex = index;
        th.dataset.sortOrder = 'initial';

        row.appendChild(th);
      });

      firstRow.remove();
      table.insertAdjacentElement('afterbegin', thead);

      return table;
    } catch (error) {
      console.error('Error en [FileManager]:[insertTagThead]: Error al procesar la tabla:', error);
      return null;
    }
  }

  /**
   * TODO: verificar si necesito los 4 metodos
   */
  async showLoaderTable() {
    this.loadingContainer.classList.remove('hidden');
    this.tablePreview.classList.add('hidden');
  }

  async fadeLoaderTable() {
    this.loadingContainer.classList.add('hidden');
    this.tablePreview.classList.remove('hidden');
  }

  async showTable() {
    this.tablePreview.classList.remove('hidden');
    this.loadingContainer.classList.add('hidden');
  }

  async fadeTable() {
    this.tablePreview.classList.add('hidden');
    this.loadingContainer.classList.remove('hidden');
  }

  async checkBoxColumn() {
    try {
      await this.checkBoxMananger.setCheckBoxColumn();
    } catch (error) {
      console.error(
        'Error en [FileManager]:[checkBoxColumn]: Error al crear checkboxes column:',
        error
      );
    }
  }

  /**
   * Verifica si es un Number y si es >= 0
   * @param {Number} index
   * @returns Bolean
   */
  async verifyIndexNumber(index) {
    return new Promise(resolve => resolve(!isNaN(index) && index >= 0));
  }

  async setColumnIndex() {
    const { tablePreview } = this;

    if (!tablePreview) {
      console.error('No se encontró el elemento <table>');
      return;
    }

    const headerRows = tablePreview.rows[0] ? Array.from(tablePreview.rows[0].cells) : [];

    if (headerRows.length === 0) {
      console.error('No hay filas en Header Rows');
      return;
    }

    // Reiniciar índices de columnas a -1
    Object.keys(this.columnIndex).forEach(key => {
      this.columnIndex[key] = -1;
    });

    const cloneMapIndex = structuredClone(this.mapIndex);

    // Buscar los índices de las columnas
    headerRows.forEach((th, indexPosition) => {
      const text = th.textContent.trim().toLowerCase();

      cloneMapIndex.forEach(({ key, values } = item, index) => {
        if (values.includes(text)) {
          this.columnIndex[key] = indexPosition;
          delete cloneMapIndex[index];
        }
      });
    });
  }

  async processFile() {
    try {
      await this.render();
      await this.checkBoxColumn();
      await this.setColumnIndex();

      const sortTable = await this.verifySortTable();

      if (!sortTable) {
        // Mostrar la tabla y ocultar la animación de carga
        this.showTable();
      } else {
        this.handleSortTable();
      }
    } catch (error) {
      console.error('Error: [FileMananger]:[proccesFile]', error);
      this.tablePreview.innerHTML = '<tr><td>Error al cargar el archivo</td></tr>';
      await this.fadeLoaderTable();
    }
  }
}
