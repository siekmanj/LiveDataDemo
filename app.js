var express = require('express');
var app = express();
var serv = require('http').Server(app);
var port = 80;
var io = require('socket.io')(serv, {});
var deltaT = 1000/1;
var updateReady = false;

var nodes = new Array();

var SOCKET_LIST = {};

var node = function(SHTtemp, SHThumid, BMPtemp, BMPpressure, batteryVoltage, DSvelocity, DSdirection, DStemp, sec, min, hr, day, month, visibleLight, irLight, uvIndex, ID){ 
    updateTime = new Date(2017, month, day, hr, min, sec);
    //console.log(2017 + "/" + month + "/"+day+"/"+hr+"/"+min+"/"+sec);
    var self = {
        temp1: SHTtemp,
        humidity: SHThumid,
        temp2: BMPtemp,
        pressure: BMPpressure,
        voltage: batteryVoltage,
        velocity: DSvelocity,
        direction: DSdirection,
        temp3: DStemp,
        lastUdate: updateTime,
        VB: visibleLight,
        IR: irLight,
        UV: uvIndex,
        uniqueID: ID
    }//http://localhost/data/1111/     2/        3          /4/       5/              6/             7/         8/    9/   10/ 11/ 12/   13/     14/          15/      16/    1
    self.update = function(SHTtemp, SHThumid, BMPtemp, BMPpressure, batteryVoltage, DSvelocity, DSdirection, DStemp, sec, min, hr, day, month, visibleLight, irLight, uvIndex){
        updateTime = new Date(2017, month, day, hr, min, sec);
        self.temp1= SHTtemp;
        self.humidity= SHThumid;
        self.temp2= BMPtemp;
        self.pressure = BMPpressure;
        self.voltage = batteryVoltage;
        self.velocity = DSvelocity;
        self.direction = DSdirection;
        self.temp3 = DStemp;
        self.lastUpdate = updateTime;
        self.VB = visibleLight;
        self.IR = irLight;
        self.UV = uvIndex;
    }
    //console.log(self.lastUdate);
    return self;
}

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
    var currentTime = new Date(Date.now());
    console.log("Received data from node-" + req.params.ID + " on " + (parseInt(currentTime.getMonth())+1) + "/" + currentTime.getDate() + "/" + (parseInt(currentTime.getYear())+1900) + " at " + currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds() + ", data collected on " + req.day + "/" + req.month + "/" + (parseInt(currentTime.getYear())+1900) + " at " + req.hr + ":" + req.min + ":" + req.sec);
    updateReady = true;
    if(contains(nodes, req.params.ID)){
        nodes[getIndexFromID(nodes, req.params.ID)].update(  req.params.SHTtemp, 
                                                             req.params.SHThumid, 
                                                             req.params.BMPtemp,
                                                             req.params.BMPpressure,
                                                             req.params.batteryVoltage,
                                                             req.params.DSvelocity,
                                                             req.params.DSdirection,
                                                             req.params.DStemp,
                                                             req.params.sec,
                                                             req.params.min,
                                                             req.params.hr,
                                                             req.params.day,
                                                             req.params.month,
                                                             req.params.visibleLight,
                                                             req.params.irLight,
                                                             req.params.uvIndex
                                                          );
    }else{
        nodes.push(
            new node(req.params.SHTtemp, 
                     req.params.SHThumid, 
                     req.params.BMPtemp,
                     req.params.BMPpressure,
                     req.params.batteryVoltage,
                     req.params.DSvelocity,
                     req.params.DSdirection,
                     req.params.DStemp,
                     req.params.sec,
                     req.params.min,
                     req.params.hr,
                     req.params.day,
                     req.params.month,
                     req.params.visibleLight,
                     req.params.irLight,
                     req.params.uvIndex,
                     req.params.ID));
    }
   
    res.status(200).send("Success"); //Send the node a confirmation of receipt.
    
    updateReady = true;
});

app.get("*", function(req, res){
    console.log(req);
});

io.sockets.on('connection', function(socket){

    socket.id = Math.floor(Math.random()*1000000);
    socket.toRemove = false;
    SOCKET_LIST[socket.id] = socket;
    socket.emit('nodeupdate', nodes);//Get the newly connected user up-to-date with all the data strings sent by nodes.
    
    var currentTime = new Date(Date.now());
    console.log("Connection from " + socket.request.connection._peername.address + " on " + (parseInt(currentTime.getMonth())+1) + "/" + currentTime.getDate() + "/" + (parseInt(currentTime.getYear())+1900) + " at " + currentTime.getHours() + ":" + currentTime.getMinutes() + ". " + numberOfObjects(SOCKET_LIST) + " users currently connected.");
    

    socket.on('disconnect', function(){ //This is executed when a socket disconnects, so the server doesn't send packages to sockets that don't exist anymore.
        delete SOCKET_LIST[socket.id];
        var currentTime = new Date(Date.now());
        console.log(socket.request.connection._peername.address + " disconnected. " + numberOfObjects(SOCKET_LIST) + " users currently connected.")    
    });
});
    
var contains = function(arr, ID){
    for(var i in arr){
        if(arr[i].uniqueID == ID){
            return true;
        }
    }
    return false;
}

var numberOfObjects = function(list){
    var count = 0;
    for(var i in list) count++;
    return count;
}

var getIndexFromID = function(arr, ID){
    for(var i in arr){
        if(arr[i].uniqueID == ID){
            return i;
        }
    }
    return -1;
}
setInterval(function(socket){ // This is a function that is called every 'tick'.   
    if(updateReady){
        console.log("Sending update to all connected clients.");
        for(var i in SOCKET_LIST){ //This loop sends a package with the now updated curve list to every socket currently connected to the server.
            var socket = SOCKET_LIST[i];
            socket.emit('nodeupdate', nodes);
        }  
    }
    updateReady = false;
   
 }, deltaT);
