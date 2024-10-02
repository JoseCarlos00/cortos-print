export default class MenuNav extends HTMLElement {
  static nameElement = 'menu-nav'

  static get observedAttributes() {
    return ['page-active'];
  }


  constructor() {
    super()

    this.active = '';
    this.hrefs = [
      { text: 'Cortos', href: './cortos.html?ordenar=BODEGA', },
      { text: 'Trabajos Activos', href: './trabajosActivos.html?ordenar=SHIP_TO' },
      { text: 'Inventory', href: './inventory.html?ordenar=NoOrdenar' },
      { text: 'Secuencia', href: './secuence.html?ordenar=NoOrdenar' },
    ]
  }

  createUlElement() {
    const ulElement = document.createElement('ul');

    this.hrefs.forEach(({ text, href }) => {
      const li = document.createElement('li');
      li.className = 'nav-item';

      if (this.active === text) {
        li.innerHTML = `<a class="nav-link active" aria-current="page" href="#">${text}</a>`
      } else {
        li.innerHTML = `<a class="nav-link" href="${href}">${text}</a>`
      }

      ulElement.appendChild(li);
    });

    return ulElement;
  }

  connectedCallback() {
    this.innerHTML = /*html*/`
      <nav class="navbar navbar-expand-lg bg-primary">
      <div class="container-fluid justify-content-center">
        <ul class="nav nav-underline">
          ${this.createUlElement().innerHTML}
        </ul>
      </div>
    </nav>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.active = newValue;
  }
}