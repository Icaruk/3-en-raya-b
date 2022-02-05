
const matches = require("./features/matches");
const ranking = require("./features/ranking");



/**
 * @param {import("fastify").FastifyInstance} fastify 
*/
module.exports = async (fastify, options) => {
	
	fastify.get("/version", async (request, reply) => {
		return {
			v: "0.0.1"
		}
	});
	
	
	
	fastify.route({
		method: "POST",
		url: "/newMatch",
		schema: matches.post_newMatch_schema,
		handler: matches.post_newMatch,
	});
	
	fastify.route({
		method: "GET",
		url: "/match/:_id",
		handler: matches.get_match,
	});
	
	fastify.route({
		method: "PUT",
		url: "/match",
		schema: matches.put_match_schema,
		handler: matches.put_match,
	});
	
	fastify.route({
		method: "GET",
		url: "/ranking/:username?",
		schema: ranking.get_ranking_schema,
		handler: ranking.get_ranking,
	});
	
};