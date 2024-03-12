// fileProcessing.js
import { insertarThead, mostrarNombreArchivo } from '../operations.js';

async function procesarArchivo(file) {
  const data = await file.arrayBuffer();

  // Parse and load first worksheet
  const wb = XLSX.read(data);
  const ws = wb.Sheets[wb.SheetNames[0]];

  // Create HTML table
  const html = XLSX.utils.sheet_to_html(ws);
  tablePreview.innerHTML = html;

  insertarPageBreak();
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

function insertarPageBreak() {
  insertarThead();
  ordenarTablaPorPrimeraColumna();

  // Busca y agregar la clase page-break para el salto de paguina
  const tablePreview = document.getElementById('tablePreview');

  if (!tablePreview) return;

  // filtrar y agregar clase al primer TD de cada grupo
  const filas = tablePreview.querySelectorAll('tr');

  // Iterar sobre las filas
  filas.forEach((fila, index) => {
    // Ignorar la primera fila (encabezados)
    if (index === 0) return;

    const valorPrimeraCeldaActual = fila.querySelector('td').textContent;

    // Obtener el valor de la primera celda de la fila anterior
    const valorPrimeraCeldaAnterior = filas[index - 1].querySelector('td').textContent;

    // Verificar si el valor actual es diferente al valor anterior
    if (valorPrimeraCeldaActual !== valorPrimeraCeldaAnterior) {
      if (index > 1) filas[index - 1].querySelector('td').classList.add('page-break');
    }
  });
}

function ordenarTablaPorPrimeraColumna() {
  const table = document.getElementById('tablePreview').querySelector('table');
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  // Ordenar las filas basadas en el contenido de la primera columna
  rows.sort((a, b) => {
    let aValue = a.querySelector('td:first-child').innerText;
    let bValue = b.querySelector('td:first-child').innerText;

    // Eliminar 'W-Mar Bodega ' de los valores si está presente
    if (aValue.includes('W-Mar Bodega')) {
      aValue = aValue.replace('W-Mar Bodega ', '');
    }

    if (bValue.includes('W-Mar Bodega')) {
      bValue = bValue.replace('W-Mar Bodega ', '');
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
