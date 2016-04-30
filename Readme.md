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
- 
