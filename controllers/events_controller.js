var routing = require('resource-routing');
var Client = require('node-rest-client').Client;
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;


var gCalKeys = {
  clientId: "462596446350-kp7hpclfj72g7dc6p214kbl033loac5a.apps.googleusercontent.com",
  clientSecret: "PG2n3ti0ICkJ1mDjo-ZIPuE8",
  redirectUrl: "http://localhost:4000/oauth2callback",
}

var client = new Client();
var event_id = "";
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

routing.search = function(req,res){
  var params = req.body;
  console.log(params);
  args ={
        data: req.body, // query parameter substitution vars
        headers:{"Content-Type":"application/json"} // request headers
      };
     client.post("http://localhost:3000/events/search",args, function(data, response){
          var events = JSON.parse(data);
          console.log(events);
          res.send(events);
    });
}

routing.export_event = function(req, res) {
  event_id = req.body.id;

  var oauth2Client = new OAuth2(gCalKeys.clientId, gCalKeys.clientSecret, gCalKeys.redirectUrl);
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: "https://www.googleapis.com/auth/calendar"
  });
  res.send(url);
}

//callback action for googleapi authentication
routing.oauth2callback = function(req, res){
  code = req.query.code;
  var oauth2Client = new OAuth2(gCalKeys.clientId, gCalKeys.clientSecret, gCalKeys.redirectUrl);
  oauth2Client.getToken(code, function(err, tokens) {
    if(!err) {
      oauth2Client.setCredentials(tokens);

      client.get("http://localhost:3000/events/"+event_id, function(data, response){
        var event = JSON.parse(data);

        var event_to_export = {}
        event_to_export.summary = event.name;
        event_to_export.start = {"dateTime": event.start_date};
        event_to_export.end = {"dateTime": event.end_date};
        event_to_export.description = event.description;

        console.log(event_to_export);
        google.calendar("v3").events.insert({
          calendarId: "primary",
          auth: oauth2Client,
          resource: event_to_export
        }, function(err, response){
          if(err){
            console.log(err);
          } else {
            console.log(response);
          }
          res.render('home', { title: 'Calendar' });
        });

      });


    }
  });

}

module.exports = routing;
