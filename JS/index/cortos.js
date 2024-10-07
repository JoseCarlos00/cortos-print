import { parametrosDeLaUrl } from '../funcionesGlobales.js';

import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerCortos } from '../fileProcessing/FileManagerCortos.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerCortos = new FileManagerCortos();

  const fileUpload = new FileUpload({ FileManager: fileManagerCortos });
  fileUpload.init();

  // parametrosDeLaUrl();
});
