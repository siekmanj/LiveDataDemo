var socket = io();

//SHTtemp/:SHThumid/:BMPtemp/:BMPpressure/:batteryVoltage/:DSvelocity/:DSdirection/:DStemp/:sec/:min/:hr/:day/:month/:visibleLight/:irLight/:uvIndex/:ID

socket.on('nodeupdate', function(data){
    for(var i in data){
        var currentNode = document.getElementById('node-' + data[i].uniqueID);
        timeOfUpdate = new Date(Date.now());

        if(currentNode){
            
            nodestring = "<div class=\"node\" id=\"node-" + data[i].uniqueID + "\">";
            nodestring += "<div class=\"nodeid\">"; 
            nodestring += "node-" + data[i].uniqueID;
            nodestring += "</div>";
            nodestring += "<div class=\"nodedata\">";
            nodestring += "Temp1: " + data[i].temp1 + "C<br>";
            nodestring += "Temp2: " + data[i].temp2 + "C<br>";
            nodestring += "Temp3: " + data[i].temp3 + "C<br>";
            nodestring += "Humidity: " + data[i].humidity + "%<br>";
            nodestring += "Pressure: " + data[i].pressure + "<br>";
            nodestring += "Battery: " + data[i].voltage + "V<br>";
            nodestring += "DS velocity: " + data[i].velocity + "m/s<br>";
            nodestring += "DS direction: " + data[i].direction + "<br>";
            nodestring += "Visible Light: " + data[i].VB + "<br>";
            nodestring += "IR light: " + data[i].IR + "<br>";
            nodestring += "UV index: " + data[i].UV + "<br>";
            nodestring += "</div>";
            nodestring += "<div class=\"nodedate\">";
            nodestring += "Time of last update:\n";
            nodestring += (parseInt(timeOfUpdate.getMonth())+1) + "/" + timeOfUpdate.getDate() + "/" + (parseInt(timeOfUpdate.getYear())+1900) + " at " + timeOfUpdate.getHours() + ":" + timeOfUpdate.getMinutes();
            nodestring += "</div>";
            nodestring += "</div>";
            
            currentNode.innerHTML = nodestring;
            
        }else{
            
            nodestring = "<div class=\"node\" id=\"node-" + data[i].uniqueID + "\">";
            nodestring += "<div class=\"nodeid\">"; 
            nodestring += "node-" + data[i].uniqueID;
            nodestring += "</div>";
            nodestring += "<div class=\"nodedata\">";
            nodestring += "Temp1: " + data[i].temp1 + "C<br>";
            nodestring += "Temp2: " + data[i].temp2 + "C<br>";
            nodestring += "Temp3: " + data[i].temp3 + "C<br>";
            nodestring += "Humidity: " + data[i].humidity + "%<br>";
            nodestring += "Pressure: " + data[i].pressure + "<br>";
            nodestring += "Battery: " + data[i].voltage + "V<br>";
            nodestring += "DS velocity: " + data[i].velocity + "m/s<br>";
            nodestring += "DS direction: " + data[i].direction + "<br>";
            nodestring += "Visible Light: " + data[i].VB + "<br>";
            nodestring += "IR light: " + data[i].IR + "<br>";
            nodestring += "UV index: " + data[i].UV + "<br>";
            nodestring += "</div>";
            nodestring += "<div class=\"nodedate\">";
            nodestring += "Time of last update:\n";
            nodestring += (parseInt(timeOfUpdate.getMonth())+1) + "/" + timeOfUpdate.getDate() + "/" + (parseInt(timeOfUpdate.getYear())+1900) + " at " + timeOfUpdate.getHours() + ":" + timeOfUpdate.getMinutes();
            nodestring += "</div>";
            nodestring += "</div>";
            
            newhtml = document.createElement('div');
            newhtml.innerHTML = nodestring;
            
            document.getElementById('nodewrapper').appendChild(newhtml);
            

        }
    }
});



/*

<div class="node" id="testnode">
     <div class="nodeid" id="testNodeId">
         Node ID goes here
     </div>
    <div class="nodedata" id="testNodeData">
        Temp1: 39C <br>
         Temp2: 38C<br>
         Humidity: 40%<br>
         Pressure: 1000mB<br>
         Battery: 11.4V<br>
         DS Velocity: ??<br>
         DS Direction: ??<br>
         Visible Light: ??<br>
         IR light: ??<br>
         UV index: ??<br>
    </div>
    <div class="nodedate" id="lastUpdate">
        SEC/MIN/HR<br>
        DD/MM/YYYY
    </div>
  </div>
  
*/