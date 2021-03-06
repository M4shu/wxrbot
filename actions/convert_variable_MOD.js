module.exports = {
	name: "Convert Variable",  
	section: "Variable Things",  

	subtitle: function(data) {
		const info = ["Number (Int)", "Number (Float)", "String", "Uppercased String", "Lowercased String"];
		return `Conversion Type: ${info[parseInt(data.conversion)]}`;
	},  

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2);
		const prse2 = parseInt(data.conversion);
		const info2 = ["Number", "Number", "String", "String", "String"];
		if(type !== varType) return;
		return ([data.varName2, info2[prse2]]);
	},  


	fields: ["storage", "varName", "conversion", "storage2", "varName2"],  

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source Variable:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div>
		<div style="padding-top: 8px; width: 35%;">
			Conversion Type:<br>
			<select id="conversion" class="round">
				<option value="0" selected>Number (Int)</option>
				<option value="1">Number (Float)</option>
				<option value="2">String</option>
				<option value="3">Uppercased String</option>
				<option value="4">Lowercased String</option>
			</select>
		</div>
	</div><br>
	<div>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage2" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer2" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text"><br>
		</div>
	</div>
	<style>
		/* My Embed CSS code */
		.embed {
			position: relative;
		}
		.embedinfo {
			background: rgba(46,48,54,.45) fixed;
			border: 1px solid hsla(0,0%,80%,.3);
			padding: 10px;
			margin:0 4px 0 7px;
			border-radius: 0 3px 3px 0;
		}
		embedleftline {
			background-color: #eee;
			width: 4px;
			border-radius: 3px 0 0 3px;
			border: 0;
			height: 100%;
			margin-left: 4px;
			position: absolute;
		}
		span {
			font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		}
		span.embed-auth {
			color: rgb(255, 255, 255);

		}
		span.embed-desc {
			color: rgb(128, 128, 128);
		}
	</style>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.refreshVariableList(document.getElementById("storage"));
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];

		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const variable = this.getVariable(storage, varName, cache);
		const conversion = parseInt(data.conversion);

		let result;

		switch (conversion) {
			case 0:
				result = parseInt(variable);
				break;
			case 1:
				result = parseFloat(variable);
				break;
			case 2:
				result = variable.toString();
				break;
			case 3:
				result = variable.toString().toUpperCase();
				break;
			case 4:
				result = variable.toString().toLowerCase();
				break;
		}
		if(result !== undefined) {
			const storage2 = parseInt(data.storage2);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage2, varName2, cache);
		}
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 
