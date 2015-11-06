var routing = require('resource-routing');
var Client = require('node-rest-client').Client;

client = new Client();

//get /events
routing.index = function(req, res){
    console.log("get events");

    client.get("http://localhost:3000/events", function(data, response){
      console.log("api call");
      console.log(JSON.parse(data));
      var events = JSON.parse(data);
      res.send(events);
    });
};


module.exports = routing;
