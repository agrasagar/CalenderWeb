//resource routing generates resourceful routes for event resource.
var routing = require('resource-routing');
var db = require('./../db').db;
var Event = db.bind('events');

var DATE_SEPARATOR  = '-';
var TIME_SEPARATOR  = ':';

/*
    event = {
         name: string,
         start_date: Date (saved in UTC),
         end_date: Date (saved in UTC),
         description: String,
         repeat: String (can be one of {"none", "daily", "weekly", "biweekly", "monthly", "yearly"})
    }

*/

//get /events
routing.index = function(req, res){
    Event.find().toArray(function(err,events){
        if (err) return next(err);
        res.send(events);
    })
}

//post /events
routing.create = function(req, res) {
    //validate the params, send errors in resonse if invalid
    var error_hash = validate(req.body);
    if(error_hash.hasError){
        return res.send(error_hash);
    }

    var new_event = get_event_params(req.body)
    console.log(new_event);
    Event.insert(new_event, function(error, event) {
        if (error) return next(error);
        console.log(event);
        res.send(event);
    });
}

//get /events/:id
routing.show = function(req, res) {
    Event.findById(req.params.id, function(err,event){
        if (err) return next(err);
        res.send(event);
    })
}

//post /events/:id
routing.update = function(req, res) {
    var error_hash = validate(req.body);
    if(error_hash.hasError){
        return res.send(error_hash);
    }

    var new_event = get_event_params(req.body);
    console.log(new_event);
    Event.updateById(req.params.id, {$set: new_event}, function(err, event){
        if (err) return next(err);
        res.send(event);
    })
}

//delete /events/:id
routing.destroy = function(req, res) {
    console.log(req.params);
    Event.removeById(req.params.id, function(err, count){
        if (err) return next(err);
        res.send({affectedCount: count});
    })
};

//post /events/search
routing.search = function(req, res){
    var req_params = req.body;
    var query_options = {};
    if("name" in req_params) query_options["name"] = {'$regex': new RegExp(req_params.name, "i")};
    if("description" in req_params) query_options["description"] = {'$regex': new RegExp(req_params.description, "i")};
    if("start_date" in req_params) query_options["start_date"] = {'$gte': stringToDate(req_params.start_date, "00:00")};
    if("end_date" in req_params) query_options["end_date"] = {'$lte': stringToDate(req_params.end_date, "21:59")};
    if("repeat" in req_params) query_options["repeat"] = req.params.repeat;

    console.log(query_options);
    Event.find(query_options).toArray(function(err,events){
        if (err) return next(err);
        console.log(events);
        res.send(events);
    })

};

//function to build event hash from request body
var get_event_params = function(body){
    var start_date = stringToDate(body.start_date, body.start_time);
    if(body.end_date && body.end_time){
        var end_date = stringToDate(body.end_date, body.end_time);
    } else {
        var end_date = new Date(start_date.getTime() + 30*60*1000);
    }

    if(!body.repeat){
        body.repeat = "none";
    }

    var new_event = {
        name: body.name,
        start_date: start_date,
        end_date: end_date,
        description: body.description,
        repeat: body.repeat
    };
    return new_event;
};

var stringToDate = function(date_string, time_string){
    var date_array = date_string.split(DATE_SEPARATOR);
    var time_array = time_string.split(TIME_SEPARATOR);
    //Date(year, month (0 = January), day, hour, minute)
    var date = new Date(date_array[0], date_array[1] - 1,date_array[2], time_array[0], time_array[1]);
    return date;
};

//function to validate the params in request body
//returns error hash
var validate = function(body){
    var errorHash={};
    errorHash["hasError"]=false;
    var errorEventHash={};
    if(!body.name){
        errorHash["hasError"]=true;
        errorEventHash["name"]="Name field is mandatory.";
        errorHash["errors"]=errorEventHash;
    }

    var date_pattern = /^\d{4}-\d{1,2}-\d{1,2}$/;
    if(!body.start_date || (body.start_date && !body.start_date.match(date_pattern))){
        errorHash["hasError"]=true;
        errorEventHash["start_date"]="Start date should be in pattern: 'yyyy-mm-dd'";
        errorHash["errors"]=errorEventHash;
    }

    var time_pattern = /^\d{1,2}:\d{1,2}$/;
    if(!body.start_time || (body.start_time && !body.start_time.match(time_pattern))){
        errorHash["hasError"]=true;
        errorEventHash["start_time"]="Start time should be in pattern: 'hh:mm'";
        errorHash["errors"]=errorEventHash;
    }

    if(body.end_date){
        if(!body.end_date.match(date_pattern)){
            errorHash["hasError"]=true;
            errorEventHash["end_date"]="End date should be in pattern: 'yyyy-mm-dd'";
            errorHash["errors"]=errorEventHash;
        }
    }

    if(body.end_time){
        if(!body.end_time.match(time_pattern)){
            errorHash["hasError"]=true;
            errorEventHash["end_time"]="End time should be in pattern: 'yyyy-mm-dd'";
            errorHash["errors"]=errorEventHash;
        }
    }

    return errorHash;
};



module.exports = routing;