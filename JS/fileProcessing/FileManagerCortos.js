import { FileManager } from '../Classes/FileManager.js';

export class FileManagerCortos extends FileManager {
  constructor() {
    super();

    this.columnIndex = {
      bodega: -1,
      'erp order': -1,
      pedido: -1,
      'por piso': -1,
    };

    this.mapIndex = [
      { key: 'bodega', values: ['bodega', 'almacen', 'work_zone', 'work zone', 'zona'] },
      { key: 'erp order', values: ['erp order', 'erp_order'] },
      { key: 'pedido', values: ['shipment id', 'shipment_id', 'pedido'] },
      { key: 'por piso', values: ['zona', 'work_zone', 'work zone', 'bodega'] },
    ];
  }

  async processFile() {
    try {
      await super.processFile();
      console.log('columnIndex:\n', this.columnIndex);
      console.log('Valor de ordenacion actual:', this.valueOrderBy);
    } catch (error) {
      console.error('Error:[FileManagerCortos]:[proccesFile]:', error);
    }
  }

  async handleSortTable() {
    try {
      const valueOrderBy = this.valueOrderBy;
      const columnIndex = this.columnIndex[valueOrderBy];

      if (columnIndex < 0) {
        this.showTable();
      }

      console.warn('Ordenar Tabla', columnIndex);
      await this.SortByManager.SortTable.sortTableByStringValue(columnIndex);
      await this.SortByManager.InsertPageBreak.insertPageBreak(columnIndex + 1);

      this.showTable();
    } catch (error) {
      console.error('Error:[FileManagerCortos]:[handleSortTable]:', error);
      this.showTable();
    }
  }
}
