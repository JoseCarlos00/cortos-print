// fileProcessing.js
import { insertarThead, mostrarNombreArchivo } from '../operations.js';
import { getSelectedValueFromURL } from '../funcionesGlobales.js';
import { createFiltersCheckbox } from '../public/JS/checkBox.js';

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
      }
    };

    reader.readAsArrayBuffer(file);
  }
}

function modifyTable() {
  insertarThead().then(() => {
    ordenarTabla().then(header => {
      if (header === 'SHIP_TO' || header === 'ID DEL PEDIDO') {
        // Ocultar columnas por default ->  Para ocultar la Columna 1 pasar el indice 0
        let hideColumns = [6, 7, 10, 11, 12];
        hideColumns = hideColumns.map(value => value - 1);

        insertarPageBreak()
          .then()
          .catch(() => {
            console.error('Error al insertar el salto de página:');
          });

        createFiltersCheckbox(hideColumns, false);
      } else {
        createFiltersCheckbox();
      }
    });
  });
}

function insertarPageBreak() {
  return new Promise((resolve, reject) => {
    const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? '9';

    // Busca y agregar la clase page-break para el salto de paguina por el valor de la url
    const table = document.querySelector('#tablePreview table');

    if (!table) {
      return reject('No se Encontro la tabla con el id: #tablePreview');
    }

    // filtrar y agregar clase al primer TD de cada grupo
    const filas = table.querySelectorAll('tr');

    // Iterar sobre las filas
    filas.forEach((fila, index) => {
      // Ignorar la primera fila (encabezados)
      if (index === 0) return;

      const valorDeLaFilaActual = fila.querySelector(`td:nth-child(${valorDeLaURL})`).textContent;

      // Obtener el valor de la primera celda de la fila anterior
      const valorDeLaFilaAnterior = filas[index - 1].querySelector(
        `td:nth-child(${valorDeLaURL})`
      ).textContent;

      //  Verificar si el valor actual es diferente al valor anterior
      if (valorDeLaFilaActual !== valorDeLaFilaAnterior) {
        if (index > 1) {
          filas[index - 1]
            .querySelector(`td:nth-child(${valorDeLaURL})`)
            .classList.add('page-break');
        }
      }
    });

    resolve();
  });
}

function ordenarTabla() {
  return new Promise((resolve, reject) => {
    // Obtener el valor de la URL
    const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? '9';

    const table = document.querySelector('#tablePreview table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    const headerRow = table.rows[0]; // Obtener la primera fila (encabezados)
    const headerText = headerRow.cells[valorDeLaURL - 1];

    if (headerText.textContent === 'SHIP_TO') {
      // Ordenar las filas basadas en el contenido de la columna especificada por el valor de la URL
      rows.sort((a, b) => {
        // Utilizar el valor de la URL en el selector
        let aValue = a.querySelector(`td:nth-child(${valorDeLaURL})`).innerText;
        let bValue = b.querySelector(`td:nth-child(${valorDeLaURL})`).innerText;

        return aValue.localeCompare(bValue);
      });

      // Reinsertar las filas ordenadas en la tabla
      rows.forEach(row => {
        table.querySelector('tbody').appendChild(row);
      });
    } else if (headerText.textContent === 'ID DEL PEDIDO') {
      // Ordenar las filas basadas en el contenido de la columna especificada por el valor de la URL
      rows.sort((a, b) => {
        // Utilizar el valor de la URL en el selector
        let aValue = a.querySelector(`td:nth-child(${valorDeLaURL})`).innerText;
        let bValue = b.querySelector(`td:nth-child(${valorDeLaURL})`).innerText;

        aValue = aValue.split('-')[3].pop();
        bValue = bValue.split('-')[3].pop();

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
