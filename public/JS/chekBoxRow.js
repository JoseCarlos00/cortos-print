/** CheckBook */
// Función para mostrar u ocultar una fila específica por su value
import { getHeaderPosition } from './operations.js';

function toggleRow() {
  const table = document.querySelector('#tablePreview table');
  const rows = Array.from(table.rows);
  const value = this.value;

  const headerRow = table.rows[0];
  const columnIndex =
    getHeaderPosition(headerRow.cells, ['ubicacion', 'location', 'localizacion', 'loc']) ?? -1;
  const checkboxContainer = this.closest('.checkbox-container');

  if (!table || !rows) {
    console.error('No existe el elemento <table>');
    return;
  }

  if (rows.length === 0) {
    console.warn('No hay filas <tr>');
    return;
  }

  const regex = /^\d{1}-\d{2}-\d{2}-[A-Z]{2}-\d{2}$/;

  rows.forEach(tr => {
    const grupoElement = tr.querySelector(`td:nth-child(${columnIndex})`);

    if (grupoElement && checkboxContainer) {
      const text = grupoElement.textContent.trim();
      const isMatch = regex.test(text);

      const prefix = isMatch ? text.split('-').slice(0, 2).join('-') : text;

      if (prefix === value) {
        tr.classList.toggle('hidden', !this.checked);
        checkboxContainer.classList.toggle('checkbox-checked', !this.checked);
      }
    }
  });
}

export function eventoClickCheckBoxRow() {
  return new Promise((resolve, reject) => {
    const toggleButton = document.getElementById('toggleButtonRow');

    // Obtener el elemento del path SVG
    const togglePath = document.querySelector('#toggleButtonRow .toggleIcon path');

    if (!toggleButton) {
      return reject('No existe el elemento #toggleButtonRow');
    }

    if (!togglePath) {
      return reject('No existe el elemento #toggleButtonRow .toggleIcon path');
    }

    // Definir la función que se utilizará para manejar el evento 'click'
    const toggleButtonClickHandler = function () {
      const checkboxContainer = document.getElementById('checkboxContainerRow');
      if (!checkboxContainer) {
        return reject('No existe el elemento #checkboxContainer');
      }

      // Verificar si la clase 'mostrar' está presente en el checkboxContainer
      if (!checkboxContainer.classList.contains('show')) {
        // Si no está presente, la agregamos
        checkboxContainer.classList.add('show');
        // Cambiar el atributo "d" del path SVG para representar un símbolo de menos(-)
        togglePath.setAttribute('d', 'M5 12h14');
      } else {
        // Si está presente, la eliminamos
        checkboxContainer.classList.remove('show');
        // Cambiar el atributo "d" del path SVG para representar un símbolo de más(+)
        togglePath.setAttribute('d', 'M12 19v-7m0 0V5m0 7H5m7 0h7');
      }
    };

    toggleButton.removeEventListener('click', toggleButtonClickHandler);

    // Agregar el evento 'click' al toggleButton
    toggleButton.addEventListener('click', toggleButtonClickHandler);

    // Resolver la promesa con un mensaje indicando que el evento se ha creado correctamente
    resolve('Evento click row creado correctamente');
  });
}

/** Filter Group */
async function createCheckboxElementsGroup(columnsDefaul = [], show = true) {
  return new Promise((resolve, reject) => {
    const table = document.querySelector('#tablePreview table');
    const headerRow = table.rows[0];

    const headerPositionElement =
      getHeaderPosition(headerRow.cells, ['ubicacion', 'location', 'localizacion', 'loc']) ?? -1;

    const rowsGroup = Array.from(
      table.querySelectorAll(`tbody tr td:nth-child(${headerPositionElement})`)
    );

    if (!rowsGroup || !table) {
      reject('No se encontraron los elementos <table> and <tbody>');
      return;
    }

    if (rowsGroup.length === 0) {
      reject('No hay filas en el <tbody>');
      return;
    }

    const checkboxContainer = document.getElementById('checkboxContainerRow');

    if (!checkboxContainer) {
      reject('No existe el elemento checkboxContainer');
      return;
    }

    const regex = /^\d{1}-\d{2}-\d{2}-[A-Z]{2}-\d{2}$/;

    const valuesGroup = rowsGroup.map(td => {
      const text = td.textContent.trim();
      const isMatch = regex.test(text);

      return isMatch ? text.split('-').slice(0, 2).join('-') : text;
    });

    const uniqueGroup = [...new Set(valuesGroup)].sort();

    // Generar los checkboxes
    uniqueGroup.forEach(groupName => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      const span = document.createElement('span');

      checkbox.type = 'checkbox';
      checkbox.className = 'column-toggle';
      checkbox.value = groupName;

      span.className = 'checkmark';

      if (columnsDefaul.length === 0 && show === true) {
        label.className = 'checkbox-container';
        checkbox.checked = true;
      } else if (
        (columnsDefaul.includes(groupName) && show) ||
        (!columnsDefaul.includes(groupName) && show === false)
      ) {
        checkbox.checked = true;
        label.className = 'checkbox-container';
      } else {
        checkbox.checked = false;
        label.className = 'checkbox-container checkbox-checked';
      }

      label.appendChild(checkbox);
      label.appendChild(span);
      label.appendChild(document.createTextNode(groupName));
      checkboxContainer.appendChild(label);
    });

    resolve();
  });
}

export function createFiltersCheckboxRow(columnsToShow = [], showColumns = true) {
  console.log('[Create Filters Checkbox Row]');

  const checkboxContainer = document.getElementById('checkboxContainerRow');
  checkboxContainer && (checkboxContainer.innerHTML = '');

  // Esperar a que los checkboxes estén creados antes de asignar eventos
  createCheckboxElementsGroup(columnsToShow, showColumns)
    .then(() => {
      // Eliminar eventos de cambio anteriores para evitar la duplicación
      const checkboxes = document.querySelectorAll('#checkboxContainerRow .column-toggle');
      checkboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', toggleRow);
      });

      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleRow);
      });

      const toggleButton = document.getElementById('toggleButtonRow');

      if (toggleButton) {
        toggleButton.removeAttribute('disabled');
      }
    })
    .catch(err => {
      console.error('Error al crear los checkboxes:', err);
    });
}
