$(document).ready(function() {
	$.ws = new WebSocketRails(document.location.host + '/websocket');
	$.ws.on_open = function(data) {
		$("#messagelog").append("<p>Connection established</p>");
		$.ws.trigger("map.new", {map_id: "map_void"});
	}

	$.stream = $.ws.subscribe('stream');



	$.stream.bind('data', function(data) {
		$("#messagelog").append("<p>" + data + " : " + map.rows + "</p>");

	});

	$.stream.bind('map_update', map_update);



});
