'use strict'

let ControlPanel = require("./ControlPanel/control-panel");
let config = require("./config/db_config.json");

describe("ControlPanel service", () => {
	let service = null;
	let bucket = null;
	before(() => {
		service = new ControlPanel();
		service.init();
	});
	describe("ControlPanel service", () => {
		it("should mark ticket called", (done) => {
			return service.actionTicketCalled()
				.then((res) => {
					console.log(res);
					done();
				})
				.catch((err) => {
					done(err);
				});
		})
	})

});