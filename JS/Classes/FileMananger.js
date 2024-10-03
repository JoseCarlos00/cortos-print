export class FileMananger {
  handleFile(file, showFileName) {
    try {
      if (!file) {
        throw new Error("[handleFile]: 'No file selected");
      }

      // Verificar la extensión del archivo para determinar el tipo de parseo
      const extension = file.name.split('.').pop().toLowerCase();

      if (extension === 'xlsx' || extension === 'csv' || extension === 'xls') {
        this.proccesFile(file);
        showFileName({ statusCode: 'ok', file });
      } else {
        console.log('Formato de archivo no compatible');
        alert('Formato de archivo no compatible');
        showFileName({ statusCode: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      showFileName({ statusCode: 'error' });
    }
  }

  async proccesFile(file) {
    // Aqui se procesa el archivo
    console.log('[Procesar Archivo]');
    const loadingContainer = document.getElementById('loading-container');

    // Mostrar la animación de carga
    // mostrarAnimacionDeCarga(loadingContainer);

    try {
      const data = await file.arrayBuffer();

      // Parse and load first worksheet
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];

      // Create HTML table
      const html = XLSX.utils.sheet_to_html(ws);

      const temporalElement = document.createElement('div');
      temporalElement.innerHTML = html;

      const tableContent = temporalElement.querySelector('table');

      tablePreview.appendChild(tableContent);
      tablePreview.style.display = 'initial';

      // Mostrar la tabla y ocultar la animación de carga
      // ocultarAnimacionDeCarga(loadingContainer);

      // modifyTable();
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      // Ocultar la animación de carga en caso de error
      // ocultarAnimacionDeCarga(loadingContainer);
    }
  }
}
