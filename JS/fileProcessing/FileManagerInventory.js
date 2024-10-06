import { FileManager } from '../Classes/FileManager.js';

export class FileManagerInventory extends FileManager {
  constructor() {
    super();
  }

  async processFile() {
    try {
      await super.processFile();
    } catch (error) {
      console.error('Error:[FileManagerInventory]:[proccesFile]:', error);
    }
  }
}
