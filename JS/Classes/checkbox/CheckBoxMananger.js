import { CreateCheckboxElements } from './CreateElemetCheckBox.js';

class CheckBoxMananger {
  constructor() {
    this.table = document.querySelector('#content');
    this.togleHandleWrapper = null;
    this.checkboxContainer = null;
    this.toggleButton = null;
  }


  setEventChangeTogle({ togleHandle }) {
    console.log('setEventChangeTogle');

    // Validar si el contenedor de checkboxes existe
    if (!this.checkboxContainer) {
      console.error('[setEventChangeTogle] No existe el elemento #checkboxContainer');
      return;
    }

    // Eliminar eventos de cambio anteriores para evitar la duplicación
    const checkboxes = this.checkboxContainer.querySelectorAll('.column-toggle');

    if (checkboxes.length === 0) {
      console.error(
        '[setEventChangeTogle] No se encontraron elementos #checkboxContainer .column-toggle'
      );
      return;
    }

    // Guardar la referencia de la función en la instancia de la clase
    if (!this.togleHandleWrapper) {
      this.togleHandleWrapper = togleHandle; // Guardar la referencia
    }

    // Remover event listeners antiguos
    checkboxes.forEach(checkbox => {
      checkbox.removeEventListener('change', e => this.togleHandleWrapper(e));
    });

    // Agregar el nuevo event listener
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', e => this.togleHandleWrapper(e));
    });
  }
}

export class CheckBoxManangerColumn extends CheckBoxMananger {
  constructor() {
    super();
    this.checkboxContainer = document.getElementById('checkboxContainerColumn');
    this.toggleButton = document.getElementById('toggleButton');
  }

  toggleColumn(e) {
    const { target } = e;
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
   * Crea input type="CheckBook" para cada columna de la tabla
   *
   * Al no pasar ningun parametro se muestran todas las columnas
   *
   * @param {type Array} columnsDefault : Indice de Columnas a ocultar
   * @param {type Bolean} isShow : Valor por defaul = true
   */

  #createCheckboxElements(columnsDefault = [], isShow = true) {
    return new Promise((resolve, reject) => {
      const createElement = new CreateCheckboxElements({ table: this.table, checkboxContainer: this.checkboxContainer })
      createElement.createCheckboxElements(columnsDefault, isShow)

      // Ocultar / Mosatra columnas en el DOM
      this.hideColumns(columnsDefault, isShow);

      resolve(); // Resolver la promesa cuando todo ha sido exitoso
    });
  }

  /**
   * Mostrar o uculatar columnas dependiendo del valor del indicio proporcionado
   * @param {Array} columnsToShow Indice de columnas a ocultar/mostar
   * @param {Bolean} showColumns Si es TRUE los indices solo mostraran esas columnas si es FALSE se ocultaran
   */
  async createFiltersCheckbox(columnsToShow = [], showColumns = true) {
    console.log('[Create Filters Checkbox]');

    try {
      const { checkboxContainer, toggleButton } = this;

      // Validar si el contenedor de checkboxes existe
      if (!checkboxContainer) {
        console.error('[createFiltersCheckbox] No existe el elemento #checkboxContainer');
        return;
      }

      checkboxContainer.innerHTML = '';

      // Esperar a que los checkboxes estén creados antes de asignar eventos
      await this.#createCheckboxElements(columnsToShow, showColumns);
      this.setEventChangeTogle({ togleHandle: this.toggleColumn });

      if (toggleButton) {
        toggleButton.removeAttribute('disabled');
      }
    } catch (error) {
      console.error('Error al crear los checkboxes:', error);
    }
  }
}

export class CheckBoxManangerRow extends CheckBoxMananger {
  constructor({ positionRow = -1 }) {
    super();
    this.checkboxContainer = document.getElementById('checkboxContainerRow');
    this.toggleButton = document.getElementById('toggleButtonRow');
    this.positionRow = positionRow;
  }

