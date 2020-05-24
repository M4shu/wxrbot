module.exports = {
	name: "Jump to Action",  
	section: "Other Stuff",  
	
	subtitle: function(data) {
		return `Jump to action ${typeof data.call === "number" ? "#" : "" + data.call}`;
	},  

	fields: ["call"],  

	html: function(isEvent, data) {
		return `
<div>
	<div id="varNameContainer" style="float: left; width: 60%;">
		Jump to Action:<br>
		<input id="call" class="round" type="number">
	</div>
</div><br><br><br>`;
	},  

	init: function() {},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const val = parseInt(this.evalMessage(data.call, cache));
		const index = Math.max(val - 1, 0);
		if(cache.actions[index]) {
			cache.index = index - 1;
			this.callNextAction(cache);
		}
	},  

	mod: function() {}
}; 
