/** CheckBook */
function createCheckboxElements(columnsToShow, showColumns) {
  return new Promise((resolve, reject) => {
    const table = document.querySelector('#tablePreview table');
    const headerRow = table.rows[0]; // Obtener la primera fila (encabezados)
    const numColumns = headerRow.cells.length;

    const checkboxContainer = document.getElementById('checkboxContainer');

    console.log(columnsToShow);

    if (!checkboxContainer) {
      reject('No existe el elemento checkboxContainer');
      return; // Salir de la función si no se encontró el contenedor de checkboxes
    }

    // Generar los checkboxes
    for (let i = 0; i < numColumns; i++) {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      const span = document.createElement('span');

      checkbox.type = 'checkbox';
      checkbox.className = 'column-toggle';
      checkbox.value = i;

      span.className = 'checkmark';

      // Si la columna está en la lista de columnas a mostrar/ocultar y showColumns es true,
      // o si la columna no está en la lista y showColumns es false, mostrarla
      if (columnsToShow.length === 0 && showColumns === true) {
        label.className = 'checkbox-container';
        checkbox.checked = true;
      } else if (
        (columnsToShow.includes(i) && showColumns) ||
        (!columnsToShow.includes(i) && !showColumns)
      ) {
        checkbox.checked = true;
        label.className = 'checkbox-container';
      } else {
        checkbox.checked = false;
        label.className = 'checkbox-container checkbox-checked';
        hideColumn(i); // Oculta la columna automáticamente
      }

      label.appendChild(checkbox);
      label.appendChild(span);
      label.appendChild(document.createTextNode(headerRow.cells[i].textContent));
      checkboxContainer.appendChild(label);
    }

    resolve();
  });
}

// Función para mostrar u ocultar una columna específica por su índice
function toggleColumn() {
  const columnIndex = parseInt(this.value);
  const table = document.querySelector('#tablePreview table');
  const rows = table.rows;

  if (this.checked) {
    // Mostrar columna
    for (let i = 0; i < rows.length; i++) {
      rows[i].cells[columnIndex].style.display = 'table-cell';
      rows[i].cells[columnIndex].classList.remove('hidden');
      if (i === 0) {
        const checkboxContainer = this.closest('.checkboxContainer');
        checkboxContainer && checkboxContainer.classList.toggle('checkbox-checked');
      }
    }
  } else {
    // Ocultar columna
    for (let i = 0; i < rows.length; i++) {
      // rows[i].cells[columnIndex].style.display = 'none';
      rows[i].cells[columnIndex].classList.add('hidden');
      if (i === 0) {
        const checkboxContainer = this.closest('.checkboxContainer');
        checkboxContainer && checkboxContainer.classList.toggle('checkbox-checked');
      }
    }
  }
}

// Función para ocultar una columna específica por su índice
function hideColumn(columnIndex) {
  const table = document.querySelector('#tablePreview table');
  const rows = table.rows;

  for (let i = 0; i < rows.length; i++) {
    rows[i].cells[columnIndex].style.display = 'none';
  }
}

function eventoClick() {
  const toggleButton = document.getElementById('toggleButton');

  if (!toggleButton) return;
  toggleButton.removeAttribute('disabled');

  toggleButton.addEventListener('click', function () {
    const checkboxContainer = document.getElementById('checkboxContainer');
    if (!checkboxContainer) return;
    checkboxContainer.classList.toggle('mostrar');
  });
}

/**
 * Crea input type="CheckBook" para cada columna de la tabla
 *
 * Al no pasar ningun parametro se muestran todas las columnas
 *
 * @param {type Array} columnsToShow : Indice de Columnas a ocultar
 * @param {type Bolean} showColumns : Valor por defaul = true
 */
export function createFiltersCheckbox(columnsToShow = [], showColumns = true) {
  // Esperar a que los checkboxes estén creados antes de asignar eventos
  createCheckboxElements(columnsToShow, showColumns)
    .then(() => {
      // Eliminar eventos de cambio anteriores para evitar la duplicación
      const checkboxes = document.querySelectorAll('.column-toggle');
      checkboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', toggleColumn);
      });

      // Ocultar columnas
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleColumn);
      });

      eventoClick();
    })
    .catch(err => {
      console.error('Error al crear los checkboxes:', err);
    });
}
