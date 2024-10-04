import { FileManager } from '../Classes/FileManager.js';
import { CheckBoxManangerColumn } from '../Classes/checkbox/CheckBoxMananger.js';

export class HandleFile extends FileManager {
  constructor() {
    super();
  }

  async processFile() {
    try {
      await super.processFile();
      await this.checkBoxColumn();
    } catch (error) {
      console.error('Error:[HandleFile]:[proccesFile]:', error);
    }
  }

  async checkBoxColumn() {
    try {
      const checkBoxMananger = new CheckBoxManangerColumn();
      await checkBoxMananger.setCheckBoxColumn();
    } catch (error) {}
  }
}
