/*
@name: Handler
@author: 11pm, halldor32
@role: handles websocket responses
*/
var handler = {

	//Handles login
	login: function(response){

		//login worked
		if(response.success === true){
			
			//set user info
			cri.user         = response.details;
			cri.user.friends = response.friends;
			cri.user.groups  = response.groups;

			cri.init();
		}
		else{
			//show error message
			$('.login-error').html("<span class='error'>Login failed</span>");
		}

	},
	
	//Handles PM's
	message: function(response){
		//notification stuff
		// cri.showNotification(response);

		//if if its not you and the chat window is not open
		if (response.sender != cri.onChat && response.sender != cri.user.username){
			cri.showpmNotification(response);
		}


		//add the message to chat history
		cri.chat.pm.push(response);
		//do something with the server response
		cri.appendpmChatMessage(response);
	},

	//Handles group messages
	groupmessage: function(response){

		//notification stuff
		// cri.showGroupNotification(response);

		//if if its not you and the chat window is not open
		if (response.group != cri.onChat && response.sender != cri.user.username){
			cri.showGroupNotification(response);
		}

		cri.chat.group.push(response);
		//process the group message
		cri.appendGroupChatMessage(response);
	}

};