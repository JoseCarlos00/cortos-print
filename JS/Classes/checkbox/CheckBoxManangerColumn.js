import { CreateCheckboxElements } from './CreateElemetCheckBox.js';
import { CheckBoxMananger } from './CheckBoxMananger.js';

export class CheckBoxManangerColumn extends CheckBoxMananger {
  constructor() {
    super();
    this.checkboxContainer = document.getElementById('checkboxContainer');
    this.toggleButton = document.getElementById('toggleButton');

    this.createElement = new CreateCheckboxElements({
      table: this.table,
      checkboxContainer: this.checkboxContainer,
    });

    this.setEventChangeToggle();
  }

  setEventChangeToggle() {
    super.setEventChangeToggle();

    this.checkboxContainer.addEventListener('click', e => {
      const { target } = e;

      if (!target) {
        console.error('[setEventChangeToggle] Error: El target no existe.');
        return;
      }

      const { nodeName, type } = target;

      if (nodeName === 'INPUT' && type === 'checkbox') {
        this.toggleColumn(target);
      }
    });
  }

  toggleColumn(target) {
    if (!target) {
      console.warn('[toggleColumn] No se encontro el elemento target ');
      return;
    }

    const columnIndex = parseInt(target.value);

    const checkboxContainer = target.closest('.checkbox-container');

    if (!this.table) {
      console.error('No existe el elemento <table>');
      return;
    }

    const rows = Array.from(
      this.table.querySelectorAll(
        `tr :is(th:nth-child(${columnIndex}), td:nth-child(${columnIndex}))`
      )
    );

    if (rows.length === 0) {
      console.warn('No hay filas <tr>');
      return;
    }

    rows.forEach(td => {
      if (target.checked) {
        td.style.display = 'table-cell';
      }

      td.classList.toggle('hidden', !target.checked);
      checkboxContainer.classList.toggle('checkbox-checked', !target.checked);
    });
  }

  hideColumns(columnsIndexs = [], isShow = true) {
    if (!this.table) {
      console.error('No existe el elemento <table>');
      return;
    }

    if (columnsIndexs.length === 0) {
      console.warn('No se especificaron columnas');
      return;
    }

    const rows = Array.from(this.table.rows);
    if (rows.length === 0) {
      console.warn('No hay filas <tr> en la tabla');
      return;
    }

    for (const row of rows) {
      for (let columnIndex = 0; columnIndex < row.cells.length; columnIndex++) {
        const cell = row.cells[columnIndex];
        if (cell) {
          const includeColumnsIndex = columnsIndexs.includes(columnIndex);

          if (isShow) {
            cell.classList.toggle('hidden', !includeColumnsIndex);
            cell.style.display = includeColumnsIndex ? 'table-cell' : 'none';
          } else {
            cell.classList.toggle('hidden', includeColumnsIndex);
            cell.style.display = includeColumnsIndex ? 'none' : 'table-cell';
          }
        }
      }
    }
  }

  /**
   * Crea input type="CheckBook" para cada Header de la tabla
   *
   * Al no pasar ningun parametro se muestran todas las columnas
   *
   * @param {type Array} columnsDefault : Indice de Columnas a ocultar
   * @param {type Bolean} isShow : Valor por defaul = true
   */
  #createCheckboxElements(columnsDefault = [], isShow = true) {
    return new Promise((resolve, reject) => {
      // crear e insertar los elementos checkbox
      this.createElement.createCheckboxElements(columnsDefault, isShow);

      // Ocultar / Mosatra columnas en el DOM
      this.hideColumns(columnsDefault, isShow);

      resolve();
    });
  }

  /**
   * Mostrar o uculatar columnas dependiendo del valor del indicio proporcionado
   * @param {Array} columnsToShow Indice de columnas a ocultar/mostar
   * @param {Bolean} showColumns Si es TRUE los indices solo mostraran esas columnas si es FALSE se ocultaran
   */
  async setCheckBoxColumn(columnsToShow = [], showColumns = true) {
    try {
      const { checkboxContainer, toggleButton } = this;

      // Validar si el contenedor de checkboxes existe
      if (!checkboxContainer) {
        console.error('[Create Filters Checkbox] Error: El contenedor de checkboxes no existe.');
        return;
      }

      // Esperar a que los checkboxes estén creados antes de asignar eventos
      await this.#createCheckboxElements(columnsToShow, showColumns);

      if (toggleButton) {
        toggleButton.removeAttribute('disabled');
      }
    } catch (error) {
      console.error('Error al crear los checkboxes:', error);
    }
  }
}
