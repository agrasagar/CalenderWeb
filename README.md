###MCD Calender API
* Agrasagar Bhattacharyya
* Dinesh Hyaunmikha
###List of APIs
CalendarAPI provides below mentioned services for creating, editing, deleting and searching the events saved in the database. These work as an interface between the calender UI  application and the database.


1. Index GET /event
2. Create POST /events
3. Show GET /events/:id
4. Update PUT /events/:id
5. Destroy DELETE /events/:id
6. Search POST /events/search

######Parameters
*name: String
*start_date: yyyy-mm-dd
*start_time: hh:mm
*end_date: yyyy-mm-dd
*end_time: hh:mm
*description: String
*repeat: may be one of {"none", "daily", "weekly", "biweekly", "monthly", "yearly"}
###Expressjs
“Expressjs” is a framework for “nodejs” to develop RESTful web services. Express generator can be used to generate expressjs projects and get it running with less hassles.
###Resource-routing
Middleware “resource-routing” has been used for automatic generation of the resourceful routes for resources (“events” in this application). It maps directly with the controller named with suffix “_controller.js” to the name of the resource (“events”).
###Mongoskin
Mongoskin has been used as a driver to connect the application to MongoDB. It is based on “mongodb” native javascript driver and hence is schemaless.
###Data Validation
Before creating and updating any events in the database, provided event fields are validated and if invalid, error messages will be sent in the response. Name and start date are mandatory fields. Dates should be a string in “yyyy-mm-dd” format and times should be in “hh:mm” format.
###Server set up:
1. Source code:
    git clone https://github.com/agrasagar/MCD.git 
    or  Extract from the zip
2. Install dependencies:   
    npm install
3. Testing:
    Open postman and send request for GET  http://localhost:8080
