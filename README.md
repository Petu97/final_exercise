# final_exercise

final exercise for backend programming course

This application is a simple platform for conversations, kind of like reddit, hence the name "Fakkit". This application is a final exercise for backend programming course. The majority of this application is written by me, while tracking teachers example template(routing, authentication).

Note: This application doesn't use the same database layout as teacher's. You can find the mongoDB schemas i use in 'models' folder. For me the database is called 'messagedb' and it consists of 2 collections: messages and users.

Another note: HTML5 does not support PUT and DELETE requests, so i haven't included modification or delete functions. However i left rough examples of them in code.

## Getting started

1. Download repostory
2. Open project folder
3. Write npm install to download node modules listed on package file
4. Run server
5. Open webpages (links below)

## Quick links

Video <https://drive.google.com/file/d/1iczQZj08t0Aryb7A32sRrs0_0tJoyTwS/view?usp=sharing>

Login page <http://localhost:8080/users/login/>

Topics page <http://localhost:8080/fakkit/topics/>

## Application consists of:

index.js - Works as a "master" server file: establishes connection to database, initializes sessions, passport authentication and routing, creates server.

### messageRouter

Handles GET and POST requests for topics and commenting. Includes main page for viewing all topics, individual topics that you can access by clicking a link on the main page or by manually adding the id of the message to browser address. PassportSessionCheck middleware checks for user authentication before moving on(everyone can see topics and comments, but only logged in users can comment and rate). Router directs users to webpages, which you can find in the 'views' folder.

### userRouter

This router handles the routing for login and signup operations. Just like messageRouter, this one directs users to webpages which can be found in 'views' folder.

### views

You can find the html webpages here. Since the idea of this course is to focus in backend, the frontend is pretty rough. I chose to use 'ejs' files for the frontend since i've worked with it before.
