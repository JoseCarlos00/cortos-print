import { CheckBoxMananger } from './CheckBoxMananger.js';

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
