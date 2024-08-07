// fileProcessing.js
import { insertarThead, mostrarNombreArchivo, getHeaderPosition } from '../JS/operations.js';
import { getSelectedValueFromURL, insertarPageBreak } from '../JS/funcionesGlobales.js';
import { createFiltersCheckbox } from '../JS/checkBox.js';
import { sortValueNumeric, sortValueString } from '../JS/sortTable.js';

let dataTable = '';

async function procesarArchivo(file) {
  console.log('[Procesar Archivo]');
  const loadingContainer = document.getElementById('loading-container');

  // Mostrar la animación de carga
  mostrarAnimacionDeCarga(loadingContainer);

  try {
    const data = await file.arrayBuffer();

    // Parse and load first worksheet
    const wb = XLSX.read(data);
    const ws = wb.Sheets[wb.SheetNames[0]];

    // Create HTML table
    const html = XLSX.utils.sheet_to_html(ws);
    tablePreview.innerHTML = html;
    dataTable = html;

    // Mostrar la tabla y ocultar la animación de carga
    ocultarAnimacionDeCarga(loadingContainer);

    modifyTable();
  } catch (error) {
    console.error('Error al procesar el archivo:', error);

    // Ocultar la animación de carga en caso de error
    ocultarAnimacionDeCarga(loadingContainer);
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

async function modifyTable() {
  console.log('[Modify Table]');

  try {
    await insertarThead();

    const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? null;

    if (valorDeLaURL !== 'NoOrdenar') {
      await ordenarTabla();
    }

    let showColumns = [1, 4];
    showColumns = showColumns.map(value => value - 1);

    createFiltersCheckbox(showColumns, true);

    eventoDeOrdenarPorParametro();
    markLocation();
  } catch (error) {
    console.error('Error:', error);
  }
}

function ordenarTabla(defaulVaule) {
  console.log('[Ordenar tabla]');

  return new Promise((resolve, reject) => {
    try {
      // Obtener el valor de la URL
      const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? null;
      const orderValue = defaulVaule ? defaulVaule : valorDeLaURL;

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

      if (orderValue.toLowerCase().trim() === 'picking_seq') {
        headerPositionElement = getHeaderPosition(headerRow.cells, [
          'picking_seq',
          'picking seq',
          'seq',
        ]);

        if (headerPositionElement) {
          sortValueNumeric(rows, table, headerPositionElement)
            .then(value => console.log(value))
            .catch(err => {
              console.error('Error al ordenar tabla:', err);
            });
        }
      } else if (orderValue.toLowerCase().trim() === 'location') {
        headerPositionElement = getHeaderPosition(headerRow.cells, [
          'ubicacion',
          'location',
          'localizacion',
          'loc',
        ]);

        if (headerPositionElement) {
          sortValueString(rows, table, headerPositionElement)
            .then(value => console.log(value))
            .catch(err => {
              console.error('Error al ordenar tabla:', err);
            });
        }
      }

      resolve({ header: orderValue, position: headerPositionElement });
    } catch (error) {
      console.error('Error:', error);
      reject();
      return;
    }
  });
}

function eventoDeOrdenarPorParametro() {
  // Event listener para los cambios en los inputs
  document.querySelectorAll('.filters input[name="ordernar"]').forEach(input => {
    input.addEventListener('change', handleChangeInputRadio);
  });
}

function handleChangeInputRadio() {
  try {
    const label = this.closest('label');
    label.classList.add('wait');

    const loadingContainer = document.getElementById('loading-container');
    const selectedValue = this.value;
    console.log('value:', selectedValue);

    if (selectedValue === 'NoOrdenar') {
      label.classList.remove('wait');
      return;
    }

    tablePreview.style.display = 'none';
    loadingContainer.style.display = 'flex';

    setTimeout(() => {
      ordenarTabla(selectedValue).then(() => {
        loadingContainer.style.display = 'none';
        tablePreview.style.display = 'block';
        label.classList.remove('wait');
      });
    }, 50);
  } catch (error) {
    console.error('Error:', error);
  }
}

function mostrarAnimacionDeCarga(loadingContainer) {
  loadingContainer.style.display = 'flex';
  tablePreview.innerHTML = '';
}

function ocultarAnimacionDeCarga(loadingContainer) {
  tablePreview.style.display = 'block';
  loadingContainer.style.display = 'none';
}

async function markLocation() {
  try {
    const table = document.querySelector('#tablePreview table');
    const rowsGroup = Array.from(table.querySelectorAll('tbody tr td:nth-child(1)'));

    if (!rowsGroup || !table) {
      throw new Error('No se encontraron los elementos <table> y <tbody>');
    }

    if (rowsGroup.length === 0) {
      throw new Error('No hay filas en el <tbody>');
    }

    // Obtener los valores únicos
    const valuesGroup = rowsGroup.map(td => {
      const text = td.textContent.trim();
      const prefix = text.split('-').slice(0, 2).join('-');
      return prefix;
    });

    const uniqueGroup = [...new Set(valuesGroup)];

    // Espera a que la promesa de highlightRowsByGroup se resuelva
    await highlightRowsByGroup(rowsGroup, uniqueGroup);
  } catch (error) {
    console.error('Error:', error);
  }
}

function highlightRowsByGroup(rowsGroup, uniqueGroup) {
  return new Promise((resolve, reject) => {
    if (!rowsGroup || !uniqueGroup) {
      console.error('No se encontraron los parámetros: rowsGroup o uniqueGroup');
      reject('Parámetros faltantes');
      return;
    }

    rowsGroup.forEach(td => {
      const text = td.textContent.trim();
      const prefix = text.split('-').slice(0, 2).join('-');

      if (uniqueGroup.includes(prefix)) {
        td.classList.add('group-' + uniqueGroup.indexOf(prefix));
      }
    });

    resolve();
  });
}
