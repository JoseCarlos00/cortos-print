// tableOperations.js

export function insertarThead() {
	return new Promise((resolve, reject) => {
		// html thead

		const table = document.querySelector("#tablePreview > table");

		if (!table) {
			return reject("No se encontro la tabla con el id: #tablePreview table");
		}

		const caption = document.querySelector("#myCaption");

		const firstRow = table.rows[0];
		if (!firstRow) {
			throw new Error("[FileManager]:[insertTagThead]: 'No rows found'");
		}

		const rowsHeaders = Array.from(firstRow.cells);
		if (rowsHeaders.length === 0) {
			throw new Error("[FileManager]:[insertTagThead]: 'No cells found'");
		}

		const thead = table.createTHead();
		const row = thead.insertRow(0);

		rowsHeaders.forEach((td, index) => {
			const th = document.createElement("td");
			th.innerHTML = td.textContent + `<div class="resizer">`;
			th.dataset.colIndex = index + 1;

			row.appendChild(th);
		});

		firstRow.remove();

		if (caption) {
			caption.insertAdjacentElement("afterend", thead);
		} else {
			table.insertAdjacentElement("afterbegin", thead);
		}

		resolve();
	});
}

export function mostrarNombreArchivo(fileInput) {
	const nombreArchivo = document.getElementById("nombreArchivo");
	const nombreArchivoElement = document.querySelector(".nombre-de-archivo");

	if (!nombreArchivo || !nombreArchivoElement) return;

	if (fileInput.files.length > 0) {
		const nombre = fileInput.files[0].name;

		nombreArchivo.innerHTML = `${nombre}`;
		nombreArchivoElement.style.opacity = "1";
		nombreArchivoElement.classList.remove("animarTexto");
		setTimeout(() => {
			nombreArchivoElement.classList.add("animarTexto");
		}, 50);
	} else {
		nombreArchivo.innerHTML = "";
	}
}

/**
 * Busca la posicion del elemento dependiendo de un valor
 * @param {HTMLCollection} headerRow Colecion de elementos HTML
 * @param {Array} values Array con los valores buscados
 * @returns Posicion del elemento buscado en el Array [indice]
 */
export function getHeaderPosition(headerRow, values) {
	console.log("[Get Header Position]", headerRow.length);

	for (let i = 0; i < headerRow.length; i++) {
		const header = headerRow[i].innerHTML.toLowerCase().trim();
		for (let j = 0; j < values.length; j++) {
			const value = values[j].toLowerCase().trim();
			if (header === value) {
				const positionElement = i + 1;
				return positionElement;
			}
		}
	}
	return null; // Si no se encuentra ninguna coincidencia
}

export function setRezizeEvent() {
	const resizers = document.querySelectorAll(".resizer");
	const table = document.querySelector("table");

	resizers.forEach((resizer) => {
		resizer.addEventListener("mousedown", function (e) {
			const th = e.target.parentNode;

			console.log(th);

			const { colIndex } = th.dataset;
			console.log("Col Index:", colIndex);

			if (colIndex < 0 || !colIndex || colIndex > table.rows[0].cells.length) {
				console.warn("Col Index invalido");
				return;
			}

			const startX = e.pageX;
			const startWidth = th.offsetWidth;

			const handleMouseMove = (e) => {
				const newWidth = startWidth + (e.pageX - startX);
				table.style.setProperty(`--width-col-${colIndex}`, `${newWidth}px`);
				table.style.setProperty(`--text-wrap-col-${colIndex}`, "nowrap");
			};

			const handleMouseUp = () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		});
	});
}
