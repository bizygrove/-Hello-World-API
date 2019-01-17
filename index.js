
// Depenicies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;


// Build the sever
const server = http.createServer(function(req,res){

    // Get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the pathname
    var path = parsedUrl.pathname;

    // Trim the Path
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the http method (GET, POST, DELETE, PUT...)
    var method = req.method.toLocaleLowerCase();

    // Get the headers
    var headers = req.headers;

    // Streams come into the application, bit by bit
    // We collect the streams, decode them, and add the streams to a variable
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    // We are binding this function (callback) to an event which the request object emits called "data".
    // EMITs means = to call the callback on a event. (callback means to run another function when one function is finished)
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    // Binding another function on a event called "end"
    // When request object emits the event "end", call this callback
    req.on('end', function(){
        // Call 'end' to complete process
        buffer += decoder.end();
    });


    // Does the pathname entered in exist as one of our handlers? if not found to go stright to the handler notFound
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler

    var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
    };

    // Making sure the callBack is what we want. statusCode is a number and payload is an object
    // Route the request to the handler speficied by the router

    chosenHandler(data, function(statusCode, payload) {
        // Make sure statusCode is a Number
        statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
        // MAke sure payload is an Object
        payload = typeof(payload) === 'object' ? payload : {};

        // Convert payload into string. We can do this as we made sure payload was an Object above.
        var payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');

        // send the statusCode to the page
        res.writeHead(statusCode);
        res.end(payloadString);

        console.log('Returning this reponse: ',statusCode, payloadString);
    })

});

// All the sever info


// Start the server

// Start the HTTPS server
server.listen(3005,function(){
    console.log("The server is listening to port 3005");
});

// Define the handlers

var handlers = {};

handlers.hello = function(data, callback){
    callback(406, {
        'Movie' : 'Monty Python',
        'Best Quote' : {
            'Bedevere' : 'What makes you think she is a witch?',
            'Peasant' : 'She turned me into a newt!!',
            'Bedvere' : 'A Newt?!',
            'peasant' : '... Well I got better'
        }
    })
}

var router = {
    'hello' : handlers.hello
}

