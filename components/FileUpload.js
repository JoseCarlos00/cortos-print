export default class FileUpload extends HTMLElement {
  static nameElement = 'container-file-upload';

  connectedCallback() {
    this.innerHTML = /*html*/ `
      <div class="container-file-upload ps-4">
        <div class="container-file-upload-form">
          <form class=" file-upload-form">
          <label for="fileInput" class="file-upload-label">
            <div class="file-upload-design">
              <svg viewBox="0 0 640 520" height="1em">
                <path
                  d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144z"
                  fill="#007ACC" stroke="#007ACC" stroke-width="0"></path>
                <path
                  d="M223 263c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                  fill="#fff"></path>
              </svg>
              <p class="file-upoad-label-text">Arrastrar y soltar</p>
              <p class="file-upoad-label-text">o</p>
              <span class="browse-button">
                <span class="browse-button-text">Browse file</span>
              </span>
            </div>
            <input id="fileInput" type="file" accept=".xlsx, .xls, .csv" />
          </label>
          </form>
        </div>

        <div class="nombre-de-archivo">
          <div class="circulo"></div>
          <div id="nombreArchivo"></div>
        </div>
      </div>  
    `;
  }
}
