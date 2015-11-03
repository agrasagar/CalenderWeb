var routing = require('resource-routing');
var util = require('util');
var db = require('./../db').db;
var User = db.bind('users');

routing.index = function(req, res){
    User.find().toArray(function(err,items){
        res.send(items);
    })

}

routing.create = function(req, res) {
    var new_user = {
        name: req.body.name,
        email: req.body.email
    }
    User.insert(new_user, function(error, user) {
        if (error) return next(error);
        console.log(user);
        res.send(user);
    });
}

module.exports = routing;