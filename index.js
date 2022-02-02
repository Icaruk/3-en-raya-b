
const fastify = require("fastify")({
	logger: true,
	disableRequestLogging: true,
});
const { mongoInit } = require("./DB/mongoInit");
const { version }  = require("./package.json");



// ############################################################
// ENV
// ############################################################

require("entor")();



// ############################################################
// Fastify
// ############################################################

const port = process.env.PORT || 3000;

(async() => {
	
	// global.fastify = fastify; // de momento no hace falta
	
	// fastify.register(require("./router"), /*{prefix: "/api"}*/);
	// fastify.register(require("fastify-cors"), { // https://github.com/fastify/fastify-cors
	// 	// origin: "*",
	// 	origin: process.env.MODE === "prod" ? ["https://economos.app"] : "*",
	// 	methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
	// });
	
	
	
	fastify.get("/version", async (request, reply) => {
		return {
			v: version
		}
	});
	
	
	
	await mongoInit();
	
	try {
		await fastify.listen(port);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	};
	
	
	
	fastify.ready(err => {
		if (err) throw err;
		console.log( `    ✅ Fastify (port: ${port})` );
	});
	
})();
