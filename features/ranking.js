const {FastifyReply, FastifyRequest} = require("fastify");
const { ObjectId } = require("mongodb");
const { getCollection } = require("../DB/mongoInit");
const { IUsername } = require("./matches");



exports.get_ranking_schema = {
	params: {
		type: "object",
		properties: {
			username: IUsername,
		}
	}
};



/**
 * @param {FastifyRequest} req 
 * @param {FastifyReply} rep 
*/
exports.get_ranking = async (req, rep) => {
	
	const {username} = req.params;
	
	
	// Genero la query del match
	const objMatch = {
		status: "ended",
		winner: {
			$ne: null,
		},
	};
	
	if (username) objMatch.username = username;
	
	
	
	// Busco
	const resAggregate = await getCollection("matches").aggregate([
		{
			$match: objMatch,
		},
		{
			$group: {
				_id: "$winner",
				wins: {
					$sum: 1
				}
			}
		},
		{
			$sort: {
				wins: -1
			}
		},
		{
			$limit: 10
		},
		{
			$project: {
				_id: 0,
				username: "$_id",
				wins: 1
			}
		}
	]).toArray();
	
	
	return resAggregate;
	
};



/**
 * Actualiza un match.
 * @param {string} matchId 
 * @param {*} setObj Objeto que irá al `$set`
 * @returns {boolean} Éxito de la operación
*/
async function updateMatch(matchId, setObj) {
	
	const resUpdate = await getCollection("matches").updateOne({
		_id: ObjectId(matchId),
	}, {
		$set: setObj,
	});
	
	
	if (resUpdate.modifiedCount === 0) return false;
	return true;
	
};

exports.put_match_schema = {
	body: {
		type: "object",
		required: ["matchId", "coords"],
		properties: {
			matchId: {
				description: "_id de la partida",
				type: "string",
			},
			coords: {
				description: "Coordenadas de la jugada del jugador 1",
				type: "array",
				items: {
					type: "integer",
					length: 2,
				}
			}
		}
	}
};



/**
 * @param {FastifyRequest} req 
 * @param {FastifyReply} rep 
*/
exports.put_match = async (req, rep) => {
	
	const {matchId, coords} = req.body;
	
	
	
	// Primero compruebo si la jugada es válida
	const match = await getCollection("matches").findOne({
		_id: ObjectId(matchId),
	}, {
		projection: {
			table: 1,
			turn: 1,
			username: 1,
		}
	});
	
	if (!match) return rep.status(404).send({
		message: "No existe la partida",
	});
	
	if (match.turn === 2) return rep.status(401).send({
		message: "No es tu turno",
	});
	
	
	
	const table = match.table;
	const [fil, col] = coords;
	
	if (table[fil][col]) return rep.status(401).send({
		message: "Esa casilla ya está ocupada",
	});
	
	
	
	// ############################################################
	// Jugador 1 (humano) mete ficha
	// ############################################################
	
	table[fil][col] = 1; 
	
	
	// Obtengo jugadas ganadoras
	const winningPlays = getWinningPlay(table);
	
	
	
	// ***********************************************************
	// Compruebo si el jugador 1 ha hecho una jugada ganadora
	// ***********************************************************
	
	if (winningPlays.p1.definitive.length > 0) {
		
		const _obj = {
			table: table,
			turn: 1,
			status: "ended",
			winner: match.username,
		};
		
		updateMatch(matchId, _obj);
		return _obj;
		
	};
	
	
	
	// ***********************************************************
	// Si no hay espacios vacíos, la partida ha terminado
	// ***********************************************************
	
	// Busco los espacios vacíos
	const emptySpaces = [];
	
	for (let _fil = 0; _fil < table.length; _fil++) {
		
		const _tableFile = table[_fil];
		
		for (let _col = 0; _col < _tableFile.length; _col++) {
			if (!_tableFile[_col]) emptySpaces.push([_fil, _col]);
		};
	};
	
	if (emptySpaces.length === 0) {
		
		const _obj = {
			table: table,
			turn: 1,
			status: "ended",
			winner: null,
		};
		
		updateMatch(matchId, _obj);
		return _obj;
		
	};
	
	
	
	// ***********************************************************
	// Juego el turno de la IA
	// ***********************************************************		
	
	// Primero busco si yo (la IA) puedo ganar
	if (winningPlays.p2.possible.length > 0) {
		
		const winningCoords = winningPlays.p2.possible[0].winningCoords[0];
		table[winningCoords[0]][winningCoords[1]] = 2; // IA mete ficha para ganar
		
		const _obj = {
			table: table,
			turn: 1,
			status: "ended",
			winner: "IA",
		};
		
		updateMatch(matchId, _obj);
		return _obj;
		
	// Luego busco si puedo bloquear una futura jugada ganadora del jugador 1
	} else if (winningPlays.p1.possible.length > 0) {
		
		const winningCoords = winningPlays.p1.possible[0].winningCoords[0];
		table[winningCoords[0]][winningCoords[1]] = 2; // IA mete ficha para bloquear la victoria del jugador 1
		
	// Como no me queda otra opción, juego aleatoriamente
	} else {
		
		// Escojo un espacio vacío aleatorio y pongo la ficha de la IA
		const [emptyFil, emptyCol] = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
		table[emptyFil][emptyCol] = 2; // IA mete ficha
		
	};
	
	
	
	// Si es el último espacio vacío y acaba de jugar la IA sin victoria, el tablero está lleno sin ganadores
	if (emptySpaces.length === 1) {
		const _obj = {
			table: table,
			turn: 1,
			status: "ended",
			winner: null,
		};
		
		updateMatch(matchId, _obj);
		return _obj;
	};
	
	
	
	const _obj = {
		table: table,
		turn: 1,
		status: "playing",
		winner: null,
	};
	
	updateMatch(matchId, _obj);
	return _obj;
	
};


