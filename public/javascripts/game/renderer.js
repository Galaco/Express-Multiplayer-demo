/**
 * Created by Josh on 27/06/2017.
 */

WINDOW_WIDTH = 1060;
WINDOW_HEIGHT = 548;

Renderer = function(domNodeId) {
    this.canvas = document.createElement('canvas');
    this.domNode = document.getElementById(domNodeId);
    this.domNode.innerHTML = '';
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

    clearContext: function() {
        this.renderContext.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    },

    renderPlayers: function(players) {
        var l = players.length;
        while(l--) {
            if (players[l].isThisClient) {
                this._drawImage(this._loadImg('/images/player.png'), players[l].position.x, players[l].position.y);
            } else {
                this._drawImage(this._loadImg('/images/opponent.png'), players[l].position.x, players[l].position.y);
            }
        }
    },

    renderMap: function(mapData) {
        var l = mapData.length;
        while (l--) {
            if (mapData[l] !== null) {
                switch(mapData[l].type) {
                    case 1:
                       this._drawImage(this._loadImg('/images/breakable.png'), mapData[l].position.x, mapData[l].position.y);
                        break;
                    case 2:
                        this._drawImage(this._loadImg('/images/block.png'), mapData[l].position.x, mapData[l].position.y);
                        break;
                }
            }
        }
    },


    _drawImage: function(image, x, y) {
        this.renderContext.drawImage(image, x, y);
    },

    _loadImg: function(source) {
        if (!this.imageLibrary[source]) {
            image = new Image();
            image.src = source;
            this.imageLibrary[source] = image;
        }

        return this.imageLibrary[source];
    }
};