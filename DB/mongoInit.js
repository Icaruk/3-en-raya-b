
const { MongoClient } = require("mongodb");



let database;



exports.mongoInit = async () => {
	
	let dbUrl = process.env.MONGO_URL;
	
	
	
	try {
		
		const client1 = new MongoClient(dbUrl);
		
		const con1 = await client1.connect();
		const tresEnRaya = con1.db("tresEnRaya");
		
		
		
		if (tresEnRaya) {
			console.log("    ✅ MongoDB");
			database = tresEnRaya;
		};
		
	} catch (err) {
		console.log( err );
		console.log("    ❌ MongoDB error");
	};	
	
};



/**
 * @param {string} collection Collection name
 * @returns {import("mongodb").Collection}
*/
exports.getCollection = function(collection) {
	return database.collection(collection);
};


