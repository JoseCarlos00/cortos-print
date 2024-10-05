import { CheckBoxManangerColumn } from '../Classes/checkbox/CheckBoxManangerColumn.js';
import { TableManager } from '../Classes/TableManager.js';

export class FileManager {
  constructor() {
    this.loadingContainer = document.getElementById('loading-container');
    this.tablePreview = document.getElementById('tablePreview');
    this.fileActive = null;
    this.fileExtensionsSupported = ['xls', 'csv', 'xlsx'];

    // Intanciar classes manejadoras
    this.checkBoxMananger = new CheckBoxManangerColumn();
    this.tableManager = new TableManager({ table: this.tablePreview });
    this.tableManager.init();
  }

  handleFile(file, callback) {
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

  async render() {
    // Mostrar la animación de carga
    await this.showLoaderTable();

    if (!this.tablePreview) {
      throw new Error("[proccesFile]: 'tablePreview' is null");
    }

    const tableContent = await this.parseExcel();

    if (!tableContent) {
      throw new Error('Error al parsear el archivo');
    }

    this.tablePreview.innerHTML = tableContent;

    // Mostrar la tabla y ocultar la animación de carga
    this.tablePreview.classList.remove('hidden');
    await this.fadeLoaderTable();
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

  async showLoaderTable() {
    this.loadingContainer.classList.remove('hidden');
    this.tablePreview.innerHTML = '';
  }

  async fadeLoaderTable() {
    this.loadingContainer.classList.add('hidden');
    this.tablePreview.classList.remove('hidden');
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

  async processFile() {
    try {
      await this.render();
      await this.checkBoxColumn();
    } catch (error) {
      console.error('Error: [FileMananger]:[proccesFile]', error);
      this.tablePreview.innerHTML = '<tr><td>Error al cargar el archivo</td></tr>';
      await this.fadeLoaderTable();
    }
  }
}
