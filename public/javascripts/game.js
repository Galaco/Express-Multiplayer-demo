/**
 * Created by Josh on 26/06/2017.
 */

UPDATE_INTERVAL = 1000/60;

//Main Game object
Game = function(matchId, socket) {
    this.matchId = matchId;
    this.socket = socket;

    this.currentPlayer = null;

    var ctx = this;

    //Handle data sync
    socket.on('sync', function(gameData) {
        ctx.receiveData(gameData);
    });






    //Set the update loop running
    setInterval(function() {
        ctx.tick();
    }, UPDATE_INTERVAL);

    console.log('Joined a match, id: [%s]', this.matchId);
};

Game.prototype = {
    matchId: null,
    socket: null,

    currentPlayer: null,

    //Game data
    players: [],

    tick: function() {
        this.sendData();
    },

    sendData: function() {
        var gameData = {};

        this.socket.emit('sync', gameData);
    },

    receiveData: function(gameData) {

    }
};