
var cri = {
	templateFolder: 'templates/',
	
	//all details about a user	
	user: {
		id: -1, 
		username: null,
		password: null, 
		user_created: null,
		friends: []
	},

	init: function(){
		//if user has correct credentials
		if(cri.isAuth()){
			cri.renderTemplate('main', cri.user);
		}
		else{
			cri.renderTemplate('login');
		}

	},

	//handle responses from server
	onmessage: function(response){
		var type = JSON.parse(response.data);
		console.log(response)
		//the type of response
		switch(type.type){
			case "login":
				handler.login(response);
				break;
		}

	},

	isAuth: function(){
		return this.user.id > 0;
	},

	loginClick: function(e){
		e.preventDefault();
		var that = $(this);
		var username = that.find('.username').val();
		var password = that.find('.password').val();

		webClient.send({type: "login", data: { username: username, password: password }});
	},

	clickFriend: function(e){

		e.preventDefault();
		var that = $(this);
		var data = that.data();

		var chat = $('.chat');
		cri.renderTemplate('chat', data);

	},

	renderTemplate: function(name, context){

		var templateName = function(name){
			return cri.templateFolder + name + '.html';
		};

		$.ajax({
			url: templateName(name),
			type: "GET",
			cache: false,
			success: function(html){
				var template = Handlebars.compile(html);

				//if we have hsb var, use them
				if(typeof context !== "undefined")
					$('.'+name).html(template(context));
				else
					$('.'+name).html(html);
			} 
		});

	},

	chatMessage: function(msg){
		var html = "";

		//if its from you
		if(cri.user.username == msg.sender)
			html += "<li class='success'>";
		else
			html += "<li class='danger'>";

		html += "<div class='panel'>";
		html += msg.sender;
		html += "<br>";
		html += msg.message;
		html += "</div>";

		html += "</li>";
		return html;
	},

	//send the message server
	sendMessage: function(e){
		
		e.preventDefault();
		var sender = cri.user.username;
		var receiver = $(this).find('.receiver').data("receiver");
		var message = $(this).find('.message').val();
		
		webClient.send({type: "private", 
			data: {
				message: message, 
				sender: sender, 
				receiver: receiver
			}
		}, function(response){
			
			//get json from server
			var fromServer = JSON.parse(response.data);
			console.log(fromServer)
			var chatMsg = cri.chatMessage(fromServer);

			$(".messages").append(chatMsg);

		});

		

	},

};

$(document).ready(cri.init);

//Login submited
$('body').on('submit', '.loginForm', cri.loginClick);

$('body').on('click', '.friend', cri.clickFriend);

$('body').on('submit', '.messageForm', cri.sendMessage);

websocket.onmessage = function(response){

	cri.onmessage(response);

}