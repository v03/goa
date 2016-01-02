$(document).ready(function() {
	$.ws = new WebSocketRails('localhost:3000/websocket');
	$.ws.on_open = function(data) {
		$("#messagelog").append("<p>Connection established</p>");
	}

	$.stream = $.ws.subscribe('stream');
	$.stream.bind('data', function(data) {
		$("#messagelog").append("<p>" + data + "</p>");
	});


});
