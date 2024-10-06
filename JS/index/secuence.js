import { parametrosDeLaUrl } from '../funcionesGlobales.js';

import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerSecuence } from '../fileProcessing/FileManagerSecuence.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerSecuence = new FileManagerSecuence();

  const fileUpload = new FileUpload({ FileManager: fileManagerSecuence });
  fileUpload.init();

  parametrosDeLaUrl();
});
