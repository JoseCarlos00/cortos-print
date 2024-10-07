import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerSecuence } from '../fileProcessing/FileManagerSecuence.js';
import { UrlManager } from '../utils/URL.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerSecuence = new FileManagerSecuence();

  const fileUpload = new FileUpload({ FileManager: fileManagerSecuence });
  fileUpload.init();

  const urlmanager = new UrlManager();
  urlmanager.init();
});
