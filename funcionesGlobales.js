export function navbar() {
  // Obtener la lista de elementos <li> dentro de la barra de navegación
  const navItems = document.querySelectorAll('.navbar-nav .nav-item');

  // Obtener el elemento <li> que inicialmente tiene la clase "active"
  const initialActiveItem = document.querySelector('.navbar-nav .nav-item.active');

  // Función para agregar la clase "active" al elemento y quitarla de los demás elementos
  function setActive2(item) {
    if (item) {
      navItems.forEach(navItem => {
        if (navItem === item) {
          setActive(navItem);
        } else {
          removeActive(navItem);
        }
      });
    }
  }

  function setActive(item) {
    if (item) {
      item.classList.add('active');
    }
  }

  function removeActive(item) {
    if (item) {
      item.classList.remove('active');
    }
  }

  // Agregar eventos de mouseenter a cada elemento <li>
  navItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
      // Agregar la clase "active" al elemento actual y quitarla de los demás
      setActive2(this);
    });
  });

  // Restaurar el estado inicial cuando se sale del área de la barra de navegación
  const navbar = document.querySelector('.navbar');
  navbar.addEventListener('mouseleave', function () {
    // Quitar la clase "active" del elemento actual
    removeActive(document.querySelector('.navbar-nav .nav-item.active'));
    // Restaurar la clase "active" al elemento inicial
    setActive(initialActiveItem);
  });
}

// Función para obtener el valor del input seleccionado de la URL
export function getSelectedValueFromURL(value) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(value);
}

export function parametrosDeLaUrl() {
  // Función para actualizar la URL con el valor seleccionado del input
  function updateURL(selectedValue) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('ordenar', selectedValue);
    window.history.replaceState(null, null, '?' + urlParams.toString());
  }

  // Event listener para los cambios en los inputs
  document.querySelectorAll('input[name="ordernar"]').forEach(input => {
    input.addEventListener('change', function () {
      updateURL(this.value);
    });
  });

  const selectedValue = getSelectedValueFromURL('ordenar');
  if (selectedValue) {
    document.querySelector(`input[name="ordernar"][value="${selectedValue}"]`).checked = true;
  }
}

/** CheckBook */
export function createFiltersCheckbox(columnsToHide = []) {
  // Esperar a que los checkboxes estén creados antes de asignar eventos
  createCheckboxElements(columnsToHide)
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
    })
    .catch(err => {
      console.error('Error al crear los checkboxes:', err);
    });
}

function createCheckboxElements(columnsToHide) {
  return new Promise((resolve, reject) => {
    const table = document.querySelector('#tablePreview table');
    const headerRow = table.rows[0]; // Obtener la primera fila (encabezados)
    const numColumns = headerRow.cells.length;

    const checkboxContainer = document.getElementById('checkbox-container');

    if (!checkboxContainer) {
      reject('No existe el elemento checkboxContainer');
      return; // Salir de la función si no se encontró el contenedor de checkboxes
    }

    // Generar los checkboxes
    for (let i = 0; i < numColumns; i++) {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'column-toggle';
      checkbox.value = i;

      // Si el índice de la columna está en la lista de columnas a ocultar, ocultarla por defecto
      if (columnsToHide.includes(i)) {
        checkbox.checked = false;
        hideColumn(i); // Oculta la columna automáticamente
      } else {
        checkbox.checked = true;
      }

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(headerRow.cells[i].textContent));
      checkboxContainer.appendChild(label);
    }

    resolve();
  });
}

// Función para alternar la visibilidad de una columna específica
function toggleColumn() {
  const columnIndex = parseInt(this.value);
  const table = document.querySelector('#tablePreview table');
  const rows = table.rows;

  if (this.checked) {
    // Mostrar columna
    for (let i = 0; i < rows.length; i++) {
      rows[i].cells[columnIndex].style.display = 'table-cell';
    }
  } else {
    // Ocultar columna
    for (let i = 0; i < rows.length; i++) {
      rows[i].cells[columnIndex].style.display = 'none';
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
