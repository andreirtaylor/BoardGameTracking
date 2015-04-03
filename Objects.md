GAMEOBJECT

{
    playerList:[
        {
            id:0,
            name: "Andrei",
            money: 50
        },
        ...
    ],
    startMoney:50
    ,gameName: "samplegame"
    ,numberOfPlayers: 5
}

GAMETEMPLATES

{ 
    startMoney:50, 
    templateName: "PowerGrid"
}

USERS

{
	_id: {
		$oid:"8a0dsda8dfiasd90f8adsadf8" //users unique id 
	},	
	username: "string",
	hash: "string" // password,
	completedGames: [
		{
			id: "asdfads8fiads9f8asdfia9d8" //link in gamedb
		},
		...	
	],
	inprogress:[
		{
			id:"ads80f9as8dfiad9f0adsifa09" //link in gamedb
		},
		...
	]
}
