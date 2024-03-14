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
  console.log('Get URL');
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(value);
}

export function parametrosDeLaUrl() {
  console.log('Parametos de la URL');
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
