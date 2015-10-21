"use strict";

var
  UTIL          = require('util'),
  EVENTEMITTER  = require('events').EventEmitter,
  MYSQL 		= require('mysql');


UTIL.inherits(mysql, EVENTEMITTER);


function mysql(opts){
	/*
	* opts need to contain 
	* the connection credentials
	*/
	var self = this;

  	EVENTEMITTER.call(self);

  	if(!opts.host||!opts.db||!opts.password||!opts.user){
  		throw new Error("Provide required credentials to establish a connection with the datbase");
  	}

  	self.host	 	 = opts.host;
  	self.user 	 	 = opts.user;
  	self.password 	 = opts.password;
  	self.db  	     = opts.db;
  	self.isPaused    = false;
  	self.counter 	 = 1;
  	self.data 		 = [];
  	self.connection  = MYSQL.createConnection({
  		host 		 : self.host,
  		user 		 : self.user,
  		password 	 : self.password,
  		database 	 : self.db
  	});

}


mysql.prototype.establishConnection = function(){

	var self = this;

	self.connection.connect(function(error){

		if(error){
			self.emit('connectionError',error);
		} else{
			self.emit('connectionEstablished',self.connection.threadId);
		}

	});
};

mysql.prototype.setQuery = function(queryString){
	var self   = this;
	self.query = self.connection.query(queryString);

	self.query
	.on('error',function(error){
		self.emit('queryError',error);
	})
	.on('fields',function(fields){
		self.emit('queryFields',fields);
	})
	.on('result',function(row){		
		
		// /console.log("counter is " + self.counter + " and threshold is " + self.threshold);

		if(self.counter >= self.threshold){	
			self.pause();
			self.data.push(row);
			//console.log("emitting");
			self.emit('queryData',self.data);
		} else{
			self.counter += 1;
			self.data.push(row);
		}
		//self.emit('queryData',row);
	})
	.on('end',function(){
		self.emit('queryEnd',"That's all folks");
	});
};

mysql.prototype.setThresholdSize = function(size){
	var self       = this;
	self.threshold = size;
};

mysql.prototype.pause = function(){
	var self  	  = this;

	//console.log("paused");
	self.isPaused = true;
	self.connection.pause();
};

mysql.prototype.resume = function(){
	var self 	  = this;

	//console.log("resumed");
	self.isPaused = false;
	self.connection.resume();
};

mysql.prototype.paginate = function(){
	var self = this;		

	if(self.isPaused){
		self.counter  = 1; 
		self.data 	  = [];	
		self.resume();		
	}
};


module.exports = mysql;
