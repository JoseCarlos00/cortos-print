// tableOperations.js

export function insertarThead() {
  const primeraFila = document.querySelector('table tbody tr:nth-child(1)');

  // html thead
  const thead = `
  <thead>
    <tr>${primeraFila.innerHTML}</tr>
  </thead>
  `;

  const table = document.querySelector('#tablePreview > table');
  table.insertAdjacentHTML('afterbegin', thead);

  // Borrar el elemento primera fila
  primeraFila.remove();
}

export function mostrarNombreArchivo(fileInput) {
  const nombreArchivo = document.getElementById('nombreArchivo');
  const nombreArchivoElement = document.querySelector('.nombre-de-archivo');

  if (!nombreArchivo || !nombreArchivoElement) return;

  if (fileInput.files.length > 0) {
    const nombre = fileInput.files[0].name;

    nombreArchivo.innerHTML = `${nombre}`;
    nombreArchivoElement.style.opacity = '1';
    nombreArchivoElement.classList.remove('animarTexto');
    setTimeout(() => {
      nombreArchivoElement.classList.add('animarTexto');
    }, 50);
  } else {
    nombreArchivo.innerHTML = '';
  }
}
