var game_click = function(event) {
	if (!map.layers[map.layer])
		map.layers[map.layer] = {};
	var tileX = Math.floor((event.pageX - this.offsetLeft + Game.camera.x * 5) / 80) ;
	var tileY = Math.floor((event.pageY - this.offsetTop + Game.camera.y * 5) / 80) ;
	var tileP = tileY * map.cols + tileX;
	var tileD = map.layers[map.layer][tileP];
	map.layers[map.layer][tileP] = map.brush;
	$.ws.trigger("map.update", { map_id: map.id, layer: map.layer, id: tileP, tileX: tileX, tileY: tileY, brush: map.layers[map.layer][tileP]});
	//alert(event.pageX + " " + event.pageY + "\n" + Game.camera.x + " " + Game.camera.y + "\n" + tileX + " " + tileY + "\n" + tileD + " " + tileP);
}

var toolbox_click = function(event) {
	var tileX = Math.floor((event.pageX - this.offsetLeft) );
	var tileY = Math.floor((event.pageY - this.offsetTop) );
	var spaceX = Math.ceil(tileX / 16);
	var spaceY = Math.ceil(tileY / 16);
	tileX = Math.ceil((tileX - spaceX) / 16);
	tileY = Math.floor((tileY - spaceY) / 16);
	map.brush = tileY * 57 + tileX;
}

var map_update = function(data) {
	var d = jQuery.parseJSON(data);
	$("#messagelog").append("<p>Receiving map: " + d.map_id + " </p>");
	if(map.id != d.map_id) {
		return;
	}

	for(var layer in d.world) {
		if (!d.world.hasOwnProperty(layer))
			continue;
		if (!map.layers[layer])
			map.layers[layer] = {};
		for(tile in d.world[layer]) {
			if (!d.world[layer].hasOwnProperty(tile))
				continue;

			map.layers[layer][tile] = d.world[layer][tile];

		}

	}
}