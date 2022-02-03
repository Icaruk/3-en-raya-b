const { ObjectId } = require("mongodb");
const { getCollection } = require("../DB/mongoInit");



const defaultTable = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];



exports.post_newMatch_schema = {
	body: {
		type: "object",
		required: ["username"],
		properties: {
			username: {
				type: "string",
				pattern: "^[a-zA-Z]{3,16}$",
			},
		}
	}
};

exports.post_newMatch = async (req, rep) => {
	
	const {username} = req.body;
	
	
	// Tablero por defecto
	const table = [...defaultTable];
	
	
	// ¿Quién empieza?
	let turn = Math.floor(Math.random() * 2) + 1; // sólo puede dar 1 o 2;
	
	
	// Si es turno de la IA
	if (turn === 2) { 
		table[1][1] = 2; // pongo ficha siempre en el centro
		turn = 1; // devuelvo el turno al jugador
	};
	
	
	// Inserto
	const resInsert = await getCollection("matches").insertOne({
		username,
		table: table,
		turn: turn,
		startedAt: new Date(),
		endedAt: null,
		isInProgress: true,
	});
	
	if (!resInsert.insertedId) return rep.status(500).send({
		message: "Error al crear la partida",
	});
	
	
	
	return {
		_id: resInsert.insertedId,
		table: table,
		turn: turn,
	};
	
};



exports.get_match = async (req, rep) => {
	
	const {_id} = req.params;
	
	
	
	// Inserto
	const match = await getCollection("matches").findOne({
		_id: ObjectId(_id),
	}, {
		projection: {
			_id: 0,
			username: 1,
			table: 1,
			turn: 1,
			isInProgress: 1,
		}
	});
	
	
	if (!match) return rep.status(404).send({
		message: "No existe la partida",
	});
	
	return match;
	
};



exports.put_match_schema = {
	body: {
		type: "object",
		required: ["matchId", "coords"],
		properties: {
			matchId: {
				type: "string",
			},
			coords: {
				type: "array",
				items: {
					type: "integer",
					length: 2,
				}
			}
		}
	}
};

exports.put_match = async (req, rep) => {
	
	const {matchId, coords} = req.body;
	
	
	
	// Primero compruebo si la jugada es válida
	const match = await getCollection("matches").findOne({
		_id: ObjectId(matchId),
	}, {
		projection: {
			table: 1,
			turn: 1,
		}
	});
	
	
	if (match.turn === 2) return rep.status(401).send({
		message: "No es tu turno",
	});
	
	
	
	const table = match.table;
	const [fil, col] = coords;
	
	if (table[fil][col]) return rep.status(400).send({
		message: "Esa casilla ya está ocupada",
	});
	
	
	
	// Muto el tablero
	table[fil][col] = 1; // jugador 1 (humano) mete ficha
	
	
	
	// ***********************************************************
	// Juego el turno de la IA
	// ***********************************************************
	
	// PENDIENTE 
	// Busco los espacios vacíos
	const emptySpaces = [];
	
	for (let _fil = 0; _fil < table.length; _fil++) {
		for (let _col = 0; _col < table[_fil].length; _col++) {
			if (!table[_fil][_col]) emptySpaces.push([_fil, _col]);
		};
	};
	
	
	// Si no hay espacios vacíos, la partida ha terminado
	if (emptySpaces.length === 0) {
		// PENDIENTE
		console.log( "Partida terminada" );
	};
	
	
	// Escojo un espacio vacío aleatorio y pongo la ficha de la IA
	const [emptyFil, emptyCol] = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
	table[emptyFil][emptyCol] = 2; // IA mete ficha
	
	
	
	// Actualizo
	const resUpdate = await getCollection("matches").updateOne({
		_id: ObjectId(matchId),
	}, {
		$set: {
			table: match.table,
			turn: match.turn,
		},
	});
	
	
	if (resUpdate.modifiedCount === 0) return rep.status(500).send({
		message: "Error al actualizar la partida",
	});
	
	
	
	return {
		table: match.table,
		turn: match.turn,
	};
	
};