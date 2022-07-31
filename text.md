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

Requst has 
______________________
Along with the above we also have other signification data when we request/get response i.e.
Accept: application/json
Connection: Keep-Alive
Authorization: Bearer agjiakogjkae314wjrf1 ..

{description: 'bla bla'} //This is a completed line


Response has 
___________________

STATUS CODE 
Date : 69/69/6999
Server : EXPRESS
Content Type: application/json

{"_id": "sadasd", "name": "asfAS" ..... etc.}

THIS IS A BASIC STRUCTURE OF THE HTTP STRUCTURE 
____________________________________________________________________________________________________________________

WE mOVE ON TO POSTMAN!! helps us make http request more easily (The end points prefereably)

Go and make a new collection, enter a URL (pereferably of weather app) and see the response!

Now RESORUCES CREATION ENDPOINTS

httpstatuscode.com {Place to know all the Status codes}

Mongoose.js connects us to Database, User.js and task.js gives us the user and task models, POST endpoints


Async Await - A JS Feature less asynchronous than Async JS. Saves lots of things easier
We using it on every Route Handler in this project

Now we put async await to all our routes to make the handling easier, Syntax is tuff but still better than fully async code!

for create, we got post
for read, we got get
for Update, we got patch 
for Delete - we got delete

After doing these opeerations we go and switch to Seperating route files to make it cleaner!
Routes for Users and Routes for Tasks

We then move to 
//Authentication part!!
Passwords must be securely saved or else people can delete it and edit it and stuffs! Hence we give all our data some kinda authentication
Solution is to store not a plain text pass but a hashed password!
Algorithm we are using is called B-Crypt, secure the password!
npm module we use for this algo is bcryptjs

So basically we have a hashed password in database ->
We update it, and now we got plain text pass again, we gotta use hashing on it again!
To do so we customise the user model. Mongoose allows us to do something called middle ware where we don't need to change any routes to get this desired result!

The middle ware alogo in some places skips 'this' keyword itself hence we gotta edit the thing to a new layout
Now we also bring in login id and password tab Schema (FindByCredentials) -> When these user ID and pass is given then our JS will start!
The next step is to JSON Web Tokens so that other users may not delete our files!
Give a token when they're authenticated then they can do the task!
We use JWT, never expire a token or do it after next login etc.
JSON WEB TOKEN library provides us what we need

Web token has three distinct parts seperated by a '.'
1>Base 64 encoded JSON string named Header, which contains info on what type of token it is(jwt ), and algorithm used to generate it
2>2nd is called Payload or body, also a base 64 encoded jSON string, contains the data we provided (id)
3>The end is our signature to verify the token

Goal of JWT isn't to hide the token, whole point isn't to hide the data (public can see it) so that it can be verifiable via the signature! Signature is secret so you cannot access other's data!

When we just login we need JWT, and also when we create new acc then we need JWT

**** As long as the token is up, user cannot logout or rather even if they close browser it will keep on staying and someone else can misuse it! To fix it we create a model called tokens and save the token itself and configure more, Express Middleware,
req.method -> HTTP method used
req.path -> path 
Without Middlewares : new request -> run route handler
With MiddleWares : new request -> do something -> run route handler

What we did was, we setup middeware for a specific route( users/me) and route handler
we authenticated it, see authentication.js, and it gives you error if the token doesn't match!

Grabbing all json data from db isn't a valuable thing, We just wanna fetch the user's data, else there is a risk of piracy! Hence we just change GET /users/ to GET /users/me
So now basically we do advanced postman thing, Create an environment for user and developer
use {{url}} instead of localhost:3000. It's called Environment variable
this will give us flexibility as we don't need to change uRL everytime we change it from localhost to something else
Just by changing one url we can do it!

How can we make multiple routes to use authentication besides copy pasting it?
There are two options -> Bearer token, and Inherit from parent
Bearer TOken generally, if we want to check for other user, we gotta give token again and again to all routes that need authentication,
Better to use Inherit from parent
This will give us flexibility as whenever we change the Bearer token of the whole Task App, it will be reflected on all places that require auth!

Except for signup, login and logout we don't need authentication hence we put that to No Auth
For login and creating data we put this line in test of postman

if (pm.response.code === 200) { //PostMan = pm, since status code when we make a user is 201
    pm.environment.set('authToken', pm.response.json().token)
}

This will make sure we don't put auth token again and again into the task Bearer window rather we use {{authToken}}

Now, We want to hide sensitive data, We don't wanna give user after login data like password, tokens, email etc.
Hence we hide the data! req.user is what gives us the info of user

Now establish a relationship between a user and task models. We gonna add a single field on user pulling in users a field in task pulling out resources of user! We do the latter

We want to make sure if the user made a task only he can delete it, else there's a risk of other ppl deleting it.
Hence we give owner property in every task making sure only owner is able to delete that!
In user models, we set up a virtual property, so that we link the user and task. We are not changing what we store, it's just a way for mongoose to figure out the link between two entities,
This way we can import task without including the whole task itself

WE then configured it in such a way that when we logged in from user1 we cannot access data of user2, since we are comparing with the id of the owner with the id of the user (Which has to match if user is logged in.). Hence other user cannot access the task of user1 or vice versa. We put auth of each and every routes to make sure there's authentication in every website!

Now, we cascade delete, we make sure user who's deleting his/her account, their data doesn't stay on our database. This will save us data -
Approach1 - Go to User Routes, put a code on deleting all tasks when we delete the user.
Approach2 - Use Middleware, to make a userScehma.pre to delete all task when user itself is deleted
