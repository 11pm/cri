/*
@name: Handler
@author: 11pm
@role: handles websocket responses
*/
var handler = {

	login: function(response){

		//login worked
		if(response.success === true){

			cri.user = response.details;
			cri.user.friends = response.friends;

			cri.init();
		}
		else{
			console.log("too bad");
		}

	},
	
	message: function(response){
		//add the message to chat history
		cri.chat.push(response);

		var sender = response.sender;
		var you    = cri.user.username;

		//if you did not send the message
		/*if(sender !== you){
			alert("You just got a message from " + response.sender);

			var context = {
				username: sender
			}
			//open chat with the user that sent you a message
			cri.renderTemplate("chat", context);			
		}*/

		var chatMsg = cri.chatMessage(response);
		$(".messages").append(chatMsg);
	}

}