var express = require('express');
var app = express();
var serv = require('http').Server(app);
var port = 80;
var io = require('socket.io')(serv, {});
var deltaT = 1000/1;
var updateReady = true;

var dataBuffer = new Array();
var dataStorage = new Array();

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
//http://localhost/data/1/2/3/4/5/6/7/8/9/10/11/12/13/14/15/16/17

app.get('/data/:SHTtemp/:SHThumid/:BMPtemp/:BMPpressure/:batteryVoltage/:DSvelocity/:DSdirection/:DStemp/:sec/:min/:hr/:day/:month/:visibleLight/:irLight/:uvIndex/:ID/', function(req, res){
    console.log(req.params);
    dataBuffer.push(req.params); //Put the new data inside a data buffer to be sent out next time there's an update.
    dataStorage.push(req.params); //Put the new data inside an array containing all data updates, to be sent out when a client connects for the first time.
    res.status(200).send("Success"); //Send the node a confirmation of receipt.
    
    updateReady = true;
});

io.sockets.on('connection', function(socket){

    socket.id = Math.floor(Math.random()*1000000);
    socket.toRemove = false;
    SOCKET_LIST[socket.id] = socket;
    socket.emit('connectionResponse', dataStorage);//Get the newly connected user up-to-date with all the data strings sent by nodes.

    console.log("Connection from " + socket.request.connection._peername + ". " + numberOfObjects(SOCKET_LIST) + " users currently connected.");
    console.log(socket.request.connection._peername);
    

    socket.on('disconnect', function(){ //This is executed when a socket disconnects, so the server doesn't send packages to sockets that don't exist anymore.
        delete SOCKET_LIST[socket.id];
        console.log(socket.id + " disconnected. " + numberOfObjects(SOCKET_LIST) + " users currently connected.")    
    });
});

var numberOfObjects = function(list){
    var count = 0;
    for(var i in list) count++;
    return count;
}

setInterval(function(socket){ // This is a function that is called every 'tick'.   
    if(updateReady){
        for(var i in SOCKET_LIST){ //This loop sends a package with the now updated curve list to every socket currently connected to the server.
            var socket = SOCKET_LIST[i];
            for(var i in dataBuffer){
                socket.emit('nodeupdate', dataBuffer[i]);
            }
        }
        updateReady = false
        dataBuffer = []; // Clear the data buffer now that all updates have been sent
    }
 }, deltaT);
