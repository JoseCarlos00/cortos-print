export const urlParameters = {
  /**
   * Actualiza el valor de un parámetro de consulta específico en la URL
   *
   * @param {String} queryParam Nombre del parámetro en la URL a actualizar
   * @param {String} value Nuevo valor para el parámetro
   */
  updateQueryParamInURL: (queryParam, value) => {
    const url = new URL(window.location.href);
    url.searchParams.set(queryParam, encodeURIComponent(value));

    // Actualiza la URL sin recargar la página
    window.history.pushState({}, '', url);
  },

  /**
   * Obtiene el valor de un parámetro de consulta en la URL
   *
   * Si el parámetro solicitado no se encuentra en la URL,
   * retorna una cadena vacía.
   *
   * @param {String} queryParam Nombre del parámetro en la URL a obtener
   * @returns {String} Valor obtenido del parámetro de consulta, o una cadena vacía si no existe
   */
  getQueryParamValue: queryParam => {
    const urlParams = new URLSearchParams(window.location.search);
    return decodeURIComponent(urlParams.get(queryParam) ?? '');
  },

  /**
   * Verifica si un parámetro de consulta específico está presente en la URL
   *
   * @param {String} queryParam Nombre del parámetro de consulta a verificar
   * @returns {Boolean} `true` si el parámetro existe en la URL, de lo contrario `false`
   */
  isQueryParamInUrl: queryParam => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(queryParam);
  },
};

export class UrlManager {
  #queryParams;
  #selectedValueURL;
  #updateQueryParamInURL;
  #isParamOrdenar;

  constructor() {
    this.#queryParams = new URLSearchParams(window.location.search);
    this.#selectedValueURL = urlParameters.getQueryParamValue('ordenar');
    this.#updateQueryParamInURL = urlParameters.updateQueryParamInURL;
    this.#isParamOrdenar = urlParameters.isQueryParamInUrl('ordenar');

    this.init();
  }

  init() {
    try {
      /**
       * Si existe el parámetro `ordenar` en la URL, se actualiza el estado de `checked` del input correspondiente.
       * En caso contrario, se crea un nuevo parámetro con el valor del input seleccionado.
       */
      if (this.#isParamOrdenar) {
        const selectedValue = this.#selectedValueURL;
        const ordenarInput = document.querySelector(
          `input[name="ordenar"][value="${selectedValue}"]`
        );

        if (ordenarInput) {
          ordenarInput.checked = true;
        }
      } else {
        const ordenarInputChecked = document.querySelector('input[name="ordenar"]:checked')?.value;

        if (ordenarInputChecked) {
          this.#updateQueryParamInURL('ordenar', ordenarInputChecked);
        }
      }

      this.#setEventListener();
    } catch (error) {
      console.error('Error al inicializar el manejador de URL:', error);
    }
  }

  /**
   * Añade un event listener `change` a cada `input[name="ordenar"]`
   */
  #setEventListener() {
    const inputsOrdenar = document.querySelectorAll('input[name="ordenar"]');

    if (inputsOrdenar.length === 0) {
      console.log('No se encontraron inputs[name="ordenar"]');
      return;
    }

    inputsOrdenar.forEach(input => {
      input.addEventListener('change', e => {
        const value = e.target.value;

        if (!value) {
          console.warn('[Event listener change]: No se encontró un valor');
        }

        this.#updateQueryParamInURL('ordenar', value);
      });
    });
  }

  /**
   * Muestra en la consola el estado actual de la URL y parámetros de consulta.
   */
  showStatus() {
    console.log('URL:', window.location.href);
    console.log('Query Parameters:', this.#queryParams.toString());
    console.log('Selected Value URL:', this.#selectedValueURL);
    console.log('isParamOrdenar:', this.#isParamOrdenar);
  }
}
