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

      await this.insertTheadInTable();
    } catch (error) {
      console.error('Error: [proccesFile]', error);
      this.tablePreview.innerHTML = '<tr><td>Error al cargar el archivo</td></tr>';
      await this.fadeLoaderTable();
    }
  }

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
      const tableContent = temporalElement.querySelector('table');

      return tableContent.innerHTML;
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
    }
  }

  async insertTheadInTable() {
    const { tablePreview } = this;

    const firstRow = tablePreview.rows[0];

    if (!firstRow) {
      console.error('Error: no se encontro "firstRow"');
      return;
    }

    const rowsHeaders = Array.from(firstRow.cells);

    if (rowsHeaders.length == 0) {
      console.error('Error: no se encontro "rowHeaders"');
      return;
    }

    const thead = tablePreview.createTHead();
    const row = thead.insertRow(0);

    rowsHeaders.forEach(td => {
      const th = document.createElement('th');
      th.textContent = td.textContent;
      row.appendChild(th);
    });

    firstRow.remove();
    tablePreview.insertAdjacentElement('afterbegin', thead);
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
