import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerSecuence } from '../fileProcessing/FileManagerSecuence.js';
import { UrlManager } from '../utils/URL.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerSecuence = new FileManagerSecuence();

  new FileUpload({ FileManager: fileManagerSecuence });
  new UrlManager();
});
