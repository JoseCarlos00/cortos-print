console.log('App.js');

import { navbar } from './funcionesGlobales.js';

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
    fileInput.addEventListener('change', e => handleFileInputChange(e, fileInput, 'CORTOS'));

    // Agregar eventos para arrastrar y soltar
    container.addEventListener('dragover', e => handleDragOver(e, container));
    container.addEventListener('dragleave', e => handleDragLeave(e, container));
    container.addEventListener('drop', e => handleDrop(e, container, fileInput, 'CORTOS'));
  } catch (error) {
    console.log('Error:', error.message);
  }

  navbar();
}

window.addEventListener('DOMContentLoaded', contenido);
