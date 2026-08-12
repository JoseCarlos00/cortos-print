class MyPreloader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = /*html*/ `
      <div id="preloader">
        <div class="container">
          <label>Cargando...</label>
          <div class="loading"></div>
        </div>
      </div>
    `;
	}
}

customElements.define('my-preloader', MyPreloader);
