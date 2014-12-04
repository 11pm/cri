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
		function showNotification(){
			cri.notification = new Notification(response.sender, {
				body: response.message
			});	
			
			//create notification evt listener dynamicly
			cri.notification.onclick = cri.notify;

			//play audio
			$('.notification-sound')[0].play();

		}

		//if if its not you and the chat window is not open
		if (response.sender != cri.onChat && response.sender != cri.user.username){
			showNotification();
		}


		//add the message to chat history
		cri.chat.pm.push(response);
		//do something with the server response
		cri.appendpmChatMessage(response);
	},

	//Handles group messages
	groupmessage: function(response){
		cri.chat.group.push(response);
		//process the group message
		cri.appendGroupChatMessage(response);
	}

};