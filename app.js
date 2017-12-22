var express = require('express');
var app = express();
var serv = require('http').Server(app);
var port = 80;
var io = require('socket.io')(serv, {});
var deltaT = 1000/60;

var SOCKET_LIST = {};


app.use('/client', express.static(__dirname + '/client'));

serv.listen(port);

console.log("Server started on port " + port);


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/index.js', function(req, res){
    res.sendFile(__dirname + '/client/index.js');
});

app.get('/data/:SHTtemp/:SHThumid/:BMPtemp/:BMPpressure/:batteryVoltage/:DSvelocity/:DSdirection/:DStemp/:sec/:min/:hr/:day/:month/:visibleLight/:irLight/:uvIndex', function(req, res){
    console.log(req.params);
});

io.sockets.on('connection', function(socket){

    socket.id = Math.floor(Math.random()*1000000);
    socket.toRemove = false;
    SOCKET_LIST[socket.id] = socket;

    console.log("Connection from " + socket.id + ". " + numberOfObjects(SOCKET_LIST) + " users currently online.");

    socket.on('disconnect', function(){ //This is executed when a socket disconnects, so the server doesn't send packages to sockets that don't exist anymore.
        socket.toRemove = true; //We don't want to remove a user from the contributor list unless all of his curves have faded, so we need to keep him in the socket_list until then.
    });
});

var removeUser = function(socketID){

    delete SOCKET_LIST[socketID];
    console.log(socketID + " disconnected. " + numberOfObjects(SOCKET_LIST) + " users currently online.")
}

var numberOfObjects = function(list){
    var count = 0;
    for(var i in list){
        count++;
    }
    return count;
}

setInterval(function(socket){ // This is a function that is called every 'tick'.

   
    for(var i in SOCKET_LIST){ //This loop sends a package with the now updated curve list to every socket currently connected to the server.
        var socket = SOCKET_LIST[i];
        
        if(socket.toRemove){ //If the user has disconnected he is removed from the socket list.
            removeUser(socket.id);
        }
		//socket.emit('contributors', contributorList, contributorColors);
    }

 }, deltaT);
