
const getWinningPlay = require("../utils/getWinningPlay");



describe("Check win", () => {
	
	test("horizontal", async () => {
		
		const winning = getWinningPlay([
			[0, 1, 1],
			[0, 0, 0],
			[0, 0, 0],
		]);
		
		expect(winning.p1.possible.length).toBe(1);
		
	});
	
	test("vertical", async () => {
		
		const winning = getWinningPlay([
			[1, 0, 0],
			[1, 0, 0],
			[0, 0, 0],
		]);
		
		expect(winning.p1.possible.length).toBe(1);
		
	});
	
	test("multiple", async () => {
		
		const winning = getWinningPlay([
			[1, 1, 0],
			[0, 1, 1],
			[1, 0, 1],
		]);
		
		expect(winning.p1.possible.length).toBe(7);
		
	});
	
});