// fileProcessing.js
import { insertarThead, mostrarNombreArchivo, getHeaderPosition } from '../JS/operations.js';
import { getSelectedValueFromURL, insertarPageBreak } from '../JS/funcionesGlobales.js';
import { createFiltersCheckbox } from '../JS/checkBox.js';
import { sortValueNumeric, ordenarPorBodega } from '../JS/sortTable.js';

async function procesarArchivo(file) {
  console.log('[Procesar Archivo]');
  const loadingContainer = document.getElementById('loading-container');

  // Mostrar la animación de carga
  loadingContainer.style.display = 'flex';
  tablePreview.innerHTML = '';

  try {
    const data = await file.arrayBuffer();

    // Parse and load first worksheet
    const wb = XLSX.read(data);
    const ws = wb.Sheets[wb.SheetNames[0]];

    // Create HTML table
    const html = XLSX.utils.sheet_to_html(ws);
    tablePreview.innerHTML = html;

    // Mostrar la tabla y ocultar la animación de carga
    tablePreview.style.display = 'block';
    loadingContainer.style.display = 'none';

    modifyTable();
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
  }
}

export function handleFile(file, e, fileInput) {
  const form = document.querySelector('.container-file-upload-form > form');
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;

      if (!data) return;

      // Verificar la extensión del archivo para determinar el tipo de parseo
      const extension = file.name.split('.').pop().toLowerCase();

      if (extension === 'xlsx' || extension === 'csv' || extension === 'xls') {
        procesarArchivo(file);
        mostrarNombreArchivo(fileInput);
        form && form.reset();
      } else {
        console.log('Formato de archivo no compatible');
        alert('Formato de archivo no compatible');
      }
    };

    reader.readAsArrayBuffer(file);
  }
}

function modifyTable() {
  console.log('[Modify Table]');
  insertarThead()
    .then(() => {
      const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? null;
      if (valorDeLaURL && valorDeLaURL !== 'NoOrdenar') {
        ordenarTabla()
          .then(result => {
            const { header, position } = result;

            if (header.toLowerCase().trim() === 'erp order' && position) {
              let showColumns = [2, 3, 6, 8];
              showColumns = showColumns.map(value => value - 1);

              insertarPageBreak(position)
                .then()
                .catch(err => {
                  console.error('Error al insertar el salto de página:', err);
                });

              tranformarTotalQty();
              createFiltersCheckbox(showColumns, true);
            } else if (header.toLowerCase().trim() === 'pedido' && position) {
              let showColumns = [1, 2, 3, 4, 5];
              showColumns = showColumns.map(value => value - 1);

              insertarPageBreak(position)
                .then(value => console.log(value))
                .catch(err => {
                  console.error('Error al insertar el salto de página:', err);
                });

              tranformarTotalQty();
              createFiltersCheckbox(showColumns, true);
            } else if (
              (header.toLowerCase().trim() === 'zona' ||
                header.toLowerCase().trim() === 'bodega') &&
              position
            ) {
              insertarPageBreak(position)
                .then(value => console.log(value))
                .catch(err => {
                  console.error('Error al insertar el salto de página:', err);
                });

              createFiltersCheckbox();
            } else {
              createFiltersCheckbox();
            }
          })
          .catch(err => {
            console.error('Error al ordenar la Tabla:', err);
            createFiltersCheckbox();
          });
      } else {
        createFiltersCheckbox();
      }
    })
    .catch(err => {
      console.error('Error al insetar el Thead:', err);
    });
}

function ordenarTabla() {
  console.log('[Ordenar tabla]');
  return new Promise((resolve, reject) => {
    // Obtener el valor de la URL
    const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? null;
    const table = document.querySelector('#tablePreview table');

    if (!table) {
      return reject('No se encontro la tabla con el id: #tablePreview');
    }

    if (!valorDeLaURL) {
      return reject('No se encontro el valor del parametro de la URL [ordenar]');
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const headerRow = table.rows[0]; // Obtener la primera fila (encabezados)

    let headerPositionElement = null;

    if (valorDeLaURL.toLowerCase().trim() === 'erp order') {
      headerPositionElement = getHeaderPosition(headerRow.cells, [valorDeLaURL]);

      if (headerPositionElement) {
        sortValueNumeric(rows, table, headerPositionElement)
          .then(value => console.log(value))
          .catch(err => {
            console.error('Error al ordenar tabla:', err);
          });
      }
    } else if (
      valorDeLaURL.toLowerCase().trim() === 'bodega' ||
      valorDeLaURL.toLowerCase().trim() === 'zona' ||
      valorDeLaURL.toLowerCase().trim() === 'work_zone'
    ) {
      headerPositionElement = getHeaderPosition(headerRow.cells, ['bodega', 'zona', 'work_zone']);

      if (headerPositionElement) {
        ordenarPorBodega(rows, table, headerPositionElement)
          .then(value => console.log(value))
          .catch(err => {
            console.error('Error al ordenar tabla:', err);
          });
      }
    } else if (valorDeLaURL.toLowerCase().trim() === 'pedido') {
      headerPositionElement = getHeaderPosition(headerRow.cells, [valorDeLaURL]);

      if (headerPositionElement) {
        sortValueNumeric(rows, table, headerPositionElement)
          .then(value => console.log(value))
          .catch(err => {
            console.error('Error al ordenar tabla:', err);
          });
      }
    }

    resolve({ header: valorDeLaURL, position: headerPositionElement });
  });
}

function tranformarTotalQty() {
  const valorDeLaURL = getSelectedValueFromURL('ordenar');

  if (!valorDeLaURL) return;

  if (!valorDeLaURL === '8') return;

  const filas = tablePreview.querySelectorAll('tr');

  if (!filas) return;

  const totalQty = filas[0].querySelector('[data-v="Total qty"]');

  if (!totalQty) return;

  // Iterar sobre las filas
  filas.forEach((fila, index) => {
    // Ignorar la primera fila (encabezados)
    if (index === 0) return;
    const tdTotalQty = fila.querySelector('td:nth-child(6)');

    if (totalQty) {
      const value = tdTotalQty.innerHTML;

      // Verificar el valor es numérico
      const valueNumeric = !isNaN(parseFloat(value)) && isFinite(value);
      if (valueNumeric) {
        tdTotalQty.innerHTML = parseFloat(value);
      }
    }
  });
}
