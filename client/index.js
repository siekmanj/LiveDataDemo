var socket = io();
//SHTtemp/:SHThumid/:BMPtemp/:BMPpressure/:batteryVoltage/:DSvelocity/:DSdirection/:DStemp/:sec/:min/:hr/:day/:month/:visibleLight/:irLight/:uvIndex/:ID
var curve = function(SHTtemp, SHThumid, BMPtemp, BMPpressure, batteryVoltage, DSvelocity, DSdirection, DStemp, sec, min, hr, day, mnth, visibleLight, irLight, uvIndex, ID){ 
    var self = {
        temp1: SHTtemp,
        humidity: SHThumid,
        temp2: BMPtemp,
        pressure: BMPpressure,
        voltage: batteryVoltage,
        velocity: DSvelocity,
        direction: DSdirection,
        temp3: DStemp,
        seconds: sec,
        minutes: min,
        hour: hr,
        date: day,
        month: mnth,
        VB: visibleLight,
        IR: irLight,
        UV: uvIndex,
        uniqueID: ID
    }
    self.update = function(){
        
    }
    return self;
}


socket.on('connectionResponse', function(data){
    
});

socket.on('nodeupdate', function(data){
    console.log("Test");
    console.log(data); 
});

