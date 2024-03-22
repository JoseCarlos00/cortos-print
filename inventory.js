console.log('inventory.js');
import { navbar, parametrosDeLaUrl, eventoClickCheckBox } from './public/JS/funcionesGlobales.js';

import {
  handleFileInputChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
} from './public/JS/fileUpload.js';

async function content() {
  console.log('Content');
  document.getElementById('preloader').style.display = 'none';
  try {
    const container = document.querySelector('.container-file-upload-form');
    const fileInput = document.getElementById('fileInput');

    if (!fileInput) return;

    // Agregar evento de cambio para la carga de archivos
    fileInput.addEventListener('change', e => handleFileInputChange(e, fileInput, 'INVENTORY'));

    // Agregar eventos para arrastrar y soltar
    container.addEventListener('dragover', e => handleDragOver(e, container));
    container.addEventListener('dragleave', e => handleDragLeave(e, container));
    container.addEventListener('drop', e => handleDrop(e, container, fileInput, 'INVENTORY'));
  } catch (error) {
    console.log('Error:', error.message);
  }

  parametrosDeLaUrl();
  navbar();

  eventoClickCheckBox()
    .then(msg => console.log(msg))
    .catch(err => console.error('Error al crear el evento click mostrar:', err));
}

window.addEventListener('DOMContentLoaded', content);
