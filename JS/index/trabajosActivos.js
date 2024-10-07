import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerTrabajosActivos } from '../fileProcessing/FileManagerTrabajosActivos.js';
import { UrlManager } from '../utils/URL.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerTrabajosActivos = new FileManagerTrabajosActivos();

  const fileUpload = new FileUpload({ FileManager: fileManagerTrabajosActivos });
  fileUpload.init();

  const urlmanager = new UrlManager();
  urlmanager.init();
});
