import { FileManager } from '../Classes/FileManager.js';

export class FileManagerTrabajosActivos extends FileManager {
  constructor() {
    super();
  }

  async processFile() {
    try {
      await super.processFile();
    } catch (error) {
      console.error('Error:[FileManagerTrabajosActivos]:[proccesFile]:', error);
    }
  }
}
