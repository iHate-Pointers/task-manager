Data Sanitization helps us alter data before saving, removing empty space before sending it back to our DB
Data Validation we can enfore to some rules, user age should be greater than 18 etc..
There are many Schema types in Mongoose, like String, Number, Date, Array, etc. which falls under type
We have default, required etc.. and even sanitizaition types like toUpperCase etc.

First thing in the app we did, Data Validation and Sanitization (trim, required, email,pass mini authnetication etc.)

Then we Structured the API, using REST API (Representational State Transfer - Application Program Interface)
An API is a set of tool that helps you build software tools, (npm provides stuffs like fs, nodemon etc. || express also provides us stuffs)

REST API 
-------------------------------
REST API allows clients such as a web application, to access and manupilate resources using set of pre-defined operations like making a new task or stuffs like uploading profile pic for account. 

Representational - Working with representations of data (users and task)
State - Request passed from user to client or client back to user (Authentication etc. )
In practical requests are made through HTTP

We make request to Server, GET / tasks / (Object ID) [falls under READ], Server will find the data in DB, sends it back sends a status code: 202 and JSON response  (We get the RESPONSE Back)

We make another request, POST / tasks - JSON request [This falls under CREATE]. Server will put it in DB if valid then give back response with status code: 203 

We make another request, PATCH / tasks / (Object ID) [This falls under UPDATE]. Server will put it in DB if valid then give back response with its status code

We make another request, DELETE / tasks / (Object ID) [This falls under DELETE]. Server will put it in DB if valid then give back response with its status code