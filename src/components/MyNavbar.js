class MyNavbar extends HTMLElement {
	connectedCallback() {
		const active = this.getAttribute('active') ?? '';

		this.innerHTML = /*html*/ `
      <nav class="navbar">
        <ul class="navbar-nav">
          <li class="nav-item ${active === 'cortos' ? 'active' : ''}">
            <a href="./index.html?ordenar=BODEGA">Cortos</a>
          </li>
          <li class="nav-item ${active === 'trabajos' ? 'active' : ''}">
            <a href="./trabajosActivos.html?ordenar=SHIP_TO">Trabajos Activos</a>
          </li>
          <li class="nav-item ${active === 'inventory' ? 'active' : ''}">
            <a href="./inventory.html?ordenar=NoOrdenar">Inventory</a>
          </li>
          <li class="nav-item ${active === 'sequence' ? 'active' : ''}">
            <a href="./sequence.html?ordenar=NoOrdenar">Secuencia</a>
          </li>
        </ul>
      </nav>
    `;
	}
}

customElements.define('my-navbar', MyNavbar);
