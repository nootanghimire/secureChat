var http = require("http");
var express = require("express");
var io = require('socket.io');
var crypto = require("./crypto.js");
var helper = require("./helper.js");

var app = express();
var server = http.createServer(app);

var chats = [];

var msgqueue = []; 
var dummy_msgqueueObj = {chatid:"00", msgArray:[], from:1};
var dummy_msgArray = {msg_text:"Message Text", date:new Date()}
//Party: Can be one or two
dummy_msgqueueObj.msgArray.push(dummy_msgArray);
msgqueue.push(dummy_msgqueueObj);


app.use(express.static(__dirname + '/public'));
server.listen(8080);

io = io.listen(server);


app.get("/chitchat", function(req, res) {

    //Just send them a file, ?
    res.sendfile('views/chat_frontend.html');

});

app.get("/", function(req,res) {
	//Assign a random chatid
	var chat =  helper.genUniqueTextId(chats);
	var dt = new Date();
	var obj = {
		chat_id: chat,
		public_key:"",
		private_key_pair_1:"",
		private_key_pair_2:"",
		is_active_1:false,
		is_active_2:false,
		last_active_on: dt
		}
	chats.push(obj);
	console.log("Chats Array: App got '/' ");
	console.log(chats);
	//res.write("Please Goto localhost:8080/"+chat+"/1");
        res.write(""+chat+"");
	res.end();
	//res.sendfile('views/chat.html');
});



app.get("/:uniqueid/:chatid", function(req, res) {
	//Chatid contains: chat person (Maybe 1 or 2)
	//UniqueID contains: The unique id of chat currently happening.
	console.log("App got '/"+req.params.uniqueid+"/"+req.params.chatid+"' And Public Key was assigned");
	obj = helper.inObjectArray(req.params.uniqueid, chats, "chat_id")
	if(!obj) {
		res.sendfile('views/error_id_not_found.html');
		return;
	}
	var chatid;
	if(req.params.chatid==1 || req.params.chatid==2) {
		chatid = "is_active_"+req.params.chatid;
	} else {
		console.log("Error! Chatid neither 1 not 2!");
		res.write("Oops! Something is not possible! :'( ")
		res.end();
		return;
	}
	if(obj.public_key=="") {
		obj.public_key = crypto.genPrime();
	}
	obj[chatid] = true;
	obj.last_active_on = new Date();
	console.log("Chats Array");
	console.log(chats);
        //stick to gen = 5 for now.
	res.write(obj.public_key.toString()+",5");
        res.end();


	//res.send(publickey)
	//If One or two.
	//Generate Public key. 
	//Broadcast it.
	//listen for private, public pair from one or two. (maybe another app.get?)
	//broadcast them
});

app.get("/:uniqueid/:chatid/:private_key_pair", function(req, res) {
	console.log("App got: '/"+req.params.uniqueid+"/"+req.params.chatid+"/"+req.params.private_key_pair+"'");
	//Now assign private_key_pair_chatid :D
	//For this chatid must be active.
	obj = helper.inObjectArray(req.params.uniqueid,chats,"chat_id");
	if(!obj) {
		res.sendfile('views/error_id_not_found.html');
		return;
	}
	
	if(obj.public_key=="") {
		console.log("No public key? WTF!");
		res.write("Oops! You did something incorrect! :/ ");
		res.end();
		return;
	} 
	var chatid;
	if(req.params.chatid=="1" || req.params.chatid==2) {
		chatid = "is_active_"+req.params.chatid;
	} else {
		console.log("Error! Chatid neither 1 or 2!");
		res.write("Oops! Something is not possible! :'( ")
		res.end();
		return;
	}

	if(!obj[chatid]){
		console.log("Error! " + chatid + "cannot be false if s/he is giving out private key pair");
		res.write("Oops! Something is not possible! :'( ")
		res.end();
		return;
	}

	//Now we can recieve private_key_pair. 
	obj["private_key_pair_"+req.params.chatid] = req.params.private_key_pair;
	obj.last_active_on = new Date();
	console.log("Written private_key_pair_"+req.params.chatid);
	res.write("1\nSuccess. Now poll for all info");
});

app.get("/:uniqueid/:chatid/requestinfo", function(req, res) {
	//Check  and authenticate uniqueid and chatid
	//Give out all the info in json if there is some
	//Or give some error information
	obj = helper.inObjectArray(req.params.uniqueid, chats, "chat_id");
	if(!obj) {
		res.sendfile('views/error_id_not_found.html');
		return;
	}
	
	if(obj.public_key=="") {
		console.log("No public key? WTF!");
		res.write("Oops! You did something incorrect! :/");
		res.end();
		return;
	}		

	var chatid;
	if(req.params.chatid=="1" || req.params.chatid==2) {
		chatid = "is_active_"+req.params.chatid;
	} else {
		console.log("Error! Chatid neither 1 or 2!");
		res.write("Oops! Something is not possible! :'( ")
		res.end();
		return;
	}

	if(!obj[chatid]){
		console.log("Error! " + chatid + "cannot be false if s/he is giving out private key pair");
		res.write("Oops! Something is not possible! :'( ")
		res.end();
		return;
	}

	//In the end, write out the object. 
	res.write(obj);
	res.end();
	return;

});

app.get("/:uniqueid/:chatid/postmessage", function(req, res) {
	//The Post-var contains the (garbled) message. Send that to the user.
	//i.e., save in messagequeue object!

});

app.get("/:uniqueid/:chatid/requestmessage", function(req,res) {
	//Give out the info from the messagequeue object. 
});


//Client will use AJAX polling to send requests and use their own encryption tech.
//We only serve as key exchanging and encrypted message exchanging system.
//However, they should use other chat mechanisms to give out the unique link on which they can chat on. 
//(Like in movies :P )
