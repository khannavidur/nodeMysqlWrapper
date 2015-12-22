"use strict";

var
    /*NODE INTERNALS*/
    UTIL            = require('util'),
    EVENTEMITTER    = require('events').EventEmitter,

    /*NPM THIRD PARTY*/
    MYSQL           = require('mysql'),
    _               = require('lodash');

UTIL.inherits(mysql, EVENTEMITTER);

function mysql(opts){
	/*
	* opts need to contain 
	* the connection credentials
	*/
    var self = this;

  	EVENTEMITTER.call(self);

    //setting the connection credentials
  	self.host        = _.get(opts,'host','');
  	self.user        = _.get(opts,'user','');
  	self.password    = _.get(opts,'password','');
  	self.db          = _.get(opts,'db','');
  	self.isPaused    = false;
  	self.counter     = 1;
  	self.data        = [];
  	self.connection  = MYSQL.createConnection({
  		host 		 : self.host,
  		user 		 : self.user,
  		password 	 : self.password,
  		database 	 : self.db
  	});
}//start function

mysql.prototype.establishConnection = function(){
    var self = this;

	self.connection.connect(function(error){
		if(error){
			self.emit('connectionError',error);
		} else{
			self.emit('connectionEstablished',self.connection.threadId);
		}
	});
};//establish connection using the given credentials

mysql.prototype.setQuery = function(queryString){
    var self = this;

	self.query = self.connection.query(queryString);

	self.query
	.on('error',function(error){
		self.emit('queryError',error);
	})
	.on('fields',function(fields){
		self.emit('queryFields',fields);
	})
	.on('result',function(row){
		if(self.counter >= self.threshold){	
			self.pause();
			self.data.push(row);
			self.emit('queryData',self.data);
		} else{
			self.counter += 1;
			self.data.push(row);
		}
	})
	.on('end',function(){
		self.emit('queryEnd',"That's all folks!");
	});
};//set the query

mysql.prototype.setThresholdSize = function(size){
	var self       = this;
	self.threshold = size;
};//set threshold size

mysql.prototype.pause = function(){
	var self  	  = this;
	self.isPaused = true;
	self.connection.pause();
};//to pause connection

mysql.prototype.resume = function(){
	var self 	  = this;
	self.isPaused = false;
	self.connection.resume();
};//to resume connection

mysql.prototype.paginate = function(){
	var self = this;		

	if(self.isPaused){
		self.counter  = 1; 
		self.data 	  = [];	
		self.resume();		
	}
};//to reset counter and paginate


module.exports = mysql;
