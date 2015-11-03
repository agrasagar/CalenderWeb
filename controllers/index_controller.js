
var routing = require('resource-routing');
var express = require('express');
var app = express();

routing.home = function(req, res){
  console.log("home!!!!!!!!!!!!!!!!!!!!!!!!!!");
    res.render('home', { title: 'Calendar' });
}

module.exports = routing;
