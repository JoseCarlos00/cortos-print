export class PageLoader extends HTMLElement {
  static nameElement = 'page-pre-loader';
  static loader = null;

  constructor() {
    super();

    window.addEventListener('load', () => {
      if (this.loader) {
        this.loader.style.display = 'none';
      }
    })
  }

  connectedCallback() {
    this.innerHTML = /*html*/`
    <div id="preloader">
    <div class="container">
    <label>Cargando...</label>
    <div class="loading"></div>
    </div>
    </div>     
    `;

    this.loader = document.querySelector('#preloader')
  }
}


export class LoaderPage extends HTMLElement {
  static nameElement = 'loading-content';

  connectedCallback() {
    this.innerHTML = /*html*/`
      <div id="loading-container">
        <label>Cargando...</label>
        <div class="loading"></div>
      </div>    
    `;
  }
}


