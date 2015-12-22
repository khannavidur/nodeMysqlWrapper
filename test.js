"use strict";
(function(){
	var 
		UTIL 	= require('util'),
		mysql 	= require('./index.js'),
		options = {
		host 		: 'localhost',
		user 		: 'root',
		password 	: '',
		db 			: 'dummy'
	},
	query 		= "select * from user where roll_no=2",
	mysqlOb 	= new mysql(options);

	mysqlOb.establishConnection();
	mysqlOb.setThresholdSize(1);
	mysqlOb.setQuery(query);	

	mysqlOb.on('connectionEstablished',function(threadid){
		console.log("connected with thread id : " + threadid)
	});

	mysqlOb.on('queryData',function(row){
		console.log("data : " + UTIL.inspect(row,10,true,10));
		mysqlOb.paginate();
	});


	mysqlOb.on('queryEnd',function(message){
		console.log(message);
		process.exit(0);
	});

	mysqlOb.on('queryError',function(queryError){
		console.log("error in querry" + queryError);
	});

	mysqlOb.on('queryFields',function(queryFields){
		console.log("queryFields :" + UTIL.inspect(queryFields,10,true,10));
	});
	

}())
