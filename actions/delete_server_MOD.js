module.exports = {
	name: "Delete Server",  
	section: "Server Control",  

	subtitle: function(data) {
		const servers = ["Current Server", "Temp Variable", "Server Variable", "Global Variable"];
		const index = parseInt(data.server);
		return data.server === "0" ? `${servers[index]}` : `${servers[index]} - ${data.varName}`;
	},  

	fields: ["server", "varName"],  

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Source Server:<br>
		<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
			${data.servers[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.serverChange(document.getElementById("server"), "varNameContainer");
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const targetServer = this.getServer(server, varName, cache);

		if(Array.isArray(targetServer)) {
			this.callListFunc(targetServer, "delete", []).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(targetServer && targetServer.delete) {
			targetServer.delete().then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},  

	mod: function() {}
}; 
