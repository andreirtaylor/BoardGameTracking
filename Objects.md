#Objects used in the game
Outline for the usage and naming of objects in this program.
This document is subject to change

###GAMEOBJECT
This is the object that contains the game data, it is passed between the client and the server, it is constantly being updated as the game progresses

```javascript
{
	"_id" : "dasfdasdadafdaasdfad", //this is assigned by mongo 
	"gamePlayers" : [  //An array of players that are currently in this game
		{  
			"name" : "Andrei",  // players username
			"cash" : 50 // players current money
		},  
		...
	], 
	"templateName" : "PowerGrid", //The name of the board game currently being played
	"room" : "3753-NB-MA" //4 digits - PROVINCE - STATE 
}
```

###GAMETEMPLATES
This is the template that is used to start the game, they remain static in the game templates directory

```javascript
{ 
    	_id: "adfadsf3234adfsafdafsdf" // this is assigned by mongo
    	startMoney:50, //ammount of money that a game defaults to  
    	templateName: "PowerGrid", //display name of the game, case sensitive
    	search : "POWERGRID" // case insensitive search for the game
    	maxPlayers: 2, // maximum number of players
    	minPlayers: 3, // minimum number of players
}
```
###USERS
The user object stores information of a registered user they are dynamy and stored in the playerInfo database

```javascript
{
	_id: :"adfasdakkdkadsaadfa" //id assigned by mongo
	username: "Andrei" // username 
	hash: "string" // password this should never be sent to the client
	completedGames: [ //array of object ids of games completed ordered by creation
		"asdfads8fiads9f8asdfia9d8", //game id in gamedb
		...	
	],
	inprogress:[ // list of object id's of games in progress, ordered by creation
		"ads80f9as8dfiad9f0adsifa09", //game id in gamedb
		...
	]
}
```
