import { SortTable } from './SortTable.js';
import { InsertPageBreak } from './InsertPageBreak.js';

export class SortTableManager {
  constructor({ table, handleInputChange }) {
    this.table = table;

    this.handleInputChange = handleInputChange;
    this.handleSortByChange = this.#handleSortByChange.bind(this);

    this.SortTable = new SortTable({ table });
    this.InsertPageBreak = new InsertPageBreak({ table });

    this.init();
  }

  /**
   * Añade un event listener `change` a cada `input[name="ordenar"]`
   */
  #setEventListener() {
    const inputsOrdenar = document.querySelectorAll('input[name="ordenar"]');

    if (inputsOrdenar.length === 0) {
      console.error('No se encontraron inputs[name="ordenar"]');
      return;
    }

    inputsOrdenar.forEach(input => {
      input.addEventListener('change', this.handleInputChange);
    });
  }

  #handleSortByChange(e) {
    const { target } = e;

    if (!target) {
      console.warn('[handleInputChange]: No se encontró "target"');
    }

    const { name, value } = target;
  }

  init() {
    try {
      this.#setEventListener();
    } catch (error) {
      console.error('Error al inicializar la class SortByManager:', error);
    }
  }
}
