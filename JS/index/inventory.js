import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerInventory } from '../fileProcessing/FileManagerInventory.js';
import { UrlManager } from '../utils/URL.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerInventory = new FileManagerInventory();

  const fileUpload = new FileUpload({ FileManager: fileManagerInventory });
  fileUpload.init();

  const urlmanager = new UrlManager();
  urlmanager.init();
});
