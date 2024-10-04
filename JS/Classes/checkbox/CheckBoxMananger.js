export class CheckBoxMananger {
  constructor() {
    this.table = document.querySelector('#tablePreview');
    this.checkboxContainer = null;
    this.toggleButton = null;
  }

  setEventChangeTogle() {
    // Validar si el contenedor de checkboxes existe
    if (!this.checkboxContainer) {
      console.error('[setEventChangeTogle] No existe el elemento #checkboxContainer');
      return;
    }
  }
}
