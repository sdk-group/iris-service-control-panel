let events = {
	control-panel: {}
};

let tasks = [];

module.exports = {
	module: require('./control-panel.js'),
	permissions: [],
	exposed: true,
	tasks: tasks,
	events: {
		group: 'control-panel',
		shorthands: events.control-panel
	}
};