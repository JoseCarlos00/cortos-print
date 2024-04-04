// fileProcessing.js
import { insertarThead, mostrarNombreArchivo, getHeaderPosition } from '../JS/operations.js';
import { getSelectedValueFromURL, insertarPageBreak } from '../JS/funcionesGlobales.js';
import { createFiltersCheckbox } from '../JS/checkBox.js';
import { sortValueNumeric, sortValueString } from '../JS/sortTable.js';

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

            if (
              (header.toLowerCase().trim() === 'ship_to' ||
                header.toLowerCase().trim() === 'id del pedido') &&
              position
            ) {
              // Ocultar columnas por default ->  Para ocultar la Columna 1 pasar el indice 0
              let hideColumns = [6, 7, 10, 11, 12];
              hideColumns = hideColumns.map(value => value - 1);

              insertarPageBreak(position)
                .then(value => console.log(value))
                .catch(err => {
                  console.error('Error al insertar el salto de página:', err);
                });

              createFiltersCheckbox(hideColumns, false);
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

    const headerPositionElement = getHeaderPosition(headerRow.cells, [valorDeLaURL]);

    if (valorDeLaURL.toLowerCase().trim() === 'ship_to') {
      if (headerPositionElement) {
        sortValueString(rows, table, headerPositionElement)
          .then(value => console.log(value))
          .catch(err => {
            console.error('Error al ordenar tabla:', err);
          });
      }
    } else if (valorDeLaURL.toLowerCase().trim() === 'id del pedido') {
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
