
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

	//keep history of user chat
	chat: [],

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
		console.log(response)
		//convert response to JSON
		response = JSON.parse(response.data);
		var type = response.type;
		//the type of response
		switch(type){
			case "login":
				handler.login(response);
				break;
			case "PM":
				handler.message(response);
				break;
			default:
				console.log(response)
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
		var data = $(this).data();
		var chat = $('.chat');

		//get chat message from the user
		var messages = cri.getChatMessages(data.username);
		console.log(messages)
		
		var context = {
			user: data,
			messages: messages
		};

		cri.renderTemplate('chat', context);

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

	//Get messages from history for a certain user
	getChatMessages: function(from){
		//a collection of messages to return
		var messages = [];
		cri.chat.forEach(function(obj, index) {

			//get message from you and to you
			var sender = obj.sender == from;
			var receiver = obj.receiver == cri.user.username;

			if(sender || receiver){
				messages.push(obj);
			}

		});
		return messages;
	},

	//send the message server
	sendMessage: function(e){
		
		e.preventDefault();
		var sender = cri.user.username;
		var receiver = $(this).find('.receiver').data("receiver");
		var message = $(this).find('.message');
		
		//Send message to server
		webClient.send({type: "private", 
			data: {
				message: message.val(), 
				sender: sender, 
				receiver: receiver
			}
		});
		//Clear the box
		message.text("");
	},

};

$(document).ready(cri.init);

//Login submited
$('body').on('submit', '.loginForm', cri.loginClick);

$('body').on('click', '.friend', cri.clickFriend);

$('body').on('submit', '.messageForm', cri.sendMessage);

//make a custom handler for ws onmessage
websocket.onmessage = cri.onmessage;