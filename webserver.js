var Gpio = require('onoff').Gpio; //require onoff to control GPIO
var GATEPin = new Gpio(26, 'high'); //declare GPIO26 an output
var GARAGEPin = new Gpio(20, 'high'); //declare GPIO20 an output
var fs = require('fs'); //require filesystem to read html files
var http = require('http').createServer(function handler(req, res) { //create server
  fs.readFile(__dirname + '/index.html', function (err, data) { //read html file
    if (err) {
      res.writeHead(500);
      return res.end('Error loading socket.io.html');
    }

    res.writeHead(200);
    res.end(data);
  });
});

var io = require('socket.io')(http) //require socket.io module and pass the http object

http.listen(8080); //listen to port 8080

console.log("Gate status: " + GATEPin.readSync() + " Garage status: " + GARAGEPin.readSync());

io.sockets.on('connection', function (socket) {// WebSocket Connection
  	var buttonState = 0; //variable to store button state

  	socket.on('state', function (data) { //get button state from client
		buttonState = data;
		console.log("inside the function: " + buttonState);
		if (buttonState != GATEPin.readSync()) { //Change LED state if button state is changed
		GATEPin.writeSync(buttonState); //turn LED on or off
		console.log("After: " + buttonState);
    		}
	});
});

