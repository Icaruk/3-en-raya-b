
/**
 * @typedef {Object} Play
 * @property {Array< Array<number> >} line Coordenadas que forman la línea trazada
 * @property {Array< Array<number> >} winningCoords Coordenadas des coordenadas de la jugada ganadora.
*/

/**
 * @typedef {Object} PossibleAndDefinitive
 * @property {Array<Play>} possible Jugadas que harán posible una victoria.
 * @property {Array<Play>} definitive Jugadas que ya son una victoria.
*/

/**
 * @typedef {Object} WinningPlays
 * @property {PossibleAndDefinitive} p1 ganadoras del p1.
 * @property {PossibleAndDefinitive} p2 ganadoras del p2.
*/

/**
 * Devuelve todas las jugadas ganadoras de una partida.
 * @param {Array< Array<Number> >} table Tablero de juego.
 * @returns {WinningPlays} Jugadas ganadoras del p1 y p2.
*/
module.exports = function getWinningPlay(table) {
	
	const winningPlays = {
		p1: {
			possible: [
				// {
				// 	line: [[0, 0], [0, 1]],
				// 	winningCoords: [[0, 2]],
				// }
			],
			definitive: [
				// {
				// 	line: [[0, 0], [0, 1], [0, 2]],
				// 	winningCoords: null,
				// }
			],
		},
		p2: {
			possible: [],
			definitive: [],
		}
	};
	
	
	
	// Obtengo todas las coordenadas que forman todas las posibles líneas en la matriz
	// en vertical (3 filas)
	// en horizontal (3 columnas)
	// en diagonal (2 diagonales)
	
	const possibleLines = [];
	
	
	
	// Obtengo filas
	let filas = []; // lo usaré luego para reverse y obtener las columnas
	
	for (let _idxFil = 0; _idxFil < table.length; _idxFil ++) {
		
		const fila = [];
		
		for (let _idxCol = 0; _idxCol < table[_idxFil].length; _idxCol++) {
			fila.push([_idxFil, _idxCol]);
		};
		
		possibleLines.push(fila);
		filas.push(fila); // clono para luego en el reverse no mutar el original
		
	};
	
	
	
	if (table.length > 1) { // sólo si la altura es mayor a 1
		
		// Obtengo las columnas invirtiendo las coordenadas de las filas
		filas.forEach( (_fil, _idxFil) => {
			// _fil es [ [0, 0], [0, 1], [0, 2] ]
			
			const reversed = [];
			
			_fil.forEach( (_x, _idx) => {
				reversed.push([..._x].reverse());
			});

			filas[_idxFil] = reversed;
			
		});
		
		
		possibleLines.push(...filas); // filas con cada coordenada revertida
		
		
		
		// Obtengo diagonal \ y luego /
		const startingPoint1 = [0, 0];
		const startingPoint2 = [0, 2];
		
		const diagonal1 = [];
		const diagonal2 = [];
		
		for (let _offset = 0; _offset < table.length; _offset ++) {
			diagonal1.push([
				startingPoint1[0] + _offset,
				startingPoint1[1] + _offset,
			]);
			diagonal2.push([
				startingPoint2[0] + _offset,
				startingPoint2[1] - _offset,
			]);
		};
		
		possibleLines.push(diagonal1);
		possibleLines.push(diagonal2);
		
	};
	
	
	
	/*
	En este punto possibleLines debería ser:
	[
		[[0,0],[0,1],[0,2]],
		[[1,0],[1,1],[1,2]],
		[[2,0],[2,1],[2,2]],
		
		[[0,0],[1,0],[2,0]],
		[[0,1],[1,1],[2,1]],
		[[0,2],[1,2],[2,2]],
		
		[[0,0],[1,1],[2,2]],
		[[0,2],[1,1],[2,0]]
	]
	*/
	
	
	
	// ############################################################
	// Compruebo líneas
	// ############################################################
	
	possibleLines.forEach( (_lin, _idxLin) => {
		// _lin es [ [0,0], [0,1], [0,2] ]
		
		
		// Cuento cuántas fichas de player 1 y cuántas del 2 hay en esta línea
		const p1ChipCoords = [];
		const p2ChipCoords = [];
		const missingChipCoords = [];
		
		
		_lin.forEach( _coord => {
			// _coord es [0,0]
			
			const _chip = table[_coord[0]][_coord[1]];
			
			if (_chip === 1) p1ChipCoords.push(_coord);
			else if (_chip === 2) p2ChipCoords.push(_coord);
			else missingChipCoords.push(_coord);
			
		});
		
		
		// Jugador tiene 2 y la IA ninguna
		if (p1ChipCoords.length === 2 && p2ChipCoords.length === 0) {
			winningPlays.p1.possible.push({
				line: p1ChipCoords,
				winningCoords: missingChipCoords,
			});
		};
		// Jugador tiene 3 fichas
		if (p1ChipCoords.length === 3) {
			winningPlays.p1.definitive.push({
				line: p1ChipCoords,
				winningCoords: missingChipCoords,
			});
		};
		
		// La IA tiene 2 y el jugador ninguna
		if (p2ChipCoords.length === 2 && p1ChipCoords.length === 0) {
			winningPlays.p2.possible.push({
				line: p2ChipCoords,
				winningCoords: missingChipCoords,
			});
		};
		// La IA tiene 3 fichas
		if (p2ChipCoords.length === 3) {
			winningPlays.p2.definitive.push({
				line: p2ChipCoords,
				winningCoords: missingChipCoords,
			});
		};
		
	});
	
	
	return winningPlays;
	
};

