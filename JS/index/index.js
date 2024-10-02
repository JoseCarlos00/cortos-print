console.log('Index.js');

import { navbar, parametrosDeLaUrl, eventoClickCheckBox } from './public/JS/funcionesGlobales.js';

import {
  handleFileInputChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
} from './public/JS/fileUpload.js';

async function content() {
  console.log('Content');
  // document.getElementById('preloader').style.display = 'none';
  try {
    const container = document.querySelector('.container-file-upload-form');
    const fileInput = document.getElementById('fileInput');

    if (!fileInput) return;

    // Agregar evento de cambio para la carga de archivos
    fileInput.addEventListener('change', e => handleFileInputChange(e, fileInput, 'CORTOS'));

    // Agregar eventos para arrastrar y soltar
    container.addEventListener('dragover', e => handleDragOver(e, container));
    container.addEventListener('dragleave', e => handleDragLeave(e, container));
    container.addEventListener('drop', e => handleDrop(e, container, fileInput, 'CORTOS'));
  } catch (error) {
    console.log('Error:', error.message);
  }

  parametrosDeLaUrl();

}

window.addEventListener('DOMContentLoaded', content);
