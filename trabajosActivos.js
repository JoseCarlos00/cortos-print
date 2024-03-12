console.log('TrabajosActivos.js');

import {
  handleFileInputChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
} from './fileUpload.js';

async function contenido() {
  console.log('Content');
  try {
    const container = document.querySelector('.container-file-upload-form');
    const fileInput = document.getElementById('fileInput');

    if (!fileInput) return;

    // Agregar evento de cambio para la carga de archivos
    fileInput.addEventListener('change', e =>
      handleFileInputChange(e, fileInput, 'TRABAJOSACTIVOS')
    );

    // Agregar eventos para arrastrar y soltar
    container.addEventListener('dragover', e => handleDragOver(e, container));
    container.addEventListener('dragleave', e => handleDragLeave(e, container));
    container.addEventListener('drop', e => handleDrop(e, container, fileInput, 'TRABAJOSACTIVOS'));
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Función para obtener el valor del input seleccionado de la URL
  function getSelectedValueFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ordenar');
  }

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

  const selectedValue = getSelectedValueFromURL();
  if (selectedValue) {
    document.querySelector(`input[name="ordernar"][value="${selectedValue}"]`).checked = true;
  }
}

window.addEventListener('DOMContentLoaded', contenido);
