'use strict'
let events = {
	control_panel: {}
};

let tasks = [];

module.exports = {
	module: require('./control-panel.js'),
	permissions: [],
	exposed: true,
	tasks: tasks,
	events: {
		group: 'control-panel',
		shorthands: events.control_panel
	}
};