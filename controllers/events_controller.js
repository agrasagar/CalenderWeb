var routing = require('resource-routing');
var Client = require('node-rest-client').Client;

client = new Client();

//get /events
routing.index = function(req, res){
    console.log("get events");

    client.get("http://localhost:3000/events", function(data, response){
      var events = JSON.parse(data);
      var events_array = []

      for(i in events){
        var new_event = {}
        new_event.id = events[i]._id;
        new_event.title = events[i].name;
        new_event.start = events[i].start_date;
        new_event.description = events[i].description;
      //  new_event.end = events[i].end_date;
        new_event.allDay = false;
        new_event.timezone = "Europe/Helsinki";
        events_array.push(new_event);
      }

      res.send(events_array);
    });
};

routing.create = function(req, res){
  var args = {
    data: req.body,
    headers:{"Content-Type": "application/json"}
  };

  client.post("http://localhost:3000/events", args, function(data, response){
    var events = JSON.parse(data);
    res.send(events);
  });

}


routing.update = function(req, res){
  var event = req.body;
  var args = {
    data: event,
    headers:{"Content-Type": "application/json"}
  };

  client.put("http://localhost:3000/events/"+event._id , args, function(data, response){
    var json = JSON.parse(data);
    res.send(json);
  });

}

routing.destroy = function(req, res) {
  var id = req.params.id;
  client.delete("http://localhost:3000/events/"+id, function(data, response){
    var result = JSON.parse(data);

    res.send(result);
  });
}

module.exports = routing;
