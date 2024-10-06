import { parametrosDeLaUrl } from '../funcionesGlobales.js';

import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerInventory } from '../fileProcessing/FileManagerInventory.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerInventory = new FileManagerInventory();

  const fileUpload = new FileUpload({ FileManager: fileManagerInventory });
  fileUpload.init();

  parametrosDeLaUrl();
});
