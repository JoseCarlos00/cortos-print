// fileProcessing.js
import { insertarThead, mostrarNombreArchivo } from '../JS/operations.js';
import { getSelectedValueFromURL } from '../JS/funcionesGlobales.js';
import { createFiltersCheckbox } from '../JS/checkBox.js';
import { eventoClickCheckBoxRow, createFiltersCheckboxRow } from '../JS/chekBoxRow.js';
import { sortValueNumeric } from '../JS/sortTable.js';
import { sortValueString } from '../JS/sortTableRefactor.js';

// Global variables
const columnIndex = {
  locationIndex: -1,
  locationPosition: -1,
  pickingSeqIndex: -1,
  pickingSeqPosition: -1,
};

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
    await setColumnIndex();

    const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? '';

    if (valorDeLaURL !== 'NoOrdenar') {
      await sortTableForUrl();
    }

    let showColumns = [columnIndex.locationIndex, columnIndex.pickingSeqIndex];
    createFiltersCheckbox(showColumns, true);

    eventoDeOrdenarPorParametro();
    markLocation();
    eventoClickCheckBoxRow().then(() => createFiltersCheckboxRow());

    const filterTable = document.getElementById('filter-table');
    filterTable && filterTable.classList.remove('hidden');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function setColumnIndex() {
  const table = document.querySelector('#tablePreview table');

  if (!table) {
    console.error('No se encontro el elemento <table>');
    return;
  }

  const headerRow = table.rows[0] ? Array.from(table.rows[0].cells) : [];

  if (headerRow.length === 0) {
    console.error('No hay filas en Header Row');
    return;
  }

  const pickingSeq = ['picking_seq', 'picking seq', 'seq'];
  const loc = ['ubicacion', 'location', 'localizacion', 'loc'];

  headerRow.forEach((th, index) => {
    const text = th.textContent.trim().toLowerCase();

    if (loc.includes(text)) {
      columnIndex.locationIndex = index;
      columnIndex.locationPosition = index + 1;
    }
    if (pickingSeq.includes(text)) {
      columnIndex.pickingSeqIndex = index;
      columnIndex.pickingSeqPosition = index + 1;
    }
  });
}

async function sortTableForUrl() {
  const valorDeLaURL = getSelectedValueFromURL('ordenar');

  if (!valorDeLaURL) {
    throw new Error('No se encontro el valor de la URL');
  }

  await ordenarTabla({ orderValue: valorDeLaURL });
}

async function ordenarTabla({ orderValue: orderValueParam }) {
  try {
    const table = document.querySelector('#tablePreview table');

    if (!table) {
      throw new Error('No se encontro la tabla con el id: #tablePreview');
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    if (!rows.length) {
      throw new Error('No hay filas en <tbody>');
    }

    const orderValue = orderValueParam ? orderValueParam.toLowerCase() : '';

    const sortFunctions = {
      picking_seq: (rows, table) => sortValueNumeric(rows, table, columnIndex.pickingSeqPosition),
      location: (rows, table) => sortValueString(rows, table, columnIndex.locationIndex),
    };

    if (sortFunctions[orderValue]) {
      await sortFunctions[orderValue](rows, table);
    } else {
      throw new Error(`No se encontró la función de ordenamiento para ${orderValue}`);
    }
  } catch (error) {
    console.error('Error:', error);
    return;
  }
}

function eventoDeOrdenarPorParametro() {
  // Event listener para los cambios en los inputs
  document.querySelectorAll('.filters input[name="ordernar"]').forEach(input => {
    input.addEventListener('change', handleChangeInputRadio);
  });
}

async function handleChangeInputRadio() {
  try {
    const label = this.closest('label');
    label.classList.add('wait');

    const loadingContainer = document.getElementById('loading-container');
    const selectedValue = this.value;
    console.log('selectedValue:', selectedValue);

    if (selectedValue === 'NoOrdenar') {
      label.classList.remove('wait');
      return;
    }

    tablePreview.style.display = 'none';
    loadingContainer.style.display = 'flex';

    await ordenarTabla({ orderValue: selectedValue });

    ocultarAnimacionDeCarga(loadingContainer);
    label.classList.remove('wait');
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

    const rowsGroup = Array.from(
      table.querySelectorAll(`tbody tr td:nth-child(${columnIndex.locationPosition})`)
    );

    if (!rowsGroup || !table) {
      throw new Error('No se encontraron los elementos <table> y <tbody>');
    }

    if (rowsGroup.length === 0) {
      throw new Error('No hay filas en el <tbody>');
    }

    const regex = /^\d{1}-\d{2}-\d{2}-[A-Z]{2}-\d{2}$/;

    const valuesGroup = rowsGroup.map(td => {
      const text = td.textContent.trim();
      const isMatch = regex.test(text);

      return isMatch ? text.split('-').slice(0, 2).join('-') : text;
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

    const regex = /^\d{1}-\d{2}-\d{2}-[A-Z]{2}-\d{2}$/;
    rowsGroup.forEach(td => {
      const text = td.textContent.trim();
      const isMatch = regex.test(text);

      const prefix = isMatch ? text.split('-').slice(0, 2).join('-') : text;

      if (uniqueGroup.includes(prefix)) {
        td.classList.add('group-' + uniqueGroup.indexOf(prefix));
      }
    });

    resolve();
  });
}
