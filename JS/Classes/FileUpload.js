export class FileUpload {
  constructor({ handleFile }) {
    this.handleFile = handleFile;
    this.container = document.querySelector('.container-file-upload-form');
    this.fileInput = document.getElementById('fileInput');

    this.form = document.querySelector('.container-file-upload-form > form');
    this.nameFile = document.getElementById('nombreArchivo');
    this.nameFileElement = document.querySelector('.nombre-de-archivo');
  }

  init() {
    try {
      const { container, fileInput, handleFile } = this;

      if (!container) {
        throw new Error('Container element not found.');
      }

      if (!fileInput) {
        throw new Error('File input element not found.');
      }

      if (!handleFile) {
        throw new Error('handleFile function not provided.');
      }

      this.#setUpEventListener();
    } catch (error) {
      console.error('Error: Error initializing [FileUpload:]', error);
    }
  }


  #setUpEventListener() {
    const { container, fileInput } = this;

    // Agregar evento de cambio para la carga de archivos
    fileInput.addEventListener('change', e => this.onFileChange(e));

    // Agregar eventos para arrastrar y soltar
    container.addEventListener('dragover', e => this.onDragOver(e));
    container.addEventListener('dragleave', e => this.onDragLeave(e));
    container.addEventListener('drop', e => this.onDrop(e));
  }

  onDragOver(e) {
    e.preventDefault();
    this.container.classList.add('drag-over');
  }

  onDragLeave(e) {
    e.preventDefault();
    this.container.classList.remove('drag-over');
  }

  onFileChange(e) {
    const { target } = e;

    if (!target) {
      console.error('Error: [onFileChange] "Target" element not found.');
      return;
    }

    const { files } = target;
    this.sendFileToHandler(files)
  }

  onDrop(e) {
    e.preventDefault();
    this.container.classList.remove('drag-over');

    const { dataTransfer } = e;

    if (!dataTransfer) {
      console.error('Error: [onDrop] No "dataTransfer" available.');
      return;
    }

    const { files } = dataTransfer;
    this.sendFileToHandler(files)
  }

  sendFileToHandler(files) {
    if (!files) {
      console.error('Error: [sendFileToHandler] No "files" available.');
      return;
    }

    const file = files[0];

    if (!file) {
      console.error('Error: [sendFileToHandler] no se encontro el archivo cargado "file"');
      return;
    }

    this.handleFile.handleFile(file, this.showFileName);
  }

  showFileName = ({ statusCode, file }) => {
    const { form, nameFile, nameFileElement } = this;
    if (!nameFile || !nameFileElement) {
      console.error('Error: [showFileName]: no se encontraron los elementos necesarios');
      return;
    }

    if (statusCode === 'ok' && file) {
      nameFile.innerHTML = `${file.name}`;
      nameFileElement.style.opacity = '1';
      nameFileElement.classList.remove('animarTexto');

      setTimeout(() => {
        nameFileElement.classList.add('animarTexto');
      }, 50);
    } else {
      nameFileElement.style.opacity = '0';
      nameFile.innerHTML = '';
    }

    form && form.reset();

  }

}