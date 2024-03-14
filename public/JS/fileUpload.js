// fileUpload.js
import { handleFile as handleFileCortos } from '../../fileProcessing/fileProcessingCortos.js';
import { handleFile as handleFileTrabajosActivos } from '../../fileProcessing/fileProcessingTrabajosActivos.js';

export function handleFileInputChange(e, fileInput, tipo) {
  const file = e.target.files[0];

  if (tipo === 'CORTOS') {
    handleFileCortos(file, e, fileInput);
  } else if (tipo === 'TRABAJOSACTIVOS') {
    handleFileTrabajosActivos(file, e, fileInput);
  }
}

export function handleDragOver(e, container) {
  e.preventDefault();
  container.classList.add('drag-over');
}

export function handleDragLeave(e, container) {
  e.preventDefault();
  container.classList.remove('drag-over');
}

export function handleDrop(e, container, fileInput, tipo) {
  e.preventDefault();
  container.classList.remove('drag-over');

  const file = e.dataTransfer.files[0];
  if (tipo === 'CORTOS') {
    handleFileCortos(file, e, fileInput);
  } else if (tipo === 'TRABAJOSACTIVOS') {
    handleFileTrabajosActivos(file, e, fileInput);
  }
}
