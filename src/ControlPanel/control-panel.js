'use strict'


let ServiceApi = require('resource-management-framework')
	.ServiceApi;

class ControlPanel {
	constructor() {
		this.emitter = message_bus;
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
		console.log("BTSTRP");
		return Promise.props({
			workstation: this.emitter.addTask('workstation', {
					_action: 'occupy',
					user_id,
					user_type,
					workstation
				})
				.then((res) => {
					return res.workstation;
				})
		});
	}

	actionReady({
		user_id,
		workstation
	}) {
		console.log("READY FOR ACTION", user_id, workstation);
		//@TODO : multiple offices in chain
		return this.emitter.addTask('workstation', {
				_action: 'workstation-organization-data',
				workstation,
				embed_schedules: true
			})
			.then(res => res[workstation])
			.then(({
				ws,
				org_addr,
				org_chain,
				org_merged
			}) => {
				this.emitter.emit('queue.emit.head', {
					user_id,
					org_addr,
					org_merged
				});
				return Promise.resolve(true);
			});
	}

}

module.exports = ControlPanel;
