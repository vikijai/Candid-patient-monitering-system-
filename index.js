var firebase = require("firebase");
var SerialPort = require('serialport');
var port = new SerialPort('COM3', {
  baudRate: 9600
});

var config = {
    apiKey: "AIzaSyBhcNrSqjHRsC9n9DThcHtHAac8EVmeiew",
    authDomain: "candid-2-0.firebaseapp.com",
    databaseURL: "https://candid-2-0.firebaseio.com",
    projectId: "candid-2-0",
    storageBucket: "",
    messagingSenderId: "809387437907"
};

firebase.initializeApp(config);

console.log(process.argv[2]);

var personid=process.argv[2];
var received="";
var time;
var times=[],times1=[];

port.on('readable', function () {
    var byte = String(port.read());    
    received+=byte;
    if(byte.includes('\n'))
    {
        if(received.includes('heart')){
            time = parseInt(received);
            receivedTime(time);
        }
         else if(received.includes('breath')){
          time=parseInt(received);
          receivedbreath(time);
        }else {

            //console.log(received);

            if(received.includes('1h'))
                firebase.database().ref('/avr/sensors/dip1/').set('on');
            else if(received.includes('1l'))
                firebase.database().ref('/' + personid + '/sensors/dip1/').set('off');
            else if(received.includes('2h'))
                firebase.database().ref('/' + personid + '/sensors/dip2/').set('on');
            else if(received.includes('2l'))
                firebase.database().ref('/' + personid + '/sensors/dip2/').set('off');

            console.log('dip');
        }
        received="";
    }
});

function receivedTime(time){
    
    if(!times.empty && time - times[ times.length - 1] > 1500){
        times=[];
        return;
    }

    times.push(time);

    if(times.length>=5){
    
        times.shift();

        var h1 = 60000/(times[1]-times[0]);    
        var h2 = 60000/(times[2]-times[1]);
        var h3 = 60000/(times[3]-times[2]);

        var h = (h1 + h2 + h3)/3;

        console.log('heart: ' + h);

        firebase.database().ref('/' + personid + '/sensors/heart/').set(Math.round(h));

    }

}
function receivedbreath(time){
    
    if(!times1.empty && time - times1[ times1.length - 1] > 1500){
        times1=[];
        return;
    }

    times1.push(time);

    if(times1.length>=5){
    
        times1.shift();

        var h1 = 60000/(times1[1]-times1[0]);    
        var h2 = 60000/(times1[2]-times1[1]);
        var h3 = 60000/(times1[3]-times1[2]);

        var h = (h1 + h2 + h3)/3;

        console.log('breath: ' + h);

        firebase.database().ref('/' + personid + '/sensors/breath/').set(Math.round(h));

    }

}


firebase.database().ref('/' + personid + '/devices/').on('value', function(snapshot){

    var devices = snapshot.val();

    if(devices['motor']=='on')
        sendToBoard('1');
    else
        sendToBoard('2');

    if(devices['led1']=='on')
        sendToBoard('3');
    else
        sendToBoard('4');

    if(devices['led2']=='on')
        sendToBoard('5');
    else
        sendToBoard('6');

});

function sendToBoard(data)
{
    port.write(data, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('Message sent');
    });
       
    port.on('error', function(err) {
        console.log('Error: ', err.message);
    })
      
}

