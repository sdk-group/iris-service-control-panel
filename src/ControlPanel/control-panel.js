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
		let cp;
		return this.emitter.addTask('workstation', {
				_action: 'by-id',
				user_id,
				user_type,
				workstation
			})
			.then((res) => {
				cp = _.find(res, (val) => (val.device_type === 'control-panel'));
				return this.iris.getOrganizationChain({
					keys: cp.attached_to
				});
			})
			.then((res) => {

				let org_data = _.reduce(_.orderBy(_.keys(res), _.parseInt, 'desc'), (acc, val) => {
					acc = _.merge(acc, res[val]);
					return acc;
				}, {});

				return Promise.props({
					office: res,
					timezone: org_data.org_timezone,
					current_time: this.emitter.addTask('queue', {
						_action: 'current-time'
					}),
					services: this.iris.getService({
						query: {}
					}),
					ws: this.emitter.addTask('workstation', {
							_action: 'occupy',
							user_id,
							user_type,
							workstation
						})
						.then((res) => {
							return res.workstation;
						})
				});
			});
	}

	actionReady({
		user_id, office
	}) {
		console.log("READY FOR ACTION", user_id, office);
		//@TODO : multiple offices in chain
		let org_addr = {};
		let dept_id = _.find(office, (item) => (item.ldtype == "Department")) || {};
		dept_id = dept_id.id;
		if(dept_id) org_addr.department = dept_id;
		let off_id = _.find(office, (item) => (item.ldtype == "Office")) || {};
		off_id = off_id.id;
		if(off_id) org_addr.office = off_id;

		this.emitter.emit('queue.emit.head', {
			user_id, org_addr
		})
		return Promise.resolve(true);
	}

}

module.exports = ControlPanel;