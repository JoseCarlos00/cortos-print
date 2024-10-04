export class CreateCheckboxElements {
  constructor({ table, checkboxContainer }) {
    this.table = table;
    this.checkboxContainer = checkboxContainer;
  }

  createCheckboxElements(columnsDefault = [], isShow = true) {
    try {
      // Validar si el elemento de la tabla existe
      if (!this.table) {
        throw new Error('[createCheckboxElements] No existe el elemento <table>');
      }

      // Validar si el contenedor de checkboxes existe
      if (!this.checkboxContainer) {
        throw new Error('[createCheckboxElements] No existe el elemento <checkboxContainer>');
      }

      this.checkboxContainer.innerHTML = '';

      // Obtener los encabezados de la tabla
      const headerRows = Array.from(this.table.rows[0].cells);

      if (headerRows.length === 0) {
        throw new Error('[createCheckboxElements] No hay encabezados en la tabla');
      }

      const gridContainer = document.createElement('div');
      gridContainer.classList.add('grid');
      gridContainer.style = '--bs-columns: 5;gap: 6px 12px;';

      headerRows.forEach((header, index) => {
        const headerText = header.textContent.trim();

        // Crear el componente Checkbox
        const div = document.createElement('div');

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
        div.appendChild(label);

        gridContainer.appendChild(div);
      });

      // Añadir elementos al DOM
      this.checkboxContainer.appendChild(gridContainer);
    } catch (error) {
      console.error(
        'Error: [CreateCheckboxElements]: Error al crear e insertar los elementos checkboxea',
        error
      );
    }
  }
}
