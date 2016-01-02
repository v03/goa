$(document).ready(function() {
	$.ws = new WebSocketRails(document.location.host + '/websocket');
	$.ws.on_open = function(data) {
		$("#messagelog").append("<p>Connection established</p>");
		$.ws.trigger("map.update", {});
	}

	$.stream = $.ws.subscribe('stream');
	$.stream.bind('data', function(data) {
		$("#messagelog").append("<p>" + data + " : " + map.rows + "</p>");

	});

	$.stream.bind('map_update', function(data) {
		var d = jQuery.parseJSON(data);
		for(i in d) {
			map.layers[2][d[i].id] = d[i].b;
		}
	});


});
