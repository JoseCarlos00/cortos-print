console.log('Cortos.js');
import { parametrosDeLaUrl } from '../funcionesGlobales.js';

import { FileUpload } from '../Classes/FileUpload.js';
import { HandleFile } from '../fileProcessing/HandleFileCortos.js';

window.addEventListener('DOMContentLoaded', () => {
  const handleFile = new HandleFile();

  const fileUpload = new FileUpload({ handleFile });
  fileUpload.init();

  parametrosDeLaUrl();
});
