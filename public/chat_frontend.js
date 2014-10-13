//Need to create AJAX that would do

//1. send an request to localhost:8080/
//2. after response is recieved, send a request to localhost:8080/:uniqueid/:chatid
//3. after response is recieved, send a request to localhost:8080/:uniqueid/:chaid/:private_key_pair (calulate p_k_p)
//4. request another pvt key localhost:8080/:uniqueid/:chatid/requestinfo
//5. poll (number 4)

//6. After everything is fine. Start communicating.
//7. Encrypt everything on client side with the key.
//8. Transmit: localhost:8080/:uniqueid/:chatid/postMsg (message in POST)
//9. Ajax polling to recieve: localhost:8080/:uniqueid/:chatid/recvMsg (encrypted, decrypt in client and show)
//10. Done, are we? 

var ajax = new XMLHttpRequest(); //Doesn't Work on browser? Welcome to the 21st century.

var done = 0; //To keep track of where we are.
var chatid = 1; //chatid==1
var uniqueid = "";
var publickey;
var gen;
var mypvtkey;
var mymixkey;
var othersmixedkey;
var finalkey;

ajax.onreadystatechange = function(){
    if(ajax.readyState==4 && ajax.status==200){
	//carryon
	proc(ajax.responseText);
    }
}

//proc(); //replace this by trigger code (via html) 

function proc(resp_txt){
    switch (done){

	case 0:
	done = done + 1;
	console.log("Case 0 ended");
	ajax.open("GET", "/", true);
	ajax.send();
	break;

	case 1:
	if(resp_txt != "") {
	    uniqueid = resp_txt;
	    console.log(uniqueid);
	    document.getElementById("invite_id_1").value = uniqueid;
	    document.getElementById("invite_id_1").setAttribute("readonly", "readonly");
	    done = done + 1;
	    ajax.open("GET", "/"+uniqueid+"/"+chatid, true);
	    ajax.send();
	} else {
	    proc();
	}	
	break;

	case 2:
	//check if you have all the steps completed from step one or not.
	if(resp_txt != ""){
	    resp_txt = resp_txt.split(",");
	    publickey = resp_txt[0];
	    //console.log(publickey);
	    gen = resp_txt[1];
	    done = done + 1;
	    //choose random private key.
	    mypvtkey = genPrime();
	    //var mymixkey; //do calcs
	    mymixkey = Math.pow(gen, mypvtkey) % publickey;  
	    ajax.open("GET", "/"+uniqueid+"/"+chatid+"/"+mymixkey, true);
	    ajax.send();
	    
	} else {
	    ajax.open("GET", "/"+uniqueid+"/"+chatid, true);
	    ajax.send();
	}
	break;

	//Case 3 would be to check if the thing was success or not
	//Check if the first character in resp_txt was 1 or not.
	//If yes, proceed to case 4
	//else do the ajax of 3 again. 
	case 3:
	if(resp_txt.substr(0,1)==1){
	    done = done + 1;
	    ajax.open("GET", "/"+uniqueid+"/"+chatid+"/requestinfo", true);
	    ajax.send();
	} else {
	    ajax.open("GET", "/"+uniqueid+"/"+chatid+"/"+mymixkey, true);
	    ajax.send();
	}
	break;
	
	//!![[You could use some arg to functionify ajax]]!!
	/*case 3:
	//Now you've sent your mixed key. 
	//Sending's complete. Trying now to recieve other's mixedkey
	if(resp_txt != NaN && resp_txt != "") {
	    othersmixedkey = resp_txt;
	    //everything found, now calculate common key.
	    key = Math.pow(othersmixedkey, mypvtkey) % publickey;
	    done = done + 1; 
	    ajax.open("GET","/"+uniqueid+"/"+chatid+"/requestinfo");
	} else {
	    ajax.open("GET", "/"+uniqueid+"/"+chatid+"/"+mymixkey, true);
	    ajax.send();
	}
	break;
*/

	case 4:
//	if(resp_text is json), check if (it's valid and OK)
	//everything else is bs(bullshit)
	//if(resp_text
	if(obj = tryParseJSON(resp_txt)){
	    //Check if it contains, everyone's info.
	    if(it_contains_everyones_info){
		//calculate private key
		//set the status to ready
		//procced to case 5
		break;
	    }
	}
	//the case is not break-ed, till now
	//So, do the previous thingy
	break;
	
	case 5:
	//Check if the returned value is "1\nSuccess"
	//if yes, you're done. Now you can send messages,Using other thingys
	//if no, do 4 again (or 3?)
	break;
	
	default:
	break;
    }
}
u
function genPrime () {
    var arr_prime = [2,3,5,7,13,17,19,23];
    var prime = arr_prime[Math.floor(Math.random()*arr_prime.length)];
    return prime;
 }
//I think asynch will be bad. Instead we'll try a synch request and use asynch only for the polling after wards. 


//From an StackOverflow Answer: http://stackoverflow.com/a/20392392
//by Matt H. (http://stackoverflow.com/users/244374/matt-h) 

function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }

    return false;
};


function trigger_newChat(){
    //Write code to trigger new chat. 
    //Actually, call proc.
    proc();

}

function trigger_invitedChat(){
    //Some Text-Input-Elem must contain the uniqueid
    //Use that, and start from done = 2;
    //But do the Ajax-things of done = 1;
    //Maybe a new ajax var and 
    //on that success, call proc();
    done = 2;
    var a = document.getElementById('invite_id_1');
    uniqueid = a.value;
    chatid = 2;
    console.log("Uniqueid: "+uniqueid);
    console.log("chatid: "+chatid);
    console.log("Now AJAXing...");
    ajax.open("GET", "/"+uniqueid+"/"+chatid,true);
    ajax.send();
    console.log("AJAX request Sent");
}

//ajax.open("GET/POST", "req.url", asynch true/false);
// Fore POST ==> ajax.setRequestHeader("Content-Type:application/x-www-form-urlencoded"); //or multipart/form-data
//ajax.send(params)
