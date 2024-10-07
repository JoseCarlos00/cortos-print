import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerCortos } from '../fileProcessing/FileManagerCortos.js';
import { UrlManager } from '../utils/URL.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerCortos = new FileManagerCortos();

  const fileUpload = new FileUpload({ FileManager: fileManagerCortos });
  fileUpload.init();

  const urlmanager = new UrlManager();
  urlmanager.init();
});
