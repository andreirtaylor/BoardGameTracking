# MoneyTracker
  *Easy tracking of board game money.*

This, will be, a web based application that allows players to track their money while playing board games.

This project is still under considerable development. Right now it is completely unusuable.

For now the instructions below are for Jonah and Adam (and sometimes Jason) so I am only outlining installation on Ubuntu and OSX

Money Tracker is built on node 0.12.*

## How to Install and run

There are basically 3 steps
1. Install MongoDB
2. Install node
3. Clone and run the tracker

### Install MongoDB (That Database Thing) 
Mongo is cumpulsory. The server will not run without it.

This is a summary of the rules found [here](http://docs.mongolab.com/connecting/#connect-string)

1. Sign up for a free accout on [MongoLab](https://mongolab.com)
2. Click on add database user and make a username and password.

3. Put the username and password into the URI from the top of the mongolab page (case-sensitive)
   ![](http://docs.mongolab.com/assets/screenshot-connectinfo.png)
   ```i.e. "mongodb://wickedUsername:gloriousPassword@ds12345.mongolab.com:578910/sample-db" ```

2. Make a new environment variable for this database (you will have to do this everytime you want to run the server).
   **DISCLAIMER: If an elite HAX0R gets ahold of the URI they have complete control of your database. Keep this private**
   *if you want to save this variable permanently stored google how to set environment variables.*

   In Unixland:
   ```export DATABASE= "mongodb://<dbuser>:<dbpassword>@<randomnumber>.mongolab.com:port/<Databasename>"```

   In Windows CMD:
   ```set PORT=1234```
  
   In Windows PowerShell:
   ```$env:PORT = 1234```

4. Run this command (you will only need to do this once per database)
   ``` node test/setupSampleDB ``` this will give you the available game templates

### Install Node
1. Install nodejs from [nodejs.org](http://nodejs.org/download/)

### Clone and run the tracker
1. Clone the repository into a safe place ```git https://github.com/andreirtaylor/MoneyTracker.git```

2. Go to the repo directory using the command line ``` cd MoneyTracker ```

3. type this ```npm start``` if that doesnt work try ```nodejs bin/www.js```
  
   you should see something along the lines of
   ``` 
   Connected correctly to Database
   ds12345.mongolab.com:578910/sample-db
   Listening on port 3000
   ```
   
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
