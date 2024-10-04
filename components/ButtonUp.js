export default class ButtonUp extends HTMLElement {
  static nameElement = 'button-up';

  style = /*css*/ `
    <style>
        a {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #007acc;
          color: #fff;
          border: none;
          clip-path: circle(50% at 50% 50%);
          padding: 8px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          opacity: 0.8;
          z-index: 100;

          &:hover {
            background-color: #8e2de2;
            opacity: 1;
          }

          &:active {
            transform: scale(0.9);
          }
        }
    </style>
    `;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = /*html*/ `
      ${this.style}

      <div class="button-up-container">
        <a href="#" title="Ir arriba">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 2L3 11h6v11h6V11h6z" />
          </svg>
        </a>
      </div>
    `;
  }
}
