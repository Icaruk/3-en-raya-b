
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

const port = process.env.PORT || 9999;

(async() => {
	
	fastify.register(require("fastify-cors"), { // https://github.com/fastify/fastify-cors
		origin: "*",
		// origin: process.env.MODE === "prod" ? ["https://miweb.app"] : "*",
		methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
	});
	
	
	
	fastify.register(require("./router"), /*{prefix: "/api"}*/);
	
	
	
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
