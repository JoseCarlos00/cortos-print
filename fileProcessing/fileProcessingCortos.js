// fileProcessing.js
import { insertarThead, mostrarNombreArchivo } from '../operations.js';
import { getSelectedValueFromURL } from '../funcionesGlobales.js';

async function procesarArchivo(file) {
  console.log('procesarArchivo');

  const loadingContainer = document.getElementById('loading-container');

  // Mostrar la animación de carga
  loadingContainer.style.display = 'block';

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
        // insertar Hoja de stlilos si esta ordenado por erp order
        const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? '1';

        if (valorDeLaURL === '8') {
          agregarHojaDeEstilos();
        } else {
          quitarHojaDeEstilos();
        }

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
    ordenarTabla().then(() => {
      insertarPageBreak();
    });
  });
}

function insertarPageBreak() {
  const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? '1';

  // Busca y agregar la clase page-break para el salto de paguina
  const tablePreview = document.getElementById('tablePreview');

  if (!tablePreview) return;

  // filtrar y agregar clase al primer TD de cada grupo
  const filas = tablePreview.querySelectorAll('tr');

  // Iterar sobre las filas
  filas.forEach((fila, index) => {
    // Ignorar la primera fila (encabezados)
    if (index === 0) return;

    const valorDeLaFilaActual = fila.querySelector(`td:nth-child(${valorDeLaURL})`).textContent;
    // console.log('valorDeLaFilaActual:', valorDeLaFilaActual);

    // Obtener el valor de la primera celda de la fila anterior
    const valorDeLaFilaAnterior = filas[index - 1].querySelector(
      `td:nth-child(${valorDeLaURL})`
    ).textContent;

    // console.log('valorDeLaFilaAnterior:', valorDeLaFilaAnterior);

    // Verificar si el valor actual es diferente al valor anterior
    if (valorDeLaFilaActual !== valorDeLaFilaAnterior) {
      if (index > 1) {
        filas[index - 1].querySelector(`td:nth-child(${valorDeLaURL})`).classList.add('page-break');
      }
    }
  });
}

function ordenarTabla() {
  return new Promise((resolve, reject) => {
    // Obtener el valor de la URL
    const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? '1';

    const table = document.getElementById('tablePreview').querySelector('table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    // Ordenar las filas basadas en el contenido de la primera columna
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
      } else if (valorDeLaURL === '8') {
        aValue = aValue.split('-')[1];
        bValue = bValue.split('-')[1];
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
    resolve();
  });
}

// Función para agregar la hoja de estilos
function agregarHojaDeEstilos() {
  const linkElement = document.getElementById('customStylesheet') ?? null;

  if (linkElement) return;

  const linkElementCreate = document.createElement('link');
  linkElementCreate.rel = 'stylesheet';
  linkElementCreate.href = './public/cortos.css'; // Aquí debes colocar la ruta de tu archivo CSS
  linkElementCreate.id = 'customStylesheet';
  document.head.appendChild(linkElementCreate);
}

// Función para quitar la hoja de estilos
function quitarHojaDeEstilos() {
  const linkElement = document.getElementById('customStylesheet') ?? null;
  if (linkElement) {
    linkElement.remove();
  }
}
