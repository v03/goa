//
// Asset loader
//

var Loader = {
    images: {}
};

Loader.loadImage = function (key, src) {
    var img = new Image();

    var d = new Promise(function (resolve, reject) {
        img.onload = function () {
            this.images[key] = img;
            resolve(img);
        }.bind(this);

        img.onerror = function () {
            reject('Could not load image: ' + src);
        };
    }.bind(this));

    img.src = src;
    return d;
};

Loader.getImage = function (key) {
    return (key in this.images) ? this.images[key] : null;
};

//
// Keyboard handler
//

var Keyboard = {};

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;

Keyboard._keys = {};

Keyboard.listenForEvents = function (keys) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));
	$("#game").click(game_click);
	$("#toolbox").click(toolbox_click);
	$("#layer").change(function(ev) {
		map.layer = $(this).val();
	});
    keys.forEach(function (key) {
        this._keys[key] = false;
    }.bind(this));
}

Keyboard._onKeyDown = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
};

Keyboard._onKeyUp = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
};

Keyboard.isDown = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};

//
// Game object
//

var Game = {};

Game.run = function (context) {
    this.ctx = context;
    this._previousElapsed = 0;

    var p = this.load();
    Promise.all(p).then(function (loaded) {
        this.init();
        window.requestAnimationFrame(this.tick);
    }.bind(this));
};

Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // clear previous frame
    this.ctx.clearRect(0, 0, 720, 720);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();
}.bind(Game);

// override these methods to create the demo
Game.init = function () {};
Game.update = function (delta) {};
Game.render = function () {};

//
// start up function
//

window.onload = function () {
    var context = document.getElementById('game').getContext('2d');
    Game.run(context);
};

var map = {
	brush: 0,
	layer: 1,
    cols: 25,
    rows: 25,
    tsize: 16,
    layers: [[
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    ], [
		7, 7, 6, 6, 6, 1, 1, 1, 6, 6, 6, 1, 1, 1, 6, 6, 6, 1, 1, 1, 6, 6, 6, 7, 7,
		7, 6, 6, 7*57+5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7,
		6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6,
		6, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 6,
		6, 6, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
		6, 6, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 6, 6,
		6, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 6,
		6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6,
		7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7,
		7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7,
    ],
	[]],
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    }
};

function Camera(map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = 256;//map.cols * (map.tsize*5) - width ;
    this.maxY = 256;//map.rows * (map.tsize*5) - height ;
	this.maxX = (map.cols - 9) * 16;
	this.maxY = (map.rows - 9) * 16;
	//alert(this.width + " " + this.height + " " + this.maxX + " " + this.maxY);
}

Camera.SPEED = 256; // pixels per second

Camera.prototype.move = function (delta, dirx, diry) {
    // move camera
    this.x += dirx * Camera.SPEED * delta;
    this.y += diry * Camera.SPEED * delta;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));


};

Game.load = function () {
    return [
        Loader.loadImage('tiles', '../assets/tiles2.png'),
    ];
};

Game.init = function () {
    Keyboard.listenForEvents(
        [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
    this.tileAtlas = Loader.getImage('tiles');
    this.camera = new Camera(map, 1200, 1200);

};

Game.update = function (delta) {
    // handle camera movement with arrow keys
    var dirx = 0;
    var diry = 0;
    if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
    if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
    if (Keyboard.isDown(Keyboard.UP)) { diry = -1; }
    if (Keyboard.isDown(Keyboard.DOWN)) { diry = 1; }


    this.camera.move(delta, dirx, diry);
};

Game._drawLayer = function (layer) {
    var startCol = Math.floor(this.camera.x / map.tsize);
    var endCol = startCol + (this.camera.width / map.tsize);
    var startRow = Math.floor(this.camera.y / (map.tsize*5));
    var endRow = startRow + (this.camera.height / (map.tsize));
    var offsetX = -this.camera.x + startCol * map.tsize;
    var offsetY = -this.camera.y + startRow * map.tsize;

    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var tile = map.getTile(layer, c, r);
            var x = (c - startCol) * map.tsize + offsetX;
            var y = (r - startRow) * map.tsize + offsetY;
			var imgCol = Math.ceil( ( (tile) % 57) ) - 1 ;
			if(imgCol < 0)
				imgCol = 0;
			var imgRow = Math.ceil(( tile / 57) ) - 1 ;
			if (imgRow < 0)
				imgRow = 0;
            if (tile !== 0) { // 0 => empty tile
                this.ctx.drawImage(
                    this.tileAtlas, // image
                    imgCol * map.tsize + imgCol, // source x
                    imgRow * map.tsize + imgRow, // source y
                    map.tsize, // source width
                	map.tsize, // source height
                    Math.round(x) * 5  ,  // target x
                    Math.round(y) * 5  , // target y
                    map.tsize * 5 , // target width
                    map.tsize * 5// target height
                );
            }
        }
    }
};

Game.render = function () {
    // draw map background layer
	for (i in map.layers) {
	    this._drawLayer(i);
	}
	//$.ws.trigger("data", {x: this.x, y: this.y});
    // draw map top layer
    //this._drawLayer(1);
};
