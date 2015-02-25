# MoneyTracker
  *Easy tracking of board game money.*

This, will be, a web based application that allows players to track their money while playing board games.

This project is still under considerable development. Right now it is completely unusuable.

For now the instructions below are for Jonah and Adam (and sometimes Jason) so I am only outlining installation on Ubuntu and OSX

## How to Install and run

1. Install nodejs from [nodejs.org](http://nodejs.org/download/)

2. Clone the repository into a safe place

#### If you have node and npm installed

3. Go to the direcory using the command line

4. Type

 ``` npm start ```

#### If you do not have npm installed

3. Go to the local /bin directory (the one within the MoneyTracker folder)

   ```cd ./bin```

4. Depending on your system you have to type
   ```node www``` or ```nodejs www```
  *try both, one of them will work*

### MongoDB (That Database Thing)

MongoDB should be run in a separate terminal window from node and protractor

1. [Download the installer](http://www.mongodb.org/downloads?_ga=1.137970489.844461423.1423907808) and run it

  **Ubuntu Installation**

   ```sudo apt-get install mongodb```

2. in the command line type

   ```mongod --version```

  to make sure it installed correctly

3. Run the command

  ```mongod --dbpath=./sampleDB --port 55555```

  This will start a local database inside of sampleDB this will take some time.

  **Do not add this folder to the repository** It is a local database for you own development

4. Now follow the above *Install and Run* commands to start the server

### Protractor (That testing thing.... or something)

This is only useful on the front end, Adam you can stop reading.

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