  toggleRow(e) {
    if (!this.table) {
      console.error('No existe el elemento <table>');
      return;
    }

    const { target } = e;
    if (!target) {
      console.warn('[toggleColumn] No se encontro el elemento target ');
      return;
    }

    const rows = Array.from(this.table.rows);
    const value = target.value;
    const checkboxContainer = target.closest('.checkbox-container');

    if (rows.length === 0) {
      console.warn('No hay filas <tr>');
      return;
    }

    rows.forEach(tr => {
      const rowSelected = tr.querySelector(`td:nth-child(${this.positionRow})`);

      if (rowSelected && checkboxContainer) {
        const grupoText = rowSelected.textContent.trim();

        if (grupoText === value) {
          tr.classList.toggle('hidden', !target.checked);
          checkboxContainer.classList.toggle('checkbox-checked', !target.checked);
        }
      }
    });
  }

  hiddenRows({ rowsDefault = [], isShow = true }) {
    if (!this.table) {
      console.error('No existe el elemento <table>');
      return;
    }

    if (rowsDefault.length === 0) {
      console.warn('No se especificaron columnas');
      return;
    }

    const rows = Array.from(this.table.rows);
    if (rows.length === 0) {
      console.warn('No hay filas <tr> en la tabla');
      return;
    }

    rows.forEach(tr => {
      const row = tr.querySelector(`td:nth-child(${this.positionRow})`);

      if (!row) return;

      const rowText = row.textContent.trim();
      tr.classList.toggle('hidden', !rowsDefault.includes(rowText) && isShow);
    });
  }

  /** Filter Row*/
  async #createCheckboxElementsRow({ rowsDefault = [], isShow = true, uniqueRows = [] }) {
    return new Promise((resolve, reject) => {
      // Generar los checkboxes
      if (uniqueRows.length === 0) {
        console.error('No se especificaron filas');
        reject('No se especificaron filas');
        return;
      }

      if (!this.checkboxContainer) {
        reject('No existe el elemento checkboxContainer');
        return; // Salir de la función si no se encontró el contenedor de checkboxes
      }

      uniqueRows.forEach(rowName => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        const span = document.createElement('span');

        checkbox.type = 'checkbox';
        checkbox.className = 'column-toggle';
        checkbox.value = rowName;

        span.className = 'checkmark';

        if (rowsDefault.length === 0 && isShow === true) {
          label.className = 'checkbox-container';
          checkbox.checked = true;
        } else if (
          (rowsDefault.includes(rowName) && isShow) ||
          (!rowsDefault.includes(rowName) && isShow === false)
        ) {
          checkbox.checked = true;
          label.className = 'checkbox-container';
        } else {
          checkbox.checked = false;
          label.className = 'checkbox-container checkbox-checked';
        }

        label.appendChild(checkbox);
        label.appendChild(span);
        label.appendChild(document.createTextNode(rowName));
        this.checkboxContainer.appendChild(label);
      });

      this.hiddenRows({ rowsDefault, isShow });
      resolve();
    });
  }

  async createFiltersCheckbox({ rowsDefault = [], showColumns = true, uniqueRows = [] }) {
    console.log('[Create Filters Checkbox Row]');

    try {
      const { checkboxContainer, toggleButton } = this;
      // Validar si el contenedor de checkboxes existe
      if (!checkboxContainer) {
        console.error('[createFiltersCheckboxRow] No existe el elemento #checkboxContainer');
        return;
      }

      checkboxContainer.innerHTML = '';
      await this.#createCheckboxElementsRow({
        rowsDefault,
        isShow: showColumns,
        uniqueRows,
      });

      this.setEventChangeTogle({ togleHandle: this.toggleRow });

      if (toggleButton) {
        toggleButton.removeAttribute('disabled');
      }
    } catch (error) {
      console.error('Error al crear los checkboxes:', error);
    }
  }
}
