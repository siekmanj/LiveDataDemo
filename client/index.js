var socket = io();

//SHTtemp/:SHThumid/:BMPtemp/:BMPpressure/:batteryVoltage/:DSvelocity/:DSdirection/:DStemp/:sec/:min/:hr/:day/:month/:visibleLight/:irLight/:uvIndex/:ID

socket.on('nodeupdate', function(data){
    for(var i in data){
        var currentNode = document.getElementById('node-' + data[i].uniqueID);
        timeOfUpdate = new Date(data[i].lastUpdate);
        nodestring = "<div class=\"node\" id=\"node-" + data[i].uniqueID + "\">";
        nodestring += "<div class=\"nodeid\">"; 
        nodestring += "node-" + data[i].uniqueID;
        nodestring += "</div>";
        nodestring += "<div class=\"nodedata\">";
        nodestring += "Temp1: <b>" + data[i].temp1 + "C</b><br>";
        nodestring += "Temp2: <b>" + data[i].temp2 + "C</b><br>";
        nodestring += "Temp3: <b>" + data[i].temp3 + "C</b><br>";
        nodestring += "Humidity: <b>" + data[i].humidity + "%</b><br>";
        nodestring += "Pressure: <b>" + data[i].pressure + "</b><br>";
        nodestring += "Battery: <b>" + data[i].voltage + "V</b><br>";
        nodestring += "DS velocity: <b>" + data[i].velocity + "m/s</b><br>";
        nodestring += "DS direction: <b>" + data[i].direction + "</b><br>";
        nodestring += "Visible Light: <b>" + data[i].VB + "</b><br>";
        nodestring += "IR light: <b>" + data[i].IR + "</b><br>";
        nodestring += "UV index: <b>" + data[i].UV + "</b><br>";
        nodestring += "</div>";
        nodestring += "<div class=\"nodedate\">";
        nodestring += "Time of last update:\n";
        nodestring += (parseInt(timeOfUpdate.getMonth())+1) + "/" + timeOfUpdate.getDate() + "/" + (parseInt(timeOfUpdate.getYear())+1900) + " at " + timeOfUpdate.getHours() + ":" + timeOfUpdate.getMinutes() + ":" + timeOfUpdate.getSeconds();
        nodestring += "</div>";
        nodestring += "</div>";

        if(currentNode){
            
            currentNode.innerHTML = nodestring;
            
        }else{
         
            newhtml = document.createElement('div');
            newhtml.innerHTML = nodestring;
            
            document.getElementById('nodewrapper').appendChild(newhtml);
            

        }
    }
});