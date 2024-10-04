import { FileManager } from '../Classes/FileManager.js';
import { CheckBoxManangerColumn } from '../Classes/checkbox/CheckBoxManangerColumn.js';

export class HandleFile extends FileManager {
  constructor() {
    super();

    this.checkBoxMananger = new CheckBoxManangerColumn();
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
      await this.checkBoxMananger.setCheckBoxColumn();
    } catch (error) {}
  }
}
