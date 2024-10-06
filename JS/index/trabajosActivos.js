import { parametrosDeLaUrl } from '../funcionesGlobales.js';

import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerTrabajosActivos } from '../fileProcessing/FileManagerTrabajosActivos.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerTrabajosActivos = new FileManagerTrabajosActivos();

  const fileUpload = new FileUpload({ FileManager: fileManagerTrabajosActivos });
  fileUpload.init();

  parametrosDeLaUrl();
});
