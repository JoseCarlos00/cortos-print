// fileProcessing.js
import { insertarThead, mostrarNombreArchivo } from '../JS/operations.js';
import { getSelectedValueFromURL } from '../JS/funcionesGlobales.js';
import { createFiltersCheckbox } from '../JS/checkBox.js';
import { eventoClickCheckBoxRow, createFiltersCheckboxRow } from '../JS/chekBoxRow.js';
import { sortValueNumeric } from '../JS/sortTable.js';
import { sortValueString } from '../JS/sortTableRefactor.js';
import { getVisibleTableData, exportTable } from '../JS/exportTable.js';

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

    setEventOrderBy();
    await setEventEportTable();
  } catch (error) {
    console.error('Error:', error);
  }
}

async function setEventEportTable() {
  const btnExportExcel = document.getElementById('exportToExcel');
  const btnCopyTable = document.getElementById('copyTable');

  const table = document.querySelector('#tablePreview table');

  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', async () => {
      const visibleTable = await getVisibleTableData(table);
      exportTable({ table: visibleTable, title: 'Secuencia de Surtido' });
    });
  } else {
    console.error('No se encontro el boton para exportar Excel');
  }

  if (btnCopyTable) {
    btnCopyTable.addEventListener('click', async () => {
      const visibleTable = await getVisibleTableData(table);
      copyValueTable({ table: visibleTable });
    });
  }
}

function copyValueTable({ table }) {
  console.log('Copy table:\n', table);
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

function setEventOrderBy() {
  const radioInputs = document.querySelectorAll('.order-by-filter input[name="order-by" ]');

  if (!radioInputs.length) return;

  radioInputs.forEach(input => {
    if (!input) return;

    input.addEventListener('change', e => {
      if (!e.target) return;
      sortTableOrderBy(e.target.value);

      // Regresar el radio button a DEFAULT
      const defaultInput = document.getElementById('orderByDefault');
      if (defaultInput) {
        setInterval(() => (defaultInput.checked = true), 500);
      }
    });
  });
}

async function sortTableOrderBy(inputValue) {
  try {
    if (!inputValue) return;
    console.log(`Se ha seleccionado el orden: ${inputValue}`);

    const table = document.querySelector('#tablePreview table');

    if (!table) {
      throw new Error('No se encontró la tabla con el id: #tablePreview');
    }

    const tbody = table.querySelector('tbody');
    const visibleRows = Array.from(tbody.querySelectorAll('tr:not(.hidden)'));

    if (!visibleRows.length) {
      throw new Error('No hay filas visibles en <tbody>');
    }

    if (inputValue === 'DEFAULT') {
      return;
    } else if (inputValue === 'ASC') {
      await sortValueString(visibleRows, table, columnIndex.locationIndex);
    } else if (inputValue === 'DESC') {
      await sortLocationDesc(visibleRows, table, columnIndex.locationIndex);
    }
  } catch (error) {
    console.error('Error:', error);
    return;
  }
}

function sortLocationDesc(visibleRows, table, columnIndex) {
  return new Promise((resolve, reject) => {
    // Verifica que el columnIndex sea válido
    if (visibleRows.length === 0 || columnIndex < 0 || columnIndex >= visibleRows[0].cells.length) {
      console.error('Índice de columna no válido o sin filas.');
      reject();
      return;
    }

    const tbody = table.querySelector('tbody');

    if (!tbody) {
      throw new Error('No se eencontro el elemento <tbody>');
    }

    const regex = /^\d{1}-\d{2}-\d{2}-[A-Z]{2}-\d{2}$/;

    visibleRows.sort((a, b) => {
      const aText = a.cells[columnIndex] ? a.cells[columnIndex].innerText.trim() : '';
      const bText = b.cells[columnIndex] ? b.cells[columnIndex].innerText.trim() : '';

      const aValid = regex.test(aText);
      const bValid = regex.test(bText);

      // Colocar filas válidas después de las no válidas
      if (!aValid && bValid) return -1; // a no es válido, b sí
      if (aValid && !bValid) return 1; // a es válido, b no

      // Si ambos son válidos o ambos no válidos, proceder con el ordenamiento
      if (aValid && bValid) {
        const aCells = aText.split('-');
        const bCells = bText.split('-');

        // Extraer las partes para la comparación
        const aPrefix = aCells.slice(0, 3).join('-');
        const bPrefix = bCells.slice(0, 3).join('-');

        // Comparar por [piso-pasillo-rack] '1-82-01' de Z↓A
        if (aPrefix !== bPrefix) {
          return bPrefix.localeCompare(aPrefix); // Z a A
        }

        // Comparar por [Nivel] 'AA' de A↑Z
        if (aCells[3] !== bCells[3]) {
          return aCells[3].localeCompare(bCells[3]); // A a Z
        }

        // Comparar por posición %-%-%-AA-[03] de Z↓A
        return bCells[4].localeCompare(aCells[4]); // Z a A
      }

      // Ambos no válidos o iguales en cuanto a la validez
      return 0;
    });

    // Reinsertar las filas ordenadas en el tbody
    visibleRows.forEach(row => tbody.appendChild(row));
    resolve();
  });
}
