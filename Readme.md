#Node MySql Wrapper
A wrapper around mysql for nodejs to provide pagination across row recieved.
Include the index.js script in your node js repo and check for yourself.
Included a test.js for your help.

#Functions
- Require the index.js like 
  `mysql = require('./index.js')`
- Set the Connection Options
  ```
  var options = {
    host            : 'localhost',
    user            : 'root',
    password        : '',
    db              : 'dummy'
  };
  
  ```
- Instantiate a new object while passing the options
  `mysqlOb = new mysql(options);`

- Establish the connection with the mysql server by calling the function `mysqlOb.establishConnection();`
  - The function emits `connectionEstablished` when a successful connection is established along with the connection's thread id. 
  - In case of an error, the function emits `connectionError` along with the error
  - Example : 
     ```
      mysqlOb.on('connectionEstablished',function(threadid){
        console.log("connected with thread id : " + threadid)
      });
     
     ```
- Set Threshold Size
  `mysqlOb.setThresholdSize(10);`

- Set the query
  ```
  var query = "select * from users";
  mysqlOb.setQuery(query);
  ```
  - It emits `queryData` containing the resultant row data. Paginate further by calling `mysqlOb.paginate();` 
  ```
  mysqlOb.on('queryData',function(row){
    console.log("data : " + UTIL.inspect(row,10,true,10));
    mysqlOb.paginate();
  });
  
  ```
  
  - `queryEnd` is emmitted to mark the end of pagination.It also send along a message saying `That's all folks!`
  ```
  mysqlOb.on('queryEnd',function(message){
    console.log(message);
    process.exit(0);
  });
  ```
  
  - In case of any errors in the query `queryError` is emitted along with the error.
  ```
  mysqlOb.on('queryError',function(queryError){
    console.log("error in querry" + queryError);
  });
  ```
  
  - `queryFields` is emitted with fields which contain information about the returned results fields (if any)
  ```
  mysqlOb.on('queryFields',function(queryFields){
    console.log("queryFields :" + UTIL.inspect(queryFields,10,true,10));
  });
  ```
