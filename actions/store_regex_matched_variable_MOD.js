module.exports = {
	name: "Store Regex Matched Variable",  
	section: "Variable Things",  

	subtitle: function(data) {
		const storage = ["", "Temp Variable", "Server Variable", "Global Variable"];
		return ` (${data.typeVariable}) ~Var: ${storage[parseInt(data.storage)]} (${data.varName})`;
	},  

	depends_on_mods: ["WrexMODS"],  

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;

		return ([data.varName, "Unknown Type"]);
	},  

	fields: ["behavior", "inputStorage", "inputVarName", "theType", "typeVariable", "storage", "varName"],  

	html: function(isEvent, data) {
		return `
            <div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
            <div>
               <div style="float: left; width: 95%;">
                  End Behavior:<br>
                  <select id="behavior" class="round">
                     <option value="0" selected>Call Next Action Automatically</option>
                     <option value="1">Do Not Call Next Action</option>
                  </select>
                  <br>
               </div>
               <div>
                  <div style="float: left; width: 30%;">
                     Input Variable:<br>
                     <select id="inputStorage" class="round" onchange="glob.variableChange(this, 'inputVarNameContainer')">
                     ${data.variables[1]}
                     </select>
                  </div>
                  <div id="inputVarNameContainer" style="display: ; float: right; width: 60%;">
                     Input Variable Name:<br>
                     <input id="inputVarName" class="round" type="text">
                  </div>
               </div>
               <div>
                  <div style="float: left; width: 30%;">
                     <br>Type:<br>
                     <select id="theType" class="round">
                        <option value="0" selected>Regex Match</option>
                        <option value="1" >Regex Replace</option>
                     </select>
                  </div>
                  <div id="typeContainer" style="display: ; float: right; width: 60%;">
                     <br>Match: (Regex Builder)<a href="http://buildregex.com/" target="_blank">http://buildregex.com/</a>)
                     <input id="typeVariable" class="round" type="text">
                  </div>
               </div>
               <div>
                  <div style="float: left; width: 30%;"><br><br>
                     Store In:<br>
                     <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
                     ${data.variables[1]}
                     </select>
                  </div>
                  <div id="varNameContainer" style="display: ; float: right; width: 60%;"><br><br>
                     Variable Name:<br>
                     <input id="varName" class="round" type="text">
                  </div>
               </div>
            </div>
         </div>`;
	},  

	init: function() {
		const {
			glob,  
			document
		} = this;
		glob.variableChange(document.getElementById("inputStorage"), "inputVarNameContainer");
		glob.variableChange(document.getElementById("storage"), "varNameContainer");
	},  

	action: function(cache) {

		const data = cache.actions[cache.index];

		const inputStorage = parseInt(data.inputStorage);
		const storage = parseInt(data.storage);
		const type = parseInt(data.theType);

		const inputVarName = this.evalMessage(data.inputVarName, cache);
		const typeVariable = this.evalMessage(data.typeVariable, cache);
		const varName = this.evalMessage(data.varName, cache);

		var inputData = this.getVariable(inputStorage, inputVarName, cache);

		if (inputData) {

			switch (type) {
				case 0:
					try {
						if (typeVariable) {

							var regex = new RegExp(typeVariable, "i");

							if (regex.test(inputData)) {
								console.log("Store Regex Match: Valid Regex (RegEx String: " + typeVariable + ")");

								var outputData = inputData.match(regex);

								if (outputData) {
									var jsonData = JSON.stringify(outputData);

									console.log("Store Regex Match: Match Stored as JSON: " + jsonData);

									console.log("Match Results;\r\n");

									for (let i = 0; i < outputData.length; i++) {
										console.log("[" + i + "] = " + outputData[i]);
									}

									console.log("\r\nAppend the key that you want to store that value to the variable.");

									const storageType = ["", "tempVars", "serverVars", "globalVars"];
									var out = storageType[storage];

									console.log("Example ${"+out+"(\""+ varName +"\")} to ${"+out+"(\""+ varName +"\")[key]}");
									console.log(""+ varName +"[key] if not using it as a template");
									this.storeValue(this.eval(jsonData, cache), storage, varName, cache);
								}


							} else {
								console.log("Store Regex Match: Invalid Regex: (RegEx String: " + typeVariable + ")");
								this.storeValue(this.eval(outputData, cache), storage, varName, cache);
							}
						}
					} catch (error) {
						console.error("Store Regex Match: Error " + error);
					}
					break;
				case 1:

					try {
						if (typeVariable) {

							var regex = new RegExp(typeVariable, "g");

							console.log("Store Regex Match: Replacing With: " + typeVariable);

							if (inputData) {

								var outputData = inputData.replace(regex, typeVariable);

								if (outputData) {
									var jsonData = JSON.stringify(outputData);
									console.log("Store Regex Match: Stored as JSON: " + jsonData);
									this.storeValue(this.eval(jsonData, cache), storage, varName, cache);
								}

							}
						}

					} catch (error) {
						console.error("Store Regex Match: Error " + error);
					}
					break;
			}
		}

		if (data.behavior === "0") {
			this.callNextAction(cache);
		}
	},  

	mod: function() {}
}; 
