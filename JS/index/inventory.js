import { FileUpload } from '../Classes/FileUpload.js';
import { FileManagerInventory } from '../fileProcessing/FileManagerInventory.js';
import { UrlManager } from '../utils/URL.js';

window.addEventListener('DOMContentLoaded', () => {
  const fileManagerInventory = new FileManagerInventory();

  new FileUpload({ FileManager: fileManagerInventory });
  new UrlManager();
});
