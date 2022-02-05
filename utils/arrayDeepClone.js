
/**
 * Clona un array de forma profunda.
 * @param {Array<*>} arr Array a clonar.
 * @link https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig
 * 
 * @returns {Array<*>} Array clonado.
*/
module.exports = (arr) => {
	return arr.map( _item => {
		if (Array.isArray(_item)) return module.exports(_item);
		else return _item;
	});
};
