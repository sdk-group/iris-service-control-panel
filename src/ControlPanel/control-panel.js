'use strict'

let emitter = require("global-queue");
let ServiceApi = require('resource-management-framework').ServiceApi;

class ControlPanel {
	constructor() {
		this.emitter = emitter;
	}

	init() {
		this.iris = new ServiceApi();
		this.iris.initContent();
	}

	//API
	actionBootstrap({
		workstation,
		user_id,
		user_type = "Employee"
	}) {
		return Promise.props({
				ws: this.emitter.addTask('workstation', {
						_action: 'occupy',
						user_id,
						user_type,
						workstation
					})
					.then((res) => {
						return res.workstation;
					})
			})
			.catch(err => {
				console.log("CP BTSTRP ERR", err.stack);
			});
	}

	actionReady({
		user_id,
		workstation
	}) {
		// console.log("READY FOR ACTION", user_id, workstation);
		//@TODO : multiple offices in chain
		return this.emitter.addTask('queue', {
				_action: 'workstation-organization-data',
				workstation
			})
			.then(({
				ws,
				org_addr,
				org_chain,
				org_merged
			}) => {
				this.emitter.emit('queue.emit.head', {
					user_id,
					org_addr
				});
				return Promise.resolve(true);
			})
			.catch(err => {
				console.log("READY CP ERR", err.stack);
			});
	}

}

module.exports = ControlPanel;