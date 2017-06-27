/**
 * Created by Josh on 27/06/2017.
 */

WINDOW_WIDTH = 998;
WINDOW_HEIGHT = 548;

Renderer = function(domNodeId) {
    this.canvas = document.createElement('canvas');
    this.domNode = document.getElementById(domNodeId);
    this.canvas.width = WINDOW_WIDTH;
    this.canvas.height = WINDOW_HEIGHT;
    this.renderContext = this.canvas.getContext("2d");
    this.domNode.appendChild(this.canvas);
};

Renderer.prototype = {
    domNode: null,
    canvas: null,
    renderContext: null,

    imageLibrary: {},

    render: function(gameData) {
        this.renderContext.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
        gameData.players.forEach(function(player) {
          this._drawImage(this.loadImg('/images/player.png'), player.x, player.y);
        }, this);
    },


    _drawImage: function(image, x, y) {

        this.renderContext.save();

        //this.renderContext.translate(x, y);
        this.renderContext.drawImage(image, x, y);

        this.renderContext.restore();
    },

    loadImg: function(source) {
        if (!this.imageLibrary[source]) {
            image = new Image();
            image.src = source;
            this.imageLibrary[source] = image;
        }

        return this.imageLibrary[source];
    }
};