export class CreateCheckboxElements {
  constructor({ table, checkboxContainer }) {
    this.table = table;
    this.checkboxContainer = checkboxContainer;
  }

  createCheckboxElements(columnsDefault = [], isShow = true) {
    // Validar si el elemento de la tabla existe
    if (!this.table) {
      console.error('[createCheckboxElements] No existe el elemento <table>');
      return;
    }

    // Validar si el contenedor de checkboxes existe
    if (!this.checkboxContainer) {
      console.error('[createCheckboxElements] No existe el elemento checkboxContainer');
      return;
    }

    // Obtener los encabezados de la tabla
    const headerRows = Array.from(this.table.querySelectorAll('thead tr td'));
    if (headerRows.length === 0) {
      console.warn('No hay encabezados en la tabla');
      return;
    }

    const row = document.createElement('div');
    row.classList.add('row');

    headerRows.forEach((header, index) => {
      const headerText = header.textContent.trim();

      // Crear el componente Checkbox
      const col = document.createElement('div');
      col.className = 'col';

      // Crear el checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input';
      checkbox.value = index + 1;

      // Configurar el estado del checkbox
      if (columnsDefault.length === 0 && isShow) {
        // Todas las columnas habilitadas
        checkbox.checked = true;
      } else if (
        (columnsDefault.includes(index) && isShow) ||
        (!columnsDefault.includes(index) && !isShow)
      ) {
        // Habilitar Columna
        checkbox.checked = true;
      } else {
        // Deshabilitar Columna
        checkbox.checked = false;
      }

      // Crear la etiqueta del checkbox
      const label = document.createElement('label');
      label.className = 'form-check-label';

      // Crear el contenedor d-inline-felx
      const divContainer = document.createElement('div');
      divContainer.className = 'd-inline-flex';

      // Crear elemento span
      const span = document.createElement('span');
      span.textContent = headerText;

      // Añadir el checkbox y el texto al contenedor
      divContainer.appendChild(checkbox);
      divContainer.appendChild(span);

      label.appendChild(divContainer);
      col.appendChild(label);

      row.appendChild(col);
    });

    // Añadir elementos al DOM
    // this.checkboxContainer.appendChild(row);
    console.log('ROW');
    console.log(row);
  }
}
