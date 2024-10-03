export class FileMananger {
  constructor() {
    this.loadingContainer = document.getElementById('loading-container');
    this.tablePreview = document.getElementById('tablePreview');
    this.fileActive = null;

    this.fileExtensionsSupported = ['xls', 'csv', 'xlsx'];
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
      this.proccesFile();
      callback({ statusCode: 'ok', file });
    } catch (error) {
      console.error('Error:', error);
      callback({ statusCode: 'error' });
    }
  }

  async proccesFile() {
    try {
      // Mostrar la animación de carga
      await this.showLoaderTable();

      if (!this.tablePreview) {
        throw new Error("[proccesFile]: 'tablePreview' is null");
      }

      const tableConten = await this.parseExcel();

      if (!tableConten) {
        throw new Error('Error al parsear el archivo');
      }

      this.tablePreview.innerHTML = tableConten;

      // Mostrar la tabla y ocultar la animación de carga
      this.tablePreview.classList.remove('hidden');
      await this.fadeLoaderTable();
    } catch (error) {
      console.error('Error: [proccesFile]', error);
      this.tablePreview.innerHTML = '<tr><td>Error al cargar el archivo</td></tr>';
      await this.fadeLoaderTable();
    }
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
      console.error('Error al procesar el archivo:', error);
    }
  }

  async insertTagThead(table) {
    if (!table) {
      throw new Error("[insertTagTheadInTable]: 'No table found");
    }

    const firstRow = table.rows[0];

    if (!firstRow) {
      console.error('Error: no se encontro "firstRow"');
      return;
    }

    const rowsHeaders = Array.from(firstRow.cells);

    if (rowsHeaders.length == 0) {
      console.error('Error: no se encontro "rowHeaders"');
      return;
    }

    const thead = table.createTHead();
    const row = thead.insertRow(0);

    rowsHeaders.forEach(td => {
      const th = document.createElement('th');
      th.textContent = td.textContent;
      row.appendChild(th);
    });

    firstRow.remove();
    table.insertAdjacentElement('afterbegin', thead);

    return table;
  }

  async showLoaderTable() {
    this.loadingContainer.classList.remove('hidden');
    this.tablePreview.innerHTML = '';
  }

  async fadeLoaderTable() {
    this.loadingContainer.classList.add('hidden');
    this.tablePreview.classList.remove('hidden');
  }
}
