/*
@name: Handler
@author: 11pm
@role: handles websocket responses
*/
var handler = {

	//Handles login
	login: function(response){

		//login worked
		if(response.success === true){

			cri.user         = response.details;
			cri.user.friends = response.friends;
			cri.user.groups  = response.groups;

			cri.init();
		}
		else{
			console.log("too bad!");
		}

	},
	
	//Handles PM's
	message: function(response){
		//add the message to chat history
		cri.chat.pm.push(response)
		console.log(response)
		var chatMsg = cri.chatMessage(response);
		$(".messages").append(chatMsg);
	},

	//Handles group messages
	groupmessage: function(response){

	}

};