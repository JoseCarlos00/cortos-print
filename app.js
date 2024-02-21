async function contenido() {
  console.log('Content');
  try {
    const container = document.querySelector('.container-file-upload-form');
    const fileInput = document.getElementById('fileInput');

    if (!fileInput) return;

    // Agregar evento de cambio para la carga de archivos
    fileInput.addEventListener('change', handleFileInputChange);

    // Agregar eventos para arrastrar y soltar
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', handleDrop);

    function handleFileInputChange(e) {
      const file = e.target.files[0];
      handleFile(file);
    }

    function handleDragOver(e) {
      e.preventDefault();
      container.classList.add('drag-over');
    }

    function handleDragLeave(e) {
      e.preventDefault();
      container.classList.remove('drag-over');
    }

    function handleDrop(e) {
      e.preventDefault();
      container.classList.remove('drag-over');

      const file = e.dataTransfer.files[0];
      handleFile(file);
    }

    function handleFile(file) {
      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const data = e.target.result;

          if (!data) return;

          // Verificar la extensión del archivo para determinar el tipo de parseo
          const extension = file.name.split('.').pop().toLowerCase();

          if (extension === 'xlsx' || extension === 'csv') {
            procesarArchivo(file);
            mostrarNombreArchivo(fileInput);
          } else {
            console.log('Formato de archivo no compatible');
          }
        };

        reader.readAsArrayBuffer(file);
      }
    }

    async function procesarArchivo(file) {
      const data = await file.arrayBuffer();

      // Parse and load first worksheet
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];

      // Create HTML table
      const html = XLSX.utils.sheet_to_html(ws);
      tablePreview.innerHTML = html;

      filtrarTabla();
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

function filtrarTabla() {
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

function insertarThead() {
  const primeraFila = document.querySelector('table tbody tr:nth-child(1)');

  // html thead
  const thead = `
  <thead>
    <tr>${primeraFila.innerHTML}</tr>
  </thead>
  `;

  const table = document.querySelector('#tablePreview > table');
  table.insertAdjacentHTML('afterbegin', thead);

  // Borrar el elemento primera fila
  primeraFila.remove();
}

function mostrarNombreArchivo(input) {
  const nombreArchivo = document.getElementById('nombreArchivo');
  if (input.files.length > 0) {
    const nombre = input.files[0].name;

    nombreArchivo.textContent = nombre;
  } else {
    nombreArchivo.textContent = '';
  }
}

function ordenarTablaPorPrimeraColumna() {
  const table = document.getElementById('tablePreview').querySelector('table');
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  // Ordenar las filas basadas en el contenido de la primera columna
  rows.sort((a, b) => {
    const aValue = a.querySelector('td:first-child').innerText;
    const bValue = b.querySelector('td:first-child').innerText;
    return aValue.localeCompare(bValue);
  });

  // Reinsertar las filas ordenadas en la tabla
  rows.forEach(row => {
    table.querySelector('tbody').appendChild(row);
  });
}

window.addEventListener('DOMContentLoaded', contenido);
