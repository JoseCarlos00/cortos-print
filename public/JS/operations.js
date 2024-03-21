// tableOperations.js

export function insertarThead() {
  return new Promise((resolve, reject) => {
    const primeraFila = document.querySelector('table tbody tr:nth-child(1)');

    if (!primeraFila) {
      return reject('No se encontro la primera fila el [thead]');
    }

    // html thead
    const thead = `
  <thead>
    <tr>${primeraFila.innerHTML}</tr>
  </thead>
  `;

    const table = document.querySelector('#tablePreview > table');

    if (!table) {
      return reject('No se encontro la tabla con el id: #tablePreview table');
    }

    table.insertAdjacentHTML('afterbegin', thead);

    // Borrar el elemento primera fila
    primeraFila.remove();
    resolve();
  });
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
