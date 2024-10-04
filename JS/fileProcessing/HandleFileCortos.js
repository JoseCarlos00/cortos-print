import { FileManager } from '../Classes/FileManager.js';

export class HandleFile extends FileManager {
  constructor() {
    super();
  }

  async processFile() {
    try {
      await super.processFile();
    } catch (error) {
      console.error('Error:[HandleFile]:[proccesFile]:', error);
    }
  }
}
