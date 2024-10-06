import { FileManager } from '../Classes/FileManager.js';

export class FileManagerCortos extends FileManager {
  constructor() {
    super();
  }

  async processFile() {
    try {
      await super.processFile();
    } catch (error) {
      console.error('Error:[FileManagerCortos]:[proccesFile]:', error);
    }
  }
}
