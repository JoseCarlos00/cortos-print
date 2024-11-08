import { insertarPageBreak } from "../../JS/funcionesGlobales.js ";

const primerPiso = [
	"W-Mar Bodega 1",
	"W-Mar Bodega 2",
	"W-Mar Bodega 3",
	"W-Mar Bodega 4",
	"W-Mar Bodega 5",
	"W-Mar Bodega 6",
	"W-Mar Bodega 7",
	"W-Mar Bodega 8",
	"W-Mar Bodega 9",
	"W-Mar Vinil",
	"W-Mar Mayoreo",
];
const segundoPiso = [
	"W-Mar Bodega 10",
	"W-Mar Bodega 11",
	"W-Mar Bodega 12",
	"W-Mar Bodega 13",
	"W-Mar Bodega 14",
	"W-Mar Bodega 15",
	"W-Mar Bodega 16",
	"W-Mar Bodega 17",
	"W-Mar No Banda",
];

export function insertarPageBreakPorPiso(positionElement) {
	return new Promise((resolve, reject) => {
		// Busca y agregar la clase page-break para el salto de página por el valor de la URL
		const table = document.querySelector("#tablePreview table");

		if (!table) {
			return reject("No se encontró la tabla con el id: #tablePreview");
		}

		if (!positionElement) {
			return reject("No se encontró la posición del elemento");
		}

		// Filtrar y agregar clase al primer TD de cada grupo
		const filas = Array.from(table.querySelectorAll("tr"));

		const hasWarehouseSomeRow = filas.some((row) =>
			row.querySelector(`td:nth-child(${positionElement})`)?.innerText?.includes("W-Mar Bodega")
		);

		if (hasWarehouseSomeRow) {
			insertarPageBreak(positionElement);
			return;
		}

		// Función para determinar el grupo (primer piso o segundo piso)
		const getGroup = (value) => {
			if (primerPiso.includes(value)) {
				return "primerPiso";
			} else if (segundoPiso.includes(value)) {
				return "segundoPiso";
			} else {
				return "otro";
			}
		};

		// Iterar sobre las filas
		filas.forEach((fila, index) => {
			// Ignorar la primera fila (encabezados)
			if (index === 0) return;

			const valorDeLaFilaActual = fila.querySelector(`td:nth-child(${positionElement})`).textContent.trim();
			const valorDeLaFilaAnterior =
				index > 1 ? filas[index - 1].querySelector(`td:nth-child(${positionElement})`).textContent.trim() : null;

			const grupoActual = getGroup(valorDeLaFilaActual);
			const grupoAnterior = valorDeLaFilaAnterior ? getGroup(valorDeLaFilaAnterior) : null;

			// Verificar si el grupo actual es diferente al grupo anterior
			if (grupoActual !== grupoAnterior && grupoAnterior) {
				filas[index - 1].classList.add("page-break");
			}
		});

		resolve("Insertar PageBreak con éxito");
	});
}
