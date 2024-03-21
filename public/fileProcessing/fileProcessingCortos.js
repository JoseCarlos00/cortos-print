// fileProcessing.js
import { insertarThead, mostrarNombreArchivo } from '../JS/operations.js';
import { getSelectedValueFromURL, insertarPageBreak } from '../JS/funcionesGlobales.js';
import { createFiltersCheckbox } from '../JS/checkBox.js';

async function procesarArchivo(file) {
  const loadingContainer = document.getElementById('loading-container');

  // Mostrar la animación de carga
  loadingContainer.style.display = 'block';

  const checkboxContainer = document.getElementById('checkbox-container');
  checkboxContainer && (checkboxContainer.innerHTML = '');

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
        console.log(file);
      } else {
        console.log('Formato de archivo no compatible');
        alert('Formato de archivo no compatible');
      }
    };

    reader.readAsArrayBuffer(file);
  }
}

function modifyTable() {
  insertarThead().then(() => {
    ordenarTabla().then(header => {
      if (header === 'Erp order') {
        let showColumns = [2, 3, 6, 8];
        showColumns = showColumns.map(value => value - 1);

        insertarPageBreak()
          .then()
          .catch(err => {
            console.error('Error al insertar el salto de página:', err);
          });

        tranformarTotalQty();
        createFiltersCheckbox(showColumns, true);
      } else if (header === 'ZONA') {
        insertarPageBreak()
          .then()
          .catch(err => {
            console.error('Error al insertar el salto de página:', err);
          });

        createFiltersCheckbox();
      } else {
        createFiltersCheckbox();
      }
    });
  });
}

function ordenarTabla() {
  return new Promise((resolve, reject) => {
    // Obtener el valor de la URL
    const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? null;
    const table = document.querySelector('#tablePreview table');

    if (!valorDeLaURL || !table) return;

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const headerRow = table.rows[0]; // Obtener la primera fila (encabezados)
    const headerText = headerRow.cells[valorDeLaURL - 1];

    if (headerText.textContent === 'Erp order') {
      rows.sort((a, b) => {
        let aValue = a.querySelector(`td:nth-child(${valorDeLaURL})`).innerText;
        let bValue = b.querySelector(`td:nth-child(${valorDeLaURL})`).innerText;

        aValue = aValue.split('-').pop();
        bValue = bValue.split('-').pop();

        // Verificar si los valores son numéricos
        const aValueNumeric = !isNaN(parseFloat(aValue)) && isFinite(aValue);
        const bValueNumeric = !isNaN(parseFloat(bValue)) && isFinite(bValue);

        // Comparar los valores numéricos
        if (aValueNumeric && bValueNumeric) {
          return parseFloat(aValue) - parseFloat(bValue);
        } else {
          // Si al menos uno de los valores no es numérico, comparar como cadenas
          return aValue.localeCompare(bValue);
        }
      });

      // Reinsertar las filas ordenadas en la tabla
      rows.forEach(row => {
        table.querySelector('tbody').appendChild(row);
      });
    } else if (headerText.textContent === 'ZONA') {
      rows.sort((a, b) => {
        let aValue = a.querySelector(`td:nth-child(${valorDeLaURL})`).innerText;
        let bValue = b.querySelector(`td:nth-child(${valorDeLaURL})`).innerText;

        if (valorDeLaURL === '1') {
          // Eliminar 'W-Mar Bodega ' de los valores si está presente
          if (aValue.includes('W-Mar Bodega')) {
            aValue = aValue.replace('W-Mar Bodega ', '');
          }

          if (bValue.includes('W-Mar Bodega')) {
            bValue = bValue.replace('W-Mar Bodega ', '');
          }
        }

        // Verificar si los valores son numéricos
        const aValueNumeric = !isNaN(parseFloat(aValue)) && isFinite(aValue);
        const bValueNumeric = !isNaN(parseFloat(bValue)) && isFinite(bValue);

        // Comparar los valores numéricos
        if (aValueNumeric && bValueNumeric) {
          return parseFloat(aValue) - parseFloat(bValue);
        } else {
          // Si al menos uno de los valores no es numérico, comparar como cadenas
          return aValue.localeCompare(bValue);
        }
      });

      // Reinsertar las filas ordenadas en la tabla
      rows.forEach(row => {
        table.querySelector('tbody').appendChild(row);
      });
    }

    resolve(headerText.textContent);
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