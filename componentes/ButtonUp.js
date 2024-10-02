export default class ButtonUp extends HTMLElement {
  static nameElement = 'button-up';

  connectedCallback() {
    this.innerHTML = /*html*/`
      <div class="button-up-container">
        <a href="#" id="goToTopButton" title="Ir arriba">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 2L3 11h6v11h6V11h6z" />
          </svg>
        </a>
      </div>
    `;
  }
}
