# BoardGameTracking
  *Paper is lame, track your games in real-time online!*

This is a web based application that allows players to track their money while playing board games.

Just click on new game then enter in the names of the players in the game.

Tell the other players what room to go to i.e. ```boardgametracking.com\9938-SK-FL```

Clicking on a player will bring up a calcultor, simply enter in the money that they are gaining or losing and press update.

Any changes made are immediately sent to everyone in the room.

Money Tracker is built on node 0.12.*

## How to Install and run

BoardGameTracking is hosted at [boardgametracking.com](www.boardgametracking.com ). These instructions are for the intrepid user who wants to install their own copy on a local machine.

There are basically 3 steps
1. Install MongoDB
2. Install node
3. Clone and run the tracker

### Install Node
1. Install nodejs from [nodejs.org](http://nodejs.org/download/)

### Clone the repo
1. Clone the repository into a safe place ```git https://github.com/andreirtaylor/boardgametracking.git```

2. Go to the repo directory using the command line ``` cd boardgametracking ```

3. type this ```sudo npm install``` or ```npm install``` if on windows

### Install MongoDB (That Database Thing) 
Mongo is cumpulsory. The server will not run without it.

This is a summary of the rules found [here](http://docs.mongolab.com/connecting/#connect-string)

1. Sign up for a free accout on [MongoLab](https://mongolab.com)
2. Click on the "Users" tab then add database user.
   **remember the username and password of the database user as they are the ones used below**

3. Put the username and password of the **database user you just created** into the URI from the top of the mongolab page (case-sensitive)
   ![](http://docs.mongolab.com/assets/screenshot-connectinfo.png)
   ```i.e. "mongodb://wickedUsername:gloriousPassword@ds12345.mongolab.com:578910/sample-db" ```

2. Make a new environment variable for this database (you will have to do this everytime you want to run the server).
   **DISCLAIMER: If an elite HAX0R gets ahold of the URI they have complete control of your database. Keep this private**
   *if you want to save this variable permanently stored google how to set environment variables.*

   In Unixland:
   ```export DATABASE= "mongodb://<dbuser>:<dbpassword>@<randomnumber>.mongolab.com:port/<Databasename>"```

   In Windows CMD:
   ```set DATABASE="mongodb://<dbus....```
  
   In Windows PowerShell:
   ```$env:DATABASE = "mongodb://<dbus....```

4. Run this command (you will only need to do this once per database)
   ``` node test/setupSampleDB ``` this will give you the available game templates

### Run the program
3. type this ```npm start```
  
   you should see something along the lines of
   ``` 
   Connected correctly to Database
   ds12345.mongolab.com:578910/sample-db
   Listening on port 3000
   ```
4. Go to ```localhost:3000``` in your browser and enjoy

##Testing

### Mocha

``` npm install mocha -g ```

### Nodemon

``` npm install nodemon -g ```

### Protractor (That front end testing thing.... or something)

Protractor relies on webdriver-manger running in the background and therefore should be run in a separate window from node and mongoDB. You should leave this process running while you are writing anything on the front end.

1. Make sure you have the [Java SDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed
   *jdk8 will eventually be out of date so make sure you are downloading the right version*

   **Ubuntu Instalation**

     ```sudo apt-get install default-jre```

    then

     ```sudo apt-get install defaulr-jdk```

2. Install protractor

  ```npm install -g protractor```

3. Run the command

  ```webdriver-manager update```

4. Now run

  ```webdriver-manager start```

If this runs without a hitch then whenever you want to run the front end tests you can head on over to your friendly-neighborhood ```Moneytracker/spec``` directory and run the tests with the command

  ``` protractor conf.js --verbose ``` *verbose makes the errors print*

## Errors

If you are running Ubuntu you may get a pretty criptic error saying that you dont have node installed. If this happens to you, install ```nodejs-legacy```

      ```sudo apt-get install nodejs-legacy```

For more information on why you have to do this see [here](http://stackoverflow.com/questions/21168141/can-not-install-packages-using-node-package-manager-in-ubuntu)

### Cant connect to the database?
Make sure you are using the username and password of a database user that you created. This is not the username that you use to login to mongolab. 
