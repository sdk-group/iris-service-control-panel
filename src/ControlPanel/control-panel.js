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
		return this.emitter.addTask('workstation', {
			_action: 'occupy',
			user_id,
			user_type,
			workstation
		});
	}

	actionReady({
		user_id,
		workstation
	}) {
		console.log("READY FOR ACTION", user_id, workstation);
		//@TODO : multiple offices in chain
		return this.emitter.addTask('workstation', {
				_action: 'by-id',
				workstation: workstation
			})
			.then(res => res[workstation])
			.then((ws) => {
				this.emitter.command('queue.emit.head', {
					operator: user_id,
					workstation: workstation,
					organization: ws.attached_to
				});
				return Promise.resolve(true);
			});
	}

}

module.exports = ControlPanel;