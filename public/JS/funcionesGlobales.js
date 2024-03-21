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

// Función para obtener el valor de ls seleccionado de la URL
/**
 *
 * @param {String} value  String del parametro buscado de la URL
 * @returns  Valor del paramtro buscado de la URL
 */
export function getSelectedValueFromURL(value) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(value);
}

/**
 * Busca el parametro de la URL [ordenar]
 *
 * y si no lo encuentra busca el input con el atributo checked y actualiza el URL
 */
export function parametrosDeLaUrl() {
  // Función para actualizar la URL con el valor seleccionado del input
  function updateURL(selectedValue) {
    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set('ordenar', selectedValue);
    window.history.replaceState(null, null, '?' + urlParams.toString());
  }

  // Event listener para los cambios en los inputs
  document.querySelectorAll('.filters input[name="ordernar"]').forEach(input => {
    input.addEventListener('change', function () {
      updateURL(this.value);
    });
  });

  const selectedValue = getSelectedValueFromURL('ordenar');

  if (selectedValue) {
    document.querySelector(`input[name="ordernar"][value="${selectedValue}"]`).checked = true;
  } else {
    document.querySelectorAll('.filters input[name="ordernar"]').forEach(input => {
      if (input.checked) {
        updateURL(input.value);
      }
    });
  }
}

/**
 * resolve() si se inserta el salto de pagina
 *
 * reject() si no existe la tabla o el parametro de la URL a ordernar
 * @returns Una promesa
 */
export function insertarPageBreak() {
  return new Promise((resolve, reject) => {
    const valorDeLaURL = getSelectedValueFromURL('ordenar');

    // Busca y agregar la clase page-break para el salto de paguina por el valor de la url
    const table = document.querySelector('#tablePreview table');

    if (!table) {
      return reject('No se encontro la tabla con el id: #tablePreview');
    }

    if (!valorDeLaURL) {
      return reject('No se encontro el valor del parametro de la URL [ordenar]');
    }

    // filtrar y agregar clase al primer TD de cada grupo
    const filas = table.querySelectorAll('tr');

    // Iterar sobre las filas
    filas.forEach((fila, index) => {
      // Ignorar la primera fila (encabezados)
      if (index === 0) return;

      const valorDeLaFilaActual = fila.querySelector(`td:nth-child(${valorDeLaURL})`).textContent;

      // Obtener el valor de la primera celda de la fila anterior
      const valorDeLaFilaAnterior = filas[index - 1].querySelector(
        `td:nth-child(${valorDeLaURL})`
      ).textContent;

      // Verificar si el valor actual es diferente al valor anterior
      if (valorDeLaFilaActual !== valorDeLaFilaAnterior) {
        if (index > 1) {
          filas[index - 1]
            .querySelector(`td:nth-child(${valorDeLaURL})`)
            .classList.add('page-break');
        }
      }
    });

    resolve();
  });
}
