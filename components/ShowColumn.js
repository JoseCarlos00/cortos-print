export class ButtonShowColumn extends HTMLButtonElement {
  static nameElement = 'button-show-column';

  static get observedAttributes() {
    return ['text-content'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.id = 'toggleButton';
    this.className = 'btn btn-primary collapse-button collapsed';
    this.type = 'button';

    this.setAttribute('data-bs-toggle', 'collapse');
    this.setAttribute('data-bs-target', '#collapseShow-Hideen-Columns');
    this.setAttribute('aria-expanded', 'false');
    this.setAttribute('aria-controls', 'collapseShow-Hideen-Columns');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.textContent = newValue;
  }
}

export class CheckboxContainer extends HTMLElement {
  static nameElement = 'checkbox-container';
  constructor() {
    super();
  }

  connectedCallback() {
    this.id = 'collapseShow-Hideen-Columns';
    this.className = 'collapse collapse-container';

    this.setAttribute('data-bs-toggle', 'collapse');
    this.setAttribute('data-bs-target', '#collapseShow-Hideen-Columns');
    this.setAttribute('aria-expanded', 'false');
    this.setAttribute('aria-controls', 'collapseShow-Hideen-Columns');

    this.innerHTML = /*html*/ `
      <div class="card card-body">
        <div id="checkboxContainer" class="checkbox-container"></div>
      </div>
    `;
  }
}
