'use strict'

let emitter = require("global-queue");

class ControlPanel {
	constructor() {
		this.emitter = emitter;
	}

	init() {}

	//API
	actionTicketCalled({
		query
	}) {
		console.log("TODO: GET ENTRIES", query);
		return Promise.resolve(true);
	}

}

module.exports = ControlPanel;