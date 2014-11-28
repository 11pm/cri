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
		var chatMsg = cri.chatMessage(response);
		$(".messages").append(chatMsg);
	}

}