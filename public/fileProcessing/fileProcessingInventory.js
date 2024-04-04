// fileProcessing.js
import { insertarThead, mostrarNombreArchivo, getHeaderPosition } from '../JS/operations.js';
import { getSelectedValueFromURL, insertarPageBreak } from '../JS/funcionesGlobales.js';
import { createFiltersCheckbox } from '../JS/checkBox.js';
import { sortValueNumeric, sortValueString, ordenarPorBodega } from '../JS/sortTable.js';

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
      const valorDeLaURL = getSelectedValueFromURL('ordenar') ?? '';
      if (valorDeLaURL && valorDeLaURL !== 'NoOrdenar') {
        ordenarTabla()
          .then(result => {
            const { header, position } = result;

            if (header.toLowerCase().trim() === 'location' && position) {
              insertarPageBreakPorLocation(position)
                .then()
                .catch(err => {
                  console.error('Error al insertar el salto de página:', err);
                });

              const header = document.querySelector('#sjs-A1');
              const headerVaule = header ? header.innerText : '';

              if (headerVaule.toLowerCase().trim() === 'frozen') {
                let showColumns = [2, 3, 4, 6, 7, 9, 10, 11, 13, 18];
                showColumns = showColumns.map(value => value - 1);

                createFiltersCheckbox(showColumns, true);
              }
            } else {
              createFiltersCheckbox();
            }
          })
          .catch(err => {
            console.error('Error al ordenar la Tabla:', err);
            createFiltersCheckbox();
          });
      } else {
        const header = document.querySelector('#sjs-A1');
        const headerVaule = header ? header.innerText : '';

        if (headerVaule.toLowerCase().trim() === 'frozen') {
          let showColumns = [2, 3, 4, 6, 7, 9, 10, 11, 13, 18];
          showColumns = showColumns.map(value => value - 1);

          createFiltersCheckbox(showColumns, true);
        } else {
          createFiltersCheckbox();
        }
      }

      tranformarValueToNumber();
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

    if (valorDeLaURL.toLowerCase().trim() === 'location') {
      headerPositionElement = getHeaderPosition(headerRow.cells, ['location', 'ubicacion']);

      if (headerPositionElement) {
        sortValueString(rows, table, headerPositionElement)
          .then(value => console.log(value))
          .catch(err => {
            console.error('Error al ordenar tabla:', err);
          });
      }
    }

    resolve({ header: valorDeLaURL, position: headerPositionElement });
  });
}

/**
 * resolve() si se inserta el salto de pagina
 *
 * reject() si no existe la tabla o el parametro de la URL a ordernar
 * @returns Una promesa
 */
function insertarPageBreakPorLocation(positionElement) {
  return new Promise((resolve, reject) => {
    // Busca y agregar la clase page-break para el salto de paguina por el valor de la url
    const table = document.querySelector('#tablePreview table');

    if (!table) {
      return reject('No se encontro la tabla con el id: #tablePreview');
    }

    if (!positionElement) {
      return reject('No se encontro la posicion del elemento');
    }

    // filtrar y agregar clase al primer TD de cada grupo
    const filas = table.querySelectorAll('tr');

    // Iterar sobre las filas
    filas.forEach((fila, index) => {
      // Ignorar la primera fila (encabezados)
      if (index === 0) return;

      let valorDeLaFilaActual = fila.querySelector(`td:nth-child(${positionElement})`).textContent;

      const locationTypeActual = valorDeLaFilaActual ? valorDeLaFilaActual.split('-') : [];

      if (locationTypeActual.length === 5) {
        valorDeLaFilaActual = locationTypeActual[1];
      }

      // Obtener el valor de la primera celda de la fila anterior
      let valorDeLaFilaAnterior = filas[index - 1].querySelector(
        `td:nth-child(${positionElement})`
      ).textContent;

      const locationTypeAnterior = valorDeLaFilaAnterior ? valorDeLaFilaAnterior.split('-') : [];

      if (locationTypeAnterior.length === 5) {
        valorDeLaFilaAnterior = locationTypeAnterior[1];
      }

      // Verificar si el valor actual es diferente al valor anterior
      if (valorDeLaFilaActual !== valorDeLaFilaAnterior) {
        if (index > 1) {
          filas[index - 1]
            .querySelector(`td:nth-child(${positionElement})`)
            .classList.add('page-break');
        }
      }
    });

    resolve('Insertar PageBreak Por Pasillo Con Exito');
  });
}

function convertToNum(filas, posicion) {
  // Iterar sobre las filas
  filas.forEach((fila, index) => {
    // Ignorar la primera fila (encabezados)
    if (index === 0) return;
    const td = fila.querySelector(`td:nth-child(${posicion})`);

    if (td) {
      const value = td.innerHTML;

      // Verificar el valor es numérico
      const valueNumeric = !isNaN(parseFloat(value)) && isFinite(value);
      if (valueNumeric) {
        td.innerHTML = parseFloat(value);
      }
    }
  });
}

