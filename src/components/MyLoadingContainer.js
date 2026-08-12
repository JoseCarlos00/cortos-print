class MyLoadingContainer extends HTMLElement {
	connectedCallback() {
		this.innerHTML = /*html*/ `
      <div id="loading-container">
        <label>Cargando...</label>
        <div class="loading"></div>
      </div>
    `;
	}
}

customElements.define('my-loading-container', MyLoadingContainer);
