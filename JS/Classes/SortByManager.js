// import { urlParameters } from '../utils/URL.js';

export class SortByManager {
  constructor({ table }) {
    this.table = table;
    this.sortBy = {};
    this.handleInputChange = this.#handleInputChange.bind(this);
    this.handleSortByChange = this.#handleSortByChange.bind(this);

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

  #handleInputChange(e) {
    const { target } = e;

    if (!target) {
      console.warn('[handleInputChange]: No se encontró "target"');
    }

    const { value } = target;

    console.log(`value: ${value}\nElement: ${target}`);
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