function tranformarValueToNumber() {
  const filas = document.querySelectorAll('#tablePreview table tr');

  if (!filas) return;

  const primerFila = filas[0];

  if (!primerFila) return;

  // Definimos un array de objetos que contiene los nombres de los elementos y sus respectivos selectores
  const elementos = [
    { nombre: 'AV', selector: '[data-v="AV"]' },
    { nombre: 'OH', selector: '[data-v="OH"]' },
    { nombre: 'AL', selector: '[data-v="AL"]' },
    { nombre: 'IT', selector: '[data-v="IT"]' },
    { nombre: 'SU', selector: '[data-v="SU"]' },
    { nombre: 'Description', selector: '[data-v="Description"]' },
    { nombre: 'TrackContainers', selector: '[data-v="Track containers"]' },
    { nombre: 'LicensePlate', selector: '[data-v="License plate"]' },
  ];

  // Iteramos sobre cada objeto en el array de elementos
  elementos.forEach(elemento => {
    // Obtenemos el elemento correspondiente utilizando su selector
    const elementoEnFila = primerFila.querySelector(elemento.selector);
    // Verificamos si el elemento existe
    if (elementoEnFila) {
      // Obtenemos todos los hijos de la primera fila
      const hijosFila = primerFila.children;
      // Iteramos sobre los hijos de la fila
      for (let i = 0; i < hijosFila.length; i++) {
        // Verificamos si el hijo es el mismo que el elemento actual
        if (hijosFila[i] === elementoEnFila) {
          // Si encontramos la posición del elemento, la guardamos en una variable
          const posicionDelElemento = i + 1; // Sumamos 1 porque las posiciones comienzan desde 1
          console.log(`${elemento.nombre} se encuentra en la posición ${posicionDelElemento}`);
          if (
            elemento.nombre !== 'Description' &&
            elemento.nombre !== 'TrackContainers' &&
            elemento.nombre !== 'LicensePlate'
          ) {
            convertToNum(filas, posicionDelElemento);
          } else if (elemento.nombre === 'Description') {
            const style = `
            <style>
              @media print {
                table tr td:nth-child(${posicionDelElemento}) {
                  overflow: hidden;
                  max-width: 200px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            </style>`;
            document.querySelector('head').insertAdjacentHTML('beforeend', style);
          } else if (elemento.nombre === 'LicensePlate') {
            const style = `
            <style>
              @media print {
                table tr td:nth-child(${posicionDelElemento}) {
                  overflow: hidden;
                  max-width: 100px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }

              table tr td:nth-child(${posicionDelElemento}) { 
                // border: none;
              }
            </style>`;
            document.querySelector('head').insertAdjacentHTML('beforeend', style);
          } else if (elemento.nombre === 'TrackContainers') {
            const style = `
            <style>
                table tr td:nth-child(${posicionDelElemento}) {
                  opacity: 0;
                  overflow: hidden;
                  max-width: 0px;
                  white-space: nowrap;
                  border: none;
                }
                @media print {
                  table tr td:nth-child(${posicionDelElemento}) {
                   display: none;
                  }
                }
            </style>`;
            document.querySelector('head').insertAdjacentHTML('beforeend', style);
            insetarFiltrosTrackContainer(filas, posicionDelElemento);
          }
        }
      }
    }
  });
}

function insetarFiltrosTrackContainer(filas, posicionDelElemento) {
  console.log('[Insetar Filtros TrackContainer]');
  const radioInputs = document.querySelectorAll('.track-container-filter input[type="radio"]');
  const radioContainer = document.querySelector('.track-container-filter');

  radioContainer && radioContainer.classList.add('mostrar');

  if (!radioInputs) {
    return;
  }

  radioInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      const selectedValue = this.value;
      console.log('Valor seleccionado:', selectedValue);

      if (selectedValue === 'Todo') {
        ocultarFilas(filas, posicionDelElemento);
      } else if (selectedValue === 'Permanente') {
        ocultarFilas(filas, posicionDelElemento, '1');
        // Ejecutar algo si se selecciona 'value-2'
      } else if (selectedValue === 'Reserva') {
        ocultarFilas(filas, posicionDelElemento, '0');
      }
    });
  });
}

function ocultarFilas(filas, posicion, ocultar) {
  // Iterar sobre las filas
  filas.forEach((fila, index) => {
    // Ignorar la primera fila (encabezados)
    if (index === 0) return;
    const td = fila.querySelector(`td:nth-child(${posicion})`);

    if (td) {
      const value = td.innerHTML;
      const trSelected = td.closest('tr');
      if (value === ocultar) {
        console.log(value);

        console.log(trSelected);
        trSelected.classList.add('hidden');
      } else {
        trSelected.classList.remove('hidden');
      }
    }
  });
}
