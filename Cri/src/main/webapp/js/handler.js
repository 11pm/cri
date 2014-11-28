/*
@name: Handler
@author: 11pm
@desc: handles websocket responses
*/
var handler = {

	login: function(response){

		console.log(response)
		response = JSON.parse(response.data);

		//login worked
		if(response.success === true){

			cri.user = response.details;
			cri.user.friends = response.friends;

			cri.init();
		}
		else{
			console.log("too bad");
		}

	}

}