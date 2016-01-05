var game_click = function(event) {

	var tileX = Math.floor((event.pageX - this.offsetLeft + Game.camera.x * 2) / 32) ;
	var tileY = Math.floor((event.pageY - this.offsetTop + Game.camera.y * 2) / 32) ;
	var tileP = tileY * map.cols + tileX;
	if (!map.layers[tileP])
		map.layers[tileP] = {};
	var tileD = map.layers[tileP][map.layer];
	if(map.num_layers < map.layer)
		map.num_layers = map.layer;
	map.layers[tileP][map.layer] = map.brush;
	$.ws.trigger("map.update", { map_id: map.id, layer: map.layer, id: tileP, tileX: tileX, tileY: tileY, brush: map.layers[tileP][map.layer]});
	//alert(event.pageX + " " + event.pageY + "\n" + Game.camera.x + " " + Game.camera.y + "\n" + tileX + " " + tileY + "\n" + tileD + " " + tileP + " " + map.layers[0].length);
}

var game_move = function(event) {
	map.cursor = event;
	map.camera = this;
	var tileX = Math.floor((event.pageX - this.offsetLeft + Game.camera.x * 2) / 32) ;
	var tileY = Math.floor((event.pageY - this.offsetTop + Game.camera.y * 2) / 32) ;
	var tileP = tileY * map.cols + tileX;
	var tileA = "<ul>";
	for( var layer in map.layers[tileP]) {
		if (!map.layers.hasOwnProperty(layer))
			continue;
		if(map.layers[tileP][layer] != undefined)
			tileA = tileA + "<li>Layer " + layer + ": " + map.layers[tileP][layer] + "</li>";
	}

	tileA = tileA + "</ul>";
	$("#infobox").html(gen_infobox({
		tile_x: tileX,
		tile_y: tileY,
		tile_id: tileP,
		cur_layer: map.layer,
		layers: tileA
	}));
}

var game_delete = function(event) {
	return;
	var tileX = Math.floor((map.cursor.pageX - map.camera.offsetLeft + Game.camera.x * 2) / 32) ;
	var tileY = Math.floor((map.cursor.pageY - map.camera.offsetTop + Game.camera.y * 2) / 32) ;
	var tileP = tileY * map.cols + tileX;
	for( var layer in map.layers) {
		if (!map.layers.hasOwnProperty(layer))
			continue;
		if (map.layers[layer][tileP] != undefined) {
			map.layers[layer][tileP] = 0;

		}

	}
	$.ws.trigger("map.delete", { map_id: map.id, tile_id: tileP });
}

var gen_infobox = function(data) {
	var tmp = "<ul>";
	for(var i in data) {
		if (!data.hasOwnProperty(i))
			continue;

		tmp = tmp + "<li>" + i + ": " + data[i] + "</li>";

	}
	tmp = tmp + "</ul>";
	return tmp;
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
	
	map.num_layers = d.num_layers;

	//$("#messagelog").append("<p>Receiving map: " + d.map_id + " </p>");
	if(map.id != d.map_id) {
		return;
	}

	for(var tileP in d.world) {
		if (!d.world.hasOwnProperty(tileP))
			continue;
		if (!map.layers[tileP])
			map.layers[tileP] = {};
		for(var layer in d.world[tileP]) {
			if (!d.world[tileP].hasOwnProperty(layer))
				continue;

			map.layers[tileP][layer] = d.world[tileP][layer];

		}

	}
}


$(document).ready(function() {
	map.newMap({base: 1});
	map.loadMap("map_void");
});
