/**
 * Created by Josh on 26/06/2017.
 */

UPDATE_INTERVAL = 1000/30;
FRAMERATE = 1000/60;

//Main Game object
Match = function(matchId, socket) {
    this.matchId = matchId;
    this.socket = socket;

    var ctx = this;

    //Handle data sync
    socket.on('sync', function(gameData) {
        ctx.receiveData(gameData);
    });


    //Set the update loop running
    setInterval(function() {
        ctx.tick();
    }, UPDATE_INTERVAL);
    setInterval(function() {
        ctx.draw();
    }, FRAMERATE);

    console.log('Joined a match, id: [%s]', this.matchId);
};

Match.prototype = {
    matchId: null,
    socket: null,

    game: null,

    setGame: function(game) {
        this.game = game;
    },

    draw: function() {
        if (this.game) {
            this.game.render();
        }
    },

    tick: function() {
        if (this.game) {
            this.game.render();
            this.game.update();
            this.sendData();
        }
    },

    sendData: function() {
        if (this.game) {
            this.socket.emit('sync', this.game.fetchClientData());
        }
    },

    receiveData: function(gameData) {
        //Syncing with server
        if (this.game) {
            this.game.syncServerData(gameData);
        }
    }
};