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
		//notification stuff
		//var body = response.""
		function sendNotification(){
			cri.notification = new Notification(response.sender, {
				body: response.message
			});	
		}

		//if if its not you
		if (response.sender != cri.user.username){
			sendNotification();
		}


		//add the message to chat history
		cri.chat.pm.push(response)
		console.log(response)
		cri.appendpmChatMessage(response);
	},

	//Handles group messages
	groupmessage: function(response){
		cri.chat.group.push(response)
		console.log(response)
		cri.appendGroupChatMessage(response);
	}

};