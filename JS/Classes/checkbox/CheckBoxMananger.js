export class CheckBoxMananger {
  constructor() {
    this.table = document.querySelector('#tablePreview');
    this.checkboxContainer = null;
    this.toggleButton = null;
  }

  setEventChangeToggle() {
    // Validar si el contenedor de checkboxes existe
    if (!this.checkboxContainer) {
      console.error('[setEventChangeToggle] No existe el elemento #checkboxContainer');
      return;
    }
  }
}
